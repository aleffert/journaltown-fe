import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { takeEvery, put } from 'redux-saga/effects';
import { ObjectCodomain } from '../utils';
import { push } from 'connected-react-router';

class NavigationReducers extends ImmerReducer<{}> {
    toNewPost() {}
    toMain() {}
}

export const actions = createActionCreators(NavigationReducers);
export const reducers = createReducerFunction(NavigationReducers, {language: 'en'});

type NavigationAction = ObjectCodomain<typeof actions>;

function* navigate(action: NavigationAction) {
    switch(action.type) {
        case actions.toMain.type:
            yield put(push({pathname: '/'}));
        case actions.toNewPost.type:
            yield put(push({pathname: '/posts/new'}));
    }
}

export function* saga() {
    const types = Object.keys(actions).map((x: string) => actions[x as keyof typeof actions].type);
    yield takeEvery(types, navigate);
}