import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { AsyncResult } from "../utils";
import { ApiError } from "../services";
import { all } from 'redux-saga/effects';

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
}

export const actions = createActionCreators(ComposeReducers);
export const reducers = createReducerFunction(ComposeReducers, 
    {title: '', body: '', postResult: undefined}
);

export function* saga() {
    yield all([]);
}