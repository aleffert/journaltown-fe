import { ImmerReducer, createActionCreators, createReducerFunction } from "immer-reducer";
import { put, takeEvery } from 'redux-saga/effects';
import { Async, isSuccess } from "../utils";
import { CreateGroupResult, createGroupRequest, setGroupMembersRequest } from "../services/api/requests";
import { callApi } from "../services";
import * as Navigation from "./navigation";
import * as User from "./user";

type FriendGroupState = {
    name: string,
    selectedFriends: string[],
    createGroupResult: Async<CreateGroupResult>
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

    clear() {
        this.draftState.createGroupResult = undefined;
        this.draftState.selectedFriends = [];
    }

    // sagas
    createGroup(_: {username: string, groupName: string, members: string[]}) {}
}

export const actions = createActionCreators(FriendGroupReducers);
export const reducers = createReducerFunction(FriendGroupReducers, {
    name: '',
    selectedFriends: [],
    createGroupResult: undefined
});

function* createGroupSaga(action: ReturnType<typeof actions.createGroup>) {
    const {username, members} = action.payload[0];
    yield put(actions.setCreateGroupResult({type: 'loading'}));
    const result: Async<CreateGroupResult> = yield callApi(createGroupRequest(action.payload[0]));
    yield put(actions.setCreateGroupResult(result));
    if(isSuccess(result)) {
        const groupId = result.value.id;
        yield callApi(setGroupMembersRequest({username, members, groupId}));
        yield put(Navigation.actions.to({type: 'view-profile', username}))
        yield put(User.actions.addGroup(result.value));
    }
}

export function* saga() {
    yield takeEvery(actions.createGroup.type, createGroupSaga);
}
