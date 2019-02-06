import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { ObjectCodomain } from '../utils';
import { push } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';

export type NavigationPath =
| {type: 'main'}
| {type: 'post'}
| {type: 'feed'}
| {type: 'view-feed', username: string}
| {type: 'view-posts', username: string}
| {type: 'view-post', id: number, username: string}
| {type: 'edit-post', id: number, username: string}
| {type: 'view-profile', username: string}
| {type: 'edit-profile', username: string}

class NavigationReducers extends ImmerReducer<{}> {
    to(_: NavigationPath) {}
    replace(_: NavigationPath) {}
}

export const actions = createActionCreators(NavigationReducers);
export const reducers = createReducerFunction(NavigationReducers, {language: 'en'});

export type NavigationAction = ReturnType<ObjectCodomain<typeof actions>>;

export function renderNavigationPath(path: NavigationPath): LocationDescriptorObject {
    switch(path.type) {
        case 'main':
            return {pathname: `/`};
        case 'post':
            return {pathname: `/post`};
        case 'feed':
            return {pathname: `/feed`};
        case 'view-post':
            return {pathname: `/u/${path.username}/p/${path.id}`};
        case 'view-feed':
            return {pathname: `/u/${path.username}/feed`};
        case 'view-posts':
            return {pathname: `/u/${path.username}/`};
        case 'edit-post':
            return {pathname: `/u/${path.username}/p/${path.id}/edit`};
        case 'view-profile':
            return {pathname: `/u/${path.username}/profile/`};
        case 'edit-profile':
            return {pathname: `/u/${path.username}/profile/edit`};
    }
}

export function* navigate(action: NavigationAction) {
    const path = renderNavigationPath(action.payload[0]);
    yield put(push(path));
}

export function* saga() {
    yield takeEvery(actions.to.type, navigate);
}