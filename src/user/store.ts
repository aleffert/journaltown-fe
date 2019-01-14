import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeLatest, call } from 'redux-saga/effects';
import * as qs from 'query-string';

import { AsyncResult, isString, callMethod, Optional } from '../utils';
import { LoginResponse, LoginError, CurrentUserResponse, CurrentUserError, loginRequest, exchangeTokenRequest, currentUserRequest } from '../services/api/requests';
import { services, ApiErrors } from '../services';

// redux

type LoginState = AsyncResult<LoginResponse, LoginError>;
type CurrentUserState = AsyncResult<CurrentUserResponse, CurrentUserError>;

type UserState = {
    login: LoginState,
    validating: boolean,
    current: CurrentUserState
}
class UserReducers extends ImmerReducer<UserState> {
    // state

    setLoginState(state: LoginState) {
        this.draftState.login = state;
    }

    setValidating(state: boolean) {
        this.draftState.validating = state;
    }
    setCurrent(state: CurrentUserState) {
        this.draftState.current = state;
    }

    // actions
    submitLogin({email}: {email: string}) {}
    loadUserIfPossible({token}: {token: Optional<string>}) {}
}

export const actions = createActionCreators(UserReducers);
export const reducers = createReducerFunction(UserReducers, {login: null, validating: false, current: null});

// sagas
export function* loadUserIfPossibleSaga(action: ReturnType<typeof actions.loadUserIfPossible>) {
    // first check if we have a login token in the url
    const token = action.payload[0].token;
    if(token && isString(token)) {
        yield put(actions.setValidating(true));
        // if so, try to turn it into a useful auth token
        const result = yield callMethod(services.api, o => o.request, exchangeTokenRequest({token: token}));
        if(result.type === "success") {
            yield callMethod(services.storage, o => o.setToken, result.value.token);
        }
        yield put(actions.setValidating(false));
    }

    // now try to use the token to load the current user
    const authToken = yield call(services.storage.getToken);
    if(authToken) {
        yield put(actions.setCurrent({type: 'loading'}));
        const result = yield callMethod(services.api, o => o.request, currentUserRequest());
        yield put(actions.setCurrent(result));
    }
    else {
        yield put(actions.setCurrent({type: 'failure', error: ApiErrors.noTokenError}));
    }
}

export function* submitLoginSaga(action: ReturnType<typeof actions.submitLogin>) {
    yield put(actions.setLoginState({type: 'loading'}));
    const result = yield callMethod(services.api, o => o.request, loginRequest({email: action.payload[0].email}));
    yield put(actions.setLoginState(result));
}

export function* saga() {
    yield takeLatest(actions.loadUserIfPossible.type, loadUserIfPossibleSaga);
    yield takeLatest(actions.submitLogin.type, submitLoginSaga);
}