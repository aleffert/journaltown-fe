import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import { createPostRequest, postRequest, updatePostRequest, ApiAsync, CreatePostResponse, PostResponse, UpdatePostResponse } from "../services/api/requests";
import { isSuccess } from "../utils";
import * as Navigation from './navigation';
import { DraftPost } from "../services/api/models";

type ComposeState = {
    createPostResult: ApiAsync<CreatePostResponse>,
    existingPostResult: ApiAsync<PostResponse>,
    updatePostResult: ApiAsync<UpdatePostResponse>
} & DraftPost

class ComposeReducers extends ImmerReducer<ComposeState> {

    // reducers
    setTitle(title: ComposeState['title']) {
        this.draftState.title = title;
    }

    setBody(body: ComposeState['body']) {
        this.draftState.body = body;
    }

    setCreatePostResult(result: ComposeState['createPostResult']) {
        this.draftState.createPostResult = result;
    }

    setExistingPostResult(result: ComposeState['existingPostResult']) {
        this.draftState.existingPostResult = result;
    }

    setUpdatePostResult(result: ComposeState['updatePostResult']) {
        this.draftState.existingPostResult = result;
    }

    clear() {
        this.draftState.title = '';
        this.draftState.body = '';
        this.draftState.createPostResult = undefined;
        this.draftState.existingPostResult = undefined;
        this.draftState.updatePostResult = undefined;
    }

    // saga actions
    startEditingPost(_: number) {}

    post(_: DraftPost) {}

    update(_: {postId: number, draft: DraftPost}) {}

}

export const actions = createActionCreators(ComposeReducers);
export const reducers = createReducerFunction(ComposeReducers, {
    title: '',
    body: '', 
    createPostResult: undefined, 
    existingPostResult: undefined, 
    updatePostResult: undefined
});

export function* createPostSaga(action: ReturnType<typeof actions.post>) {
    yield put(actions.setCreatePostResult({type: 'loading'}))
    const result = yield callApi(createPostRequest(action.payload[0]));
    if(result.type === "success") {
        yield put(actions.clear());
        yield* Navigation.navigate(Navigation.actions.to({type: 'view-post', id: result.value.id, username: result.value.author.username}));
    }
    else {
        yield put(actions.setCreatePostResult(result));
    }
}

export function* updatePostSaga(action: ReturnType<typeof actions.update>) {
    yield put(actions.setUpdatePostResult({type: 'loading'}))
    const result: ApiAsync<UpdatePostResponse> = yield callApi(updatePostRequest(action.payload[0].postId, action.payload[0].draft));
    if(isSuccess(result)) {
        yield put(actions.clear());
        yield* Navigation.navigate(Navigation.actions.to({type: 'view-post', id: result.value.id, username: result.value.author.username}));
    }
    else {
        yield put(actions.setCreatePostResult(result));
    }
}

export function* startEditingPostSaga(action: ReturnType<typeof actions.startEditingPost>) {
    yield put(actions.setCreatePostResult(undefined));
    yield put(actions.setUpdatePostResult(undefined));
    yield put(actions.setExistingPostResult({type: 'loading'}))
    const result: ApiAsync<PostResponse> = yield callApi(postRequest(action.payload[0]));
    if(isSuccess(result)) {
        yield put(actions.setTitle(result.value.title));
        yield put(actions.setBody(result.value.body));
    }
    yield put(actions.setExistingPostResult(result));
}

export function* saga() {
    yield takeEvery(actions.post.type, createPostSaga);
    yield takeEvery(actions.update.type, updatePostSaga);
    yield takeEvery(actions.startEditingPost.type, startEditingPostSaga);
}