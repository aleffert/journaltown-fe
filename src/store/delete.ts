import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { deletePostRequest } from "../services/api/requests";
import { callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import * as Feed from './feed';
import * as Post from './post';
import * as Navigate from './navigation';
import { resultIsSuccess } from "../utils";
import { NavigationPath } from "./navigation";


type DeleteState = {};
class DeleteReducers extends ImmerReducer<DeleteState> {
    sendDeletePost(_: {postId: number, redirect ?: NavigationPath}) {}
}


export const actions = createActionCreators(DeleteReducers);
export const reducers = createReducerFunction(DeleteReducers, 
    {posts: {}, nextPostsResult: undefined, changedPostsResult: undefined}
);

export function* deletePostSaga(action: ReturnType<typeof actions.sendDeletePost>) {
    const postId = action.payload[0].postId;
    const result = yield callApi(deletePostRequest(postId));
    if(resultIsSuccess(result)) {
        yield put(Feed.actions.deletePost(postId));
        yield put(Post.actions.clearPost(postId));
        const redirect = action.payload[0].redirect;
        if(redirect) {
            yield put(Navigate.actions.to(redirect));
        }
    }
}

export function* saga() {
    yield takeEvery(actions.sendDeletePost.type, deletePostSaga);
}