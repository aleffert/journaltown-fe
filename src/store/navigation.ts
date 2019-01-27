import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { ObjectCodomain } from '../utils';
import { push } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';

export type NavigationPath =
| {type: 'main'}
| {type: 'new-post'}
| {type: 'view-post', id: number, username: string}
| {type: 'edit-post', id: number, username: string}

class NavigationReducers extends ImmerReducer<{}> {
    to(_: NavigationPath) {}
    replace(_: NavigationPath) {}
}

export const actions = createActionCreators(NavigationReducers);
export const reducers = createReducerFunction(NavigationReducers, {language: 'en'});

export type NavigationAction = ReturnType<ObjectCodomain<typeof actions>>;

export function renderNavigationAction(path: NavigationPath): LocationDescriptorObject {
    switch(path.type) {
        case 'main':
            return {pathname: `/`};
        case 'new-post':
            return {pathname: `/posts/new`};
        case 'view-post':
            return {pathname: `/u/${path.username}/posts/${path.id}`};
        case 'edit-post':
            return {pathname: `/u/${path.username}/posts/${path.id}/edit`};
    }
}

export function* navigate(action: NavigationAction) {
    const path = renderNavigationAction(action.payload[0]);
    yield put(push(path));
}

export function* saga() {
    yield takeEvery(actions.to.type, navigate);
}