import { UsernameAvailableResult, usernameAvailableRequest, CreateAccountResult } from '../services/api/requests';
import { Async, isSuccess, callMethod } from '../utils';
import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeLatest, call } from 'redux-saga/effects';
import { createAccountRequest, CreateAccountResponse, CreateAccountError } from '../services/api/requests';
import { services, callApi } from '../services';

type CreateAccountState = {
    username: string,
    checkAvailabilityResult: Async<UsernameAvailableResult>,
    createAccountResult: Async<CreateAccountResult>
}

class CreateAccountReducers extends ImmerReducer<CreateAccountState> {
    // state
    setUsername(value: CreateAccountState['username']) {
        this.draftState.username = value;
    }

    setCheckAvailabilityResult(value: CreateAccountState['checkAvailabilityResult']) {
        this.draftState.checkAvailabilityResult = value;
    }

    setCreateAccountResult(value: CreateAccountState['createAccountResult']) {
        this.draftState.createAccountResult = value;
    }

    // actions
    checkAvailability(_: {username: string}) {}
    submitCreateAccount(_: {username: string, token: string}) {}
}

export const actions = createActionCreators(CreateAccountReducers);
export const reducers = createReducerFunction(CreateAccountReducers, {
    username: '',
    checkAvailabilityResult: undefined,
    createAccountResult: undefined
});

export function* submitCreateAccountSaga(action: ReturnType<typeof actions.submitCreateAccount>) {
    yield put(actions.setCreateAccountResult({type: 'loading'}));
    const result = yield callApi(createAccountRequest(action.payload[0]));
    if(isSuccess<CreateAccountResponse, CreateAccountError>(result)) {
        yield callMethod(services.storage, o => o.setToken, result.value.token);
        yield call(() => window.location.href = '/');
    }
    else {
        yield put(actions.setCreateAccountResult(result));
    }
}

export function* checkAvailabilitySaga(action: ReturnType<typeof actions.checkAvailability>) {
    const username = action.payload[0].username;
    yield put(actions.setUsername(username));
    yield put(actions.setCheckAvailabilityResult(undefined));
    if(username) {
        yield put(actions.setCheckAvailabilityResult({type: 'loading'}));
        const result = yield callApi(usernameAvailableRequest(username));
        yield put(actions.setCheckAvailabilityResult(result));
    }
}

export function* sagas() {
    yield takeLatest(actions.checkAvailability, checkAvailabilitySaga);
    yield takeLatest(actions.submitCreateAccount.type, submitCreateAccountSaga);
}