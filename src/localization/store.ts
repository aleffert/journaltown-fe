import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { Language } from '../utils';
import { all } from 'redux-saga/effects';

class LocalizationReducers extends ImmerReducer<{language: Language}> {
    setLanguage(language: Language) {
        this.draftState.language = language;
    }
}

export const actions = createActionCreators(LocalizationReducers);
export const reducers = createReducerFunction(LocalizationReducers, {language: 'en'});

export function* saga() {
    yield all([]);
}