import { combineReducers } from 'redux';
import * as Localization from './localization/store';
import * as User from './user/store';
import { ExtractCodomain } from './utils';

export const reducers = combineReducers({
    localization: Localization.Reducers,
    user: User.Reducers
});

export const actions = {
    localization: Localization.Actions,
    user: User.Actions
}

type UnionActions<T, K> = K extends any ? ExtractCodomain<T[K]> : never;
export type ExtractActions<T> = UnionActions<T, keyof T>;

export type AppState = typeof reducers extends (s: infer _, a: infer _) => infer T ? T : null;
export type Keys<X> = X extends object ? keyof X : never;
export type AppAction = ReturnType<ExtractActions<typeof actions>>;