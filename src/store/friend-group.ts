import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { isSuccess } from "../utils";
import { ApiAsync, createGroupRequest, CreateGroupResponse, groupRequest, GroupResponse, updateGroupRequest } from "../services/api/requests";
import { callApi } from "../services";
import * as Navigation from "./navigation";
import * as User from "./user";

type FriendGroupState = {
    name: string,
    selectedFriends: string[],
    createGroupResult: ApiAsync<CreateGroupResponse>,
    editingGroupResult: ApiAsync<GroupResponse>
};

class FriendGroupReducers extends ImmerReducer<FriendGroupState> {
    // state
    setName(value: string) {
        this.draftState.name = value;
    }

    setSelectedFriends(value: FriendGroupState['selectedFriends']) {
        this.draftState.selectedFriends = value;
    }

    setCreateGroupResult(value: FriendGroupState['createGroupResult']) {
        this.draftState.createGroupResult = value;
    }

    setEditingGroupResult(value: FriendGroupState['editingGroupResult']) {
        this.draftState.editingGroupResult = value;
    }

    clear() {
        this.draftState.createGroupResult = undefined;
        this.draftState.selectedFriends = [];
    }

    // sagas
    createGroup(_: {username: string, groupName: string, members: string[]}) {}
    startEditingGroup(_: {username: string, groupId: number}) {};
    saveGroup(_: {username: string, groupId: number, groupName: string, members: string[]}) {};
}

export const actions = createActionCreators(FriendGroupReducers);
export const reducers = createReducerFunction(FriendGroupReducers, {
    name: '',
    selectedFriends: [],
    createGroupResult: undefined,
    editingGroupResult: undefined,
});

function* createGroupSaga(action: ReturnType<typeof actions.createGroup>) {
    const {username} = action.payload[0];
    yield put(actions.setCreateGroupResult({type: 'loading'}));
    const result: ApiAsync<CreateGroupResponse> = yield callApi(createGroupRequest(action.payload[0]));
    yield put(actions.setCreateGroupResult(result));
    if(isSuccess(result)) {
        yield put(Navigation.actions.to({type: 'view-profile', username}))
        yield put(User.actions.addGroup(result.value));
    }
}

export function* startEditingGroupSaga(action: ReturnType<typeof actions.startEditingGroup>) {
    const result: ApiAsync<GroupResponse> = yield callApi(groupRequest(action.payload[0]));
    if(isSuccess(result)) {
        yield put(actions.setSelectedFriends((result.value.members || []).map(u => u.username)));
        yield put(actions.setName(result.value.name));
    }
    yield put(actions.setEditingGroupResult(result));
}

export function* saveGroupSaga(action: ReturnType<typeof actions.saveGroup>) {
    const result: ApiAsync<GroupResponse> = yield callApi(updateGroupRequest(action.payload[0]));
    yield put(actions.setEditingGroupResult(result));
}

export function* saga() {
    yield takeEvery(actions.createGroup.type, createGroupSaga);
    yield takeLatest(actions.startEditingGroup.type, startEditingGroupSaga);
    yield takeEvery(actions.saveGroup.type, saveGroupSaga);
}
