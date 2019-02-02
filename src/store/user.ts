import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';

import { isString, callMethod, Optional, Async, isSuccess } from '../utils';
import * as requests from '../services/api/requests';
import { services, ApiErrors, callApi } from '../services';
import { UserProfile } from '../services/api/models';

// redux

type UserState = {
    loginResult: Async<requests.LoginResult>,
    registerResult: Async<requests.LoginResult>,
    validating: boolean,
    currentUserResult: Async<requests.CurrentUserResult>,
    users: {[username: string]: Async<requests.UserResult>},
    draftProfile: UserProfile,
    updateProfileResult: Async<requests.UpdateProfileResult>
};

class UserReducers extends ImmerReducer<UserState> {
    // state

    setLoginResult(value: UserState['loginResult']) {
        this.draftState.loginResult = value;
    }

    setRegisterResult(value: UserState['registerResult']) {
        this.draftState.registerResult = value;
    }

    setValidating(value: UserState['validating']) {
        this.draftState.validating = value;
    }

    setCurrentUserResult(value: UserState['currentUserResult']) {
        this.draftState.currentUserResult = value;
    }

    setUserResult(params: {username: string, value: Async<requests.UserResult>}) {
        // TODO: garbage collect
        this.draftState.users[params.username] = params.value;
    }

    setDraftProfile(value: UserState['draftProfile']) {
        this.draftState.draftProfile = value;
    }

    setUpdateProfileResult(value: UserState['updateProfileResult']) {
        this.draftState.updateProfileResult = value;
    }

    setCurrentUserProfile(value: UserProfile) {
        if(isSuccess(this.draftState.currentUserResult)) {
            this.draftState.currentUserResult.value.profile = value;
        }
    }

    // sagas
    loadUser(_: {username: string, current: Async<requests.UserResult>}) {}
    submitLogin(_: {email: string}) {}
    submitRegister(_: {email: string}) {}
    logout() {}
    loadIfPossible(_: {token: Optional<string>}) {}
    updateProfile(_: {username: string, profile: UserProfile}) {}
}

export const actions = createActionCreators(UserReducers);
export const reducers = createReducerFunction(UserReducers, {
    loginResult: null,
    registerResult: null,
    validating: false,
    currentUserResult: null,
    users: {},
    draftProfile: {bio: undefined},
    updateProfileResult: undefined
});

// sagas

function* loadUserSaga(action: ReturnType<typeof actions.loadUser>) {
    const username = action.payload[0].username;
    if(!action.payload[0].current) {
        yield put(actions.setUserResult({username, value: {type: 'loading'}}));
    }
    const result = yield callApi(requests.userRequest(action.payload[0].username));
    yield put(actions.setUserResult({username, value: result}));
}

function* loadCurrentUserSaga() {
    // now try to use the token to load the current user
    const authToken = yield call(services.storage.getToken);
    if(authToken) {
        yield put(actions.setCurrentUserResult({type: 'loading'}));
        const result = yield callApi(requests.currentUserRequest());
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
        const result = yield callApi(requests.exchangeTokenRequest({token: token}));
        if(result.type === "success") {
            yield callMethod(services.storage, o => o.setToken, result.value.token);
        }
        yield put(actions.setValidating(false));
    }

    yield* loadCurrentUserSaga();

}

export function* submitLoginSaga(action: ReturnType<typeof actions.submitLogin>) {
    yield put(actions.setLoginResult({type: 'loading'}));
    const result = yield callApi(requests.loginRequest(action.payload[0]));
    yield put(actions.setLoginResult(result));
}

export function* submitRegisterSaga(action: ReturnType<typeof actions.submitRegister>) {
    yield put(actions.setRegisterResult({type: 'loading'}));
    const result = yield callApi(requests.registerRequest(action.payload[0]));
    yield put(actions.setRegisterResult(result));
}

export function* logoutSaga(_: ReturnType<typeof actions.logout>) {
    yield callMethod(services.storage, o => o.clear, {});
    yield call(() => window.location.href = '/');
}

export function* updateProfileSaga(action: ReturnType<typeof actions.updateProfile>) {
    yield put(actions.setUpdateProfileResult({type: 'loading'}));
    const result = yield callApi(requests.updateProfileRequest(action.payload[0]));
    yield put(actions.setUpdateProfileResult(result));
    if(isSuccess<requests.UpdateProfileResponse, requests.UpdateProfileError>(result)) {
        yield put(actions.setCurrentUserProfile(result.value))
    }
}

export function* saga() {
    yield takeEvery(actions.loadUser.type, loadUserSaga);
    yield takeLatest(actions.loadIfPossible.type, loadIfPossibleSaga);
    yield takeLatest(actions.submitLogin.type, submitLoginSaga);
    yield takeLatest(actions.submitRegister.type, submitRegisterSaga);
    yield takeLatest(actions.logout.type, logoutSaga);
    yield takeLatest(actions.updateProfile.type, updateProfileSaga);
}