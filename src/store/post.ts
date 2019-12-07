import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { postRequest, PostResponse, ApiAsync } from '../services/api/requests';

import { put, takeEvery } from 'redux-saga/effects';
import { callApi } from '../services';

type PostState = {
    posts: {[id: number]: ApiAsync<PostResponse>},
}
class PostReducers extends ImmerReducer<PostState> {
    // state
    setPostResult(params: {postId: number, value: ApiAsync<PostResponse>}) {
        // TODO: garbage collect
        this.draftState.posts[params.postId] = params.value;
    }
    clearPost(postId: number) {
        delete this.draftState.posts[postId];
    }

    // sagas
    loadPost(_: {postId: number, current: ApiAsync<PostResponse>}) {}
}

export const actions = createActionCreators(PostReducers);
export const reducers = createReducerFunction(PostReducers, {posts: {}});

export function* loadPostSaga(action: ReturnType<typeof actions.loadPost>) {
    const postId = action.payload[0].postId;
    if(!action.payload[0].current) {
        yield put(actions.setPostResult({postId, value: {type: 'loading'}}));
    }
    const result = yield callApi(postRequest(action.payload[0].postId));
    yield put(actions.setPostResult({postId, value: result}));
}

export function* saga() {
    yield takeEvery(actions.loadPost.type, loadPostSaga);
}