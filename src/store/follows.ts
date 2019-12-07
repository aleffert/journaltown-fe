import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { callApi } from "../services";
import { AsyncResult, isSuccess, Optional, makeSuccess } from '../utils';
import { RelatedUser } from '../services/api/models';
import { followsRequest, addUserFollowsRequest, removeUserFollowsRequest } from '../services/api/requests';
import * as User from './user';

// Following for the current user
type FollowsState = {
    results: {[username: string]: AsyncResult<Optional<RelatedUser>>}
    values: {[username: string]: boolean}
};

class FollowsReducers extends ImmerReducer<FollowsState> {
    // state
    setUserResults(params: {usernames: string[], result: AsyncResult<RelatedUser[]>}) {
        for(const username of params.usernames) {
            if(isSuccess(params.result)) {
                debugger;
                const entry = params.result.value.find(r => r.username === username);
                if(entry) {
                    this.draftState.values[username] = true;
                    this.draftState.results[username] = makeSuccess(entry);
                }
                else {
                    this.draftState.values[username] = false;
                    this.draftState.results[username] = makeSuccess(undefined);
                }
            }
            else {
                this.draftState.results[username] = params.result;
            }
        }
    }

    // sagas
    loadUserFollowing(_: {currentUsername: string, username: string}) {}
    addUserFollowing(_: {currentUsername: string, username: string}) {}
    removeUserFollowing(_: {currentUsername: string, username: string}) {}
}

export const actions = createActionCreators(FollowsReducers);
export const reducers = createReducerFunction(FollowsReducers, {
    results: {}, values: {}
});

export function* loadUserFollowingSaga(action: ReturnType<typeof actions.loadUserFollowing>) {
    const {username, currentUsername} = action.payload[0];
    yield put(actions.setUserResults({usernames: [username], result: {type: 'loading'}}));
    const result = yield callApi(followsRequest({followee: currentUsername, filters: {username}}));
    yield put(actions.setUserResults({usernames: [username], result: result}));
}

export function* addUserFollowingSaga(action: ReturnType<typeof actions.addUserFollowing>) {
    const {username, currentUsername} = action.payload[0];
    yield put(actions.setUserResults({usernames: [username], result: {type: 'loading'}}));
    const result = yield callApi(addUserFollowsRequest({follower: currentUsername, followee: username}));
    yield put(actions.setUserResults({usernames: [username], result: result}));
    yield put(User.actions.addFollower({followerUsername: currentUsername, followeeUsername: username}));
}

export function* removeUserFollowingSaga(action: ReturnType<typeof actions.removeUserFollowing>) {
    const {username, currentUsername} = action.payload[0];
    yield put(actions.setUserResults({usernames: [username], result: {type: 'loading'}}));
    const result = yield callApi(removeUserFollowsRequest({follower: currentUsername, followee: username}));
    if(isSuccess(result)) {
        yield put(actions.setUserResults({usernames: [username], result: makeSuccess([])}));
        yield put(User.actions.removeFollower({followerUsername: currentUsername, followeeUsername: username}));
    }
    else {
        yield put(actions.setUserResults({usernames: [username], result: result}));
    }
}

export function* saga() {
    yield takeEvery(actions.loadUserFollowing.type, loadUserFollowingSaga);
    yield takeEvery(actions.addUserFollowing.type, addUserFollowingSaga);
    yield takeEvery(actions.removeUserFollowing.type, removeUserFollowingSaga);
}