import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { ObjectCodomain } from '../utils';
import { push } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';

type NavigationPath =
| {type: 'main'}
| {type: 'new-post'}
| {type: 'post', id: number, username: string}

class NavigationReducers extends ImmerReducer<{}> {
    to(_: NavigationPath) {}
}

export const actions = createActionCreators(NavigationReducers);
export const reducers = createReducerFunction(NavigationReducers, {language: 'en'});

type NavigationAction = ReturnType<ObjectCodomain<typeof actions>>;

export function renderNavigationAction(path: NavigationPath): LocationDescriptorObject {
    switch(path.type) {
        case 'main':
            return {pathname: `/`};
        case 'new-post':
            return {pathname: `/posts/new`};
        case 'post':
            return {pathname: `/u/${path.username}/posts/${path.id}`};
    }
}

function* navigate(action: NavigationAction) {
    const path = renderNavigationAction(action.payload[0]);
    yield put(push(path));
}

export function* saga() {
    yield takeEvery(actions.to.type, navigate);
}