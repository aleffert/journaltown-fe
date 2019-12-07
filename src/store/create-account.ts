import { usernameAvailableRequest, ApiAsync, UsernameAvailableResponse } from '../services/api/requests';
import { isSuccess, callMethod } from '../utils';
import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeLatest, call } from 'redux-saga/effects';
import { createAccountRequest, CreateAccountResponse } from '../services/api/requests';
import { services, callApi } from '../services';

type CreateAccountState = {
    username: string,
    checkAvailabilityResult: ApiAsync<UsernameAvailableResponse>,
    createAccountResult: ApiAsync<CreateAccountResponse>
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
    const result: ApiAsync<CreateAccountResponse> = yield callApi(createAccountRequest(action.payload[0]));
    if(isSuccess(result)) {
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

export function* saga() {
    yield takeLatest(actions.checkAvailability.type, checkAvailabilitySaga);
    yield takeLatest(actions.submitCreateAccount.type, submitCreateAccountSaga);
}