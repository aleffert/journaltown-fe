import { combineReducers, Reducer } from 'redux';
import { all } from 'redux-saga/effects';
import { ObjectCodomain, historyActions } from '../utils';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import * as Feed from './feed';
import * as Navigation from './navigation';
import * as Compose from './compose';
import * as User from './user';

const modules = {
    compose: Compose,
    feed: Feed,
    navigation: Navigation,
    user: User
};

// Types to extract all the components
type Reducers<T> = {[K in keyof T]: T[K] extends {reducers: infer _} ? T[K]['reducers'] : never}
type Actions<T> = {[K in keyof T]: T[K] extends {actions: infer _} ? T[K]['actions'] : never}
type Sagas<T> = {[K in keyof T]: T[K] extends {saga: infer _} ? T[K]['saga'] : never}

// Ways to extract all the components
function extractKey<M extends object>(modules: M, key: string): any {
    const result = {} as any;
    for(const field of Object.keys(modules)) {
        const fieldValue = (modules as any)[field];
        if(fieldValue) {
            result[field] = fieldValue[key];
        }
    }
    return result;
}

function extractReducers<M extends object>(modules: M): Reducers<M> {
    return extractKey(modules, 'reducers');
}

function extractActions<M extends object>(modules: M): Actions<M> {
    return extractKey(modules, 'actions');
}

function extractSaga<M extends object>(modules: M): Sagas<M> {
    return extractKey(modules, 'saga');
}

// Actual store pieces
export function createRootReducers(history: History) {
    return combineReducers({...extractReducers(modules), router: connectRouter(history)});
}

export const actions = {...extractActions(modules), history: historyActions};

export function* saga() {
    yield all(
        Object.values(extractSaga(modules)).map(s => s())
    )
}
  
// Types of the store pieces

// helpers
type UnionActions<T, K> = K extends any ? ObjectCodomain<T[K]> : never;
export type ExtractActions<T> = UnionActions<T, keyof T>;

// actual types
export type AppState = ReturnType<typeof createRootReducers> extends (s: infer _, a: infer _) => infer T ? T : null;
export type AppAction = ReturnType<ExtractActions<typeof actions>>;