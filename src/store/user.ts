import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';

import { isString, callMethod, Optional, isSuccess, makeFailure } from '../utils';
import { services, callApi } from '../services';
import { UserProfile, FriendGroup } from '../services/api/models';
import { 
    ApiAsync, LoginResponse, CurrentUserResponse, UserResponse,
    UpdateProfileResponse, userRequest, currentUserRequest,
    exchangeTokenRequest, loginRequest, registerRequest, updateProfileRequest, ApiResult
} from '../services/api/requests';
import { AppErrors } from '../utils/errors';

// redux

type UserState = {
    loginResult: ApiAsync<LoginResponse>
    registerResult: ApiAsync<LoginResponse>,
    validating: boolean,
    currentUserResult: ApiAsync<CurrentUserResponse>,
    profiles: {[username: string]: ApiAsync<UserResponse>},
    draftProfile: UserProfile,
    updateProfileResult: ApiAsync<UpdateProfileResponse>
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

    setUserResult(params: {username: string, value: ApiAsync<UserResponse>}) {
        // TODO: garbage collect
        this.draftState.profiles[params.username] = params.value;
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

    addFollower(params: {followeeUsername: string, followerUsername: string}) {
        const {followeeUsername, followerUsername} = params;
        const followeeResult = this.draftState.profiles[followeeUsername];
        if(isSuccess(followeeResult)) {
            const updatedFollowers = new Array(...(followeeResult.value.followers || []));
            if(!updatedFollowers.find(u => u.username === followerUsername)) {
                updatedFollowers.push({username: followerUsername});
            }
            followeeResult.value.followers = updatedFollowers;
        }
        const followerResult = this.draftState.profiles[followerUsername];
        if(isSuccess(followerResult)) {
            const updatedFollowing = new Array(...(followerResult.value.following || []));
            if(!updatedFollowing.find(u => u.username === followeeUsername)) {
                updatedFollowing.push({username: followeeUsername});
            }
            followerResult.value.following = updatedFollowing;
        }
    }

    removeFollower(params: {followeeUsername: string, followerUsername: string}) {
        const {followeeUsername, followerUsername} = params;
        const followeeResult = this.draftState.profiles[followeeUsername];
        const followerResult = this.draftState.profiles[followerUsername];
        if(isSuccess(followeeResult)) {
            const updatedFollowers = (followeeResult.value.followers || []).filter(u => u.username !== followerUsername);
            followeeResult.value.followers = updatedFollowers;
        }
        if(isSuccess(followerResult)) {
            const updatedFollowing = (followerResult.value.following || []).filter(u => u.username !== followeeUsername);
            followerResult.value.following = updatedFollowing;
        }
    }

    addGroup(group: FriendGroup) {
        if(isSuccess(this.draftState.currentUserResult)) {
            this.draftState.currentUserResult.value.groups.push(group);
        }
    }

    // sagas
    loadUser(_: {username: string, current: ApiAsync<UserResponse>}) {}
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
    profiles: {},
    draftProfile: {bio: undefined},
    updateProfileResult: undefined
});

// sagas

function* loadUserSaga(action: ReturnType<typeof actions.loadUser>) {
    const username = action.payload[0].username;
    if(!action.payload[0].current) {
        yield put(actions.setUserResult({username, value: {type: 'loading'}}));
    }
    const result = yield callApi(userRequest(action.payload[0].username));
    yield put(actions.setUserResult({username, value: result}));
}

function* loadCurrentUserSaga() {
    // now try to use the token to load the current user
    const authToken = yield call(services.storage.getToken);
    if(authToken) {
        yield put(actions.setCurrentUserResult({type: 'loading'}));
        const result = yield callApi(currentUserRequest());
        yield put(actions.setCurrentUserResult(result));
    }
    else {
        yield put(actions.setCurrentUserResult(makeFailure(AppErrors.noTokenError)));
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

    yield* loadCurrentUserSaga();

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

export function* updateProfileSaga(action: ReturnType<typeof actions.updateProfile>) {
    yield put(actions.setUpdateProfileResult({type: 'loading'}));
    const result: ApiResult<UpdateProfileResponse> = yield callApi(updateProfileRequest(action.payload[0]));
    yield put(actions.setUpdateProfileResult(result));
    if(isSuccess(result)) {
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