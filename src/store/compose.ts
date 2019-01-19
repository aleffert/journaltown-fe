import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import { createPostRequest, CreatePostResult } from "../services/api/requests";
import { Async } from "../utils";

type ComposeState = {
    title: string,
    body: string
    createPostResult: Async<CreatePostResult>
}

class ComposeReducers extends ImmerReducer<ComposeState> {
    setTitle({title}: {title: ComposeState['title']}) {
        this.draftState.title = title;
    }

    setBody({body}: {body: ComposeState['body']}) {
        this.draftState.body = body;
    }

    setCreatePostResult({result}: {result: ComposeState['createPostResult']}) {
        this.draftState.createPostResult = result;
    }

    post(_: {title: string, body: string}) {}
}

export const actions = createActionCreators(ComposeReducers);
export const reducers = createReducerFunction(ComposeReducers, 
    {title: '', body: '', createPostResult: undefined}
);

export function* createPostSaga(action: ReturnType<typeof actions.post>) {
    yield put(actions.setCreatePostResult({result: {type: 'loading'}}))
    const result = yield callApi(createPostRequest(action.payload[0]));
    yield put(actions.setCreatePostResult({result}));
}

export function* saga() {
    yield takeEvery(actions.post.type, createPostSaga);
}