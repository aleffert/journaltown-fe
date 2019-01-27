import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeLatest, call } from 'redux-saga/effects';

import { isString, callMethod, Optional, Async } from '../utils';
import { CurrentUserResult, loginRequest, exchangeTokenRequest, currentUserRequest, LoginResult, registerRequest } from '../services/api/requests';
import { services, ApiErrors, callApi } from '../services';

// redux

type UserState = {
    loginResult: Async<LoginResult>,
    registerResult: Async<LoginResult>,
    validating: boolean,
    currentUserResult: Async<CurrentUserResult>
};

class UserReducers extends ImmerReducer<UserState> {
    // state

    setLoginResult(state: UserState['loginResult']) {
        this.draftState.loginResult = state;
    }

    setRegisterResult(state: UserState['registerResult']) {
        this.draftState.registerResult = state;
    }

    setValidating(state: UserState['validating']) {
        this.draftState.validating = state;
    }

    setCurrentUserResult(state: UserState['currentUserResult']) {
        this.draftState.currentUserResult = state;
    }

    // actions
    submitLogin(_: {email: string}) {}
    submitRegister(_: {email: string}) {}
    logout() {}
    loadIfPossible(_: {token: Optional<string>}) {}
}

export const actions = createActionCreators(UserReducers);
export const reducers = createReducerFunction(UserReducers, {
    loginResult: null,
    registerResult: null,
    validating: false,
    currentUserResult: null
});

// sagas

function* loadCurrentUser() {
    // now try to use the token to load the current user
    const authToken = yield call(services.storage.getToken);
    if(authToken) {
        yield put(actions.setCurrentUserResult({type: 'loading'}));
        const result = yield callApi(currentUserRequest());
        yield put(actions.setCurrentUserResult(result));
    }
    else {
        yield put(actions.setCurrentUserResult({type: 'failure', error: ApiErrors.noTokenError}));
    }
}

export function* loadIfPossibleSaga(action: ReturnType<typeof actions.loadIfPossible>) {
    // first check if we have a login token in the url
    const token = action.payload[0].token;
    if(token && isString(token)) {
        yield put(actions.setValidating(true));
        // if so, try to turn it into a useful auth token
        const result = yield callApi(exchangeTokenRequest({token: token}));
        if(result.type === "success") {
            yield callMethod(services.storage, o => o.setToken, result.value.token);
        }
        yield put(actions.setValidating(false));
    }

    yield* loadCurrentUser();

}

export function* submitLoginSaga(action: ReturnType<typeof actions.submitLogin>) {
    yield put(actions.setLoginResult({type: 'loading'}));
    const result = yield callApi(loginRequest(action.payload[0]));
    yield put(actions.setLoginResult(result));
}

export function* submitRegisterSaga(action: ReturnType<typeof actions.submitRegister>) {
    yield put(actions.setRegisterResult({type: 'loading'}));
    const result = yield callApi(registerRequest(action.payload[0]));
    yield put(actions.setRegisterResult(result));
}


export function* logoutSaga(_: ReturnType<typeof actions.logout>) {
    yield callMethod(services.storage, o => o.clear, {});
    yield call(() => window.location.href = '/');
}

export function* saga() {
    yield takeLatest(actions.loadIfPossible.type, loadIfPossibleSaga);
    yield takeLatest(actions.submitLogin.type, submitLoginSaga);
    yield takeLatest(actions.submitRegister.type, submitRegisterSaga);
    yield takeLatest(actions.logout.type, logoutSaga);
}