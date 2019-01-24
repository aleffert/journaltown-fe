import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeLatest, call } from 'redux-saga/effects';

import { isString, callMethod, Optional, Async } from '../utils';
import { CurrentUserResult, loginRequest, exchangeTokenRequest, currentUserRequest, LoginResult } from '../services/api/requests';
import { services, ApiErrors, callApi } from '../services';

// redux

type UserState = {
    login: Async<LoginResult>,
    validating: boolean,
    currentUserResult: Async<CurrentUserResult>
}
class UserReducers extends ImmerReducer<UserState> {
    // state

    setLoginState(state: UserState['login']) {
        this.draftState.login = state;
    }

    setValidating(state: UserState['validating']) {
        this.draftState.validating = state;
    }
    setCurrentUserResult(state: UserState['currentUserResult']) {
        this.draftState.currentUserResult = state;
    }

    // actions
    submitLogin(_: {email: string}) {}
    logout() {}
    loadIfPossible(_: {token: Optional<string>}) {}
}

export const actions = createActionCreators(UserReducers);
export const reducers = createReducerFunction(UserReducers, {login: null, validating: false, currentUserResult: null});

// sagas
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

export function* submitLoginSaga(action: ReturnType<typeof actions.submitLogin>) {
    yield put(actions.setLoginState({type: 'loading'}));
    const result = yield callApi(loginRequest({email: action.payload[0].email}));
    yield put(actions.setLoginState(result));
}

export function* logoutSaga(_: ReturnType<typeof actions.logout>) {
    const redirectToBase = () => window.location.href = '/';
    yield callMethod(services.storage, o => o.clear, {});
    yield call(redirectToBase);
}

export function* saga() {
    yield takeLatest(actions.loadIfPossible.type, loadIfPossibleSaga);
    yield takeLatest(actions.submitLogin.type, submitLoginSaga);
    yield takeLatest(actions.logout.type, logoutSaga);
}