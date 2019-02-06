import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { Async, Optional, ObjectCodomain } from "../utils";
import { callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import { Post } from "../services/api/models";
import { postsRequest, PostsResult, PostsFilters, PostsFeedFilters } from "../services/api/requests";
import qs from 'query-string';


type FeedStatus = {
    filters: PostsFeedFilters
    nextPostsResult: Async<PostsResult>
    changedPostsResult: Async<PostsResult>
    postIds: number[]
}

type FeedState = {
    feeds: {[key: string]: Optional<FeedStatus>}
    posts: {[id: number]: Post}
};

export function keyForFilters(filters: PostsFeedFilters) {
    return qs.stringify(filters);
}

class FeedReducers extends ImmerReducer<FeedState> {
    setNextPostsResult(filters: PostsFeedFilters, result: FeedStatus['nextPostsResult']) {
        const key = keyForFilters(filters);
        const feed = this.draftState.feeds[key] || {
            filters, nextPostsResult: undefined, changedPostsResult: undefined, postIds: []
        }
        feed.nextPostsResult = result;
        this.draftState.feeds[key] = feed;
    }
    setChangedPostsResult(filters: PostsFeedFilters, result: FeedStatus['changedPostsResult']) {
        const key = keyForFilters(filters);
        const feed = this.draftState.feeds[key] || {
            filters, nextPostsResult: undefined, changedPostsResult: undefined, postIds: []
        }
        feed.changedPostsResult = result;
        this.draftState.feeds[key] = feed;
    }
    integratePosts(filters: PostsFeedFilters, updates: Post[]) {
        for(const update of updates) {
            this.draftState.posts[update.id] = update;
        }
        const key = keyForFilters(filters);
        const feed = this.draftState.feeds[key] || {
            filters, nextPostsResult: undefined, changedPostsResult: undefined, postIds: []
        }
        const postIds = updates.map(post => post.id);
        feed.postIds = [...new Set([...feed.postIds, ...postIds])];
        this.draftState.feeds[key] = feed;
    }

    deletePost(postId: number) {
        delete this.draftState.posts[postId];
        for(const feedKey in this.draftState.feeds) {
            const feed = this.draftState.feeds[feedKey];
            if(feed) {
                const postIds = new Set(feed.postIds);
                postIds.delete(postId)
                feed.postIds = [...postIds.values()];
            }
        }
    }

    loadNextPosts(_: {filters: PostsFeedFilters, since: Optional<string>}) {}
    loadChangedPosts(_: {filters: PostsFeedFilters, since: Optional<string>}) {}
}

export const actions = createActionCreators(FeedReducers);
export const reducers = createReducerFunction(FeedReducers, 
    {posts: {}, feeds: {}}
);

function* getPostsSaga(
    filters: PostsFeedFilters, since: Optional<string>, makeParams: (since: string) => PostsFilters, 
    action: (result: Async<PostsResult>) => ReturnType<ObjectCodomain<typeof actions>>
) {
    yield put(action({type: 'loading'}));

    const params = since ? makeParams(since) : {};
    const result = yield callApi(postsRequest(Object.assign({}, filters, params)));
    if(result.type === 'success') {
        yield put(actions.integratePosts(filters, result.value));
    }
    yield put(action(result));
}

export function* getNextPostsSaga(action: ReturnType<typeof actions.loadNextPosts>) {
    const filters = action.payload[0].filters;
    yield* getPostsSaga(filters, action.payload[0].since, since => ({created_at__lt: since}), r => actions.setNextPostsResult(filters, r));
}

export function* getChangedPostsSaga(action: ReturnType<typeof actions.loadChangedPosts>) {
    const filters = action.payload[0].filters;
    yield* getPostsSaga(filters, action.payload[0].since, since => ({last_modified__gt: since}), r => actions.setChangedPostsResult(filters, r));
}

export function* saga() {
    yield takeEvery(actions.loadNextPosts.type, getNextPostsSaga);
    yield takeEvery(actions.loadChangedPosts.type, getChangedPostsSaga);
}