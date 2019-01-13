import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { Language } from '../utils';

class LocalizationReducers extends ImmerReducer<{language: Language}> {
    setLanguage(language: Language) {
        this.draftState.language = language;
    }
}

export const Actions = createActionCreators(LocalizationReducers);
export const Reducers = createReducerFunction(LocalizationReducers, {language: 'en'});