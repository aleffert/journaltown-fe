import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { Async, Optional, ObjectCodomain } from "../utils";
import { callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import { Post } from "../services/api/models";
import { postsRequest, PostsResult, PostsFilters } from "../services/api/requests";


type FeedState = {
    posts: {[id: number]: Post}
    nextPostsResult: Async<PostsResult>
    changedPostsResult: Async<PostsResult>
};
class FeedReducers extends ImmerReducer<FeedState> {
    setNextPostsResult(result: FeedState['nextPostsResult']) {
        this.draftState.nextPostsResult = result;
    }
    setChangedPostsResult(result: FeedState['changedPostsResult']) {
        this.draftState.nextPostsResult = result;
    }
    integratePosts(updates: Post[]) {
        for(const update of updates) {
            this.draftState.posts[update.id] = update;
        }
    }

    deletePost(postId: number) {
        delete this.draftState.posts[postId];
    }

    loadNextPosts(_: {since: Optional<string>}) {}
    loadChangedPosts(_: {since: Optional<string>}) {}
}

export const actions = createActionCreators(FeedReducers);
export const reducers = createReducerFunction(FeedReducers, 
    {posts: {}, nextPostsResult: undefined, changedPostsResult: undefined}
);

function* getPostsSaga(
    since: Optional<string>, makeParams: (since: string) => PostsFilters, 
    action: (result: Async<PostsResult>) => ReturnType<ObjectCodomain<typeof actions>>
) {
    yield put(action({type: 'loading'}));

    const params = since ? makeParams(since) : {};
    const result = yield callApi(postsRequest(params));
    if(result.type === 'success') {
        yield put(actions.integratePosts(result.value));
    }
    yield put(action(result));
}

export function* getNextPostsSaga(action: ReturnType<typeof actions.loadNextPosts>) {
    yield* getPostsSaga(action.payload[0].since, since => ({created_at__lt: since}), actions.setNextPostsResult);
}

export function* getChangedPostsSaga(action: ReturnType<typeof actions.loadChangedPosts>) {
    yield* getPostsSaga(action.payload[0].since, since => ({last_modified__gt: since}), actions.setChangedPostsResult);
}

export function* saga() {
    yield takeEvery(actions.loadNextPosts.type, getNextPostsSaga);
    yield takeEvery(actions.loadChangedPosts.type, getChangedPostsSaga);
}