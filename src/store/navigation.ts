import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { ObjectCodomain, Omit } from '../utils';
import { push } from 'connected-react-router';
import { isNumber } from 'util';

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

type Stringify<T> = T extends number ? string : T
type Templated<T extends object> = {[K in keyof T]: Stringify<T[K]>}

export function renderNavigationTemplate(path: Templated<NavigationPath>): string {
    switch(path.type) {
        case 'main':
            return `/`;
        case 'post':
            return `/post`;
        case 'feed':
            return `/feed`;
        case 'view-post':
            return `/u/${path.username}/p/${path.id}`;
        case 'view-feed':
            return `/u/${path.username}/feed`;
        case 'view-posts':
            return `/u/${path.username}/`;
        case 'edit-post':
            return `/u/${path.username}/p/${path.id}/edit`;
        case 'view-profile':
            return `/u/${path.username}/profile/`;
        case 'edit-profile':
            return `/u/${path.username}/profile/edit`;
    }
}

function stringifyValues<T extends object>(object : T): Templated<T> {
    const result = {} as any;
    for(const key in object) {
        const value = object[key];
        if(isNumber(value)) {
            result[key] = value.toString();
        }
        else {
            result[key] = value;
        }
    }

    return result;
}

export function renderNavigationPath(path: NavigationPath) {
    return renderNavigationTemplate(stringifyValues(path));
}

export function* navigate(action: NavigationAction) {
    const path = renderNavigationPath(action.payload[0]);
    yield put(push(path));
}

export function* saga() {
    yield takeEvery(actions.to.type, navigate);
}
