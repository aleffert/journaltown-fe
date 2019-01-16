import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { AsyncResult } from "../utils";
import { ApiError, callApi } from "../services";
import { put, takeEvery } from 'redux-saga/effects';
import { createPostRequest } from "../services/api/requests";

type PostResult = AsyncResult<{}, ApiError>;
type ComposeState = {
    title: string,
    body: string
    postResult: PostResult
}

class ComposeReducers extends ImmerReducer<ComposeState> {
    setTitle({title}: {title: string}) {
        this.draftState.title = title;
    }

    setBody({body}: {body: string}) {
        this.draftState.body = body;
    }

    setPostResult({result}: {result: PostResult}) {
        this.draftState.postResult = result;
    }

    post(_: {title: string, body: string}) {}
}

export const actions = createActionCreators(ComposeReducers);
export const reducers = createReducerFunction(ComposeReducers, 
    {title: '', body: '', postResult: undefined}
);

export function* createPostSaga(action: ReturnType<typeof actions.post>) {
    yield put(actions.setPostResult({result: {type: 'loading'}}))
    const result = yield callApi(createPostRequest(action.payload[0]));
    yield put(actions.setPostResult({result}));
}

export function* saga() {
    yield takeEvery(actions.post.type, createPostSaga);
}