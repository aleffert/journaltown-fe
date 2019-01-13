import { ImmerReducer, createActionCreators, createReducerFunction } from 'immer-reducer';
import { AsyncResult } from '../utils';
import { LoginResponse, LoginError, CurrentUserResponse, CurrentUserError } from '../services/api/requests';

type LoginState = AsyncResult<LoginResponse, LoginError>;
type CurrentUserState = AsyncResult<CurrentUserResponse, CurrentUserError>;

type UserState = {
    login: LoginState,
    validating: boolean,
    current: CurrentUserState
}
class UserReducers extends ImmerReducer<UserState> {
    setLoginState(state: LoginState) {
        this.draftState.login = state;
    }

    setValidating(state: boolean) {
        this.draftState.validating = state;
    }
    setCurrent(state: CurrentUserState) {
        this.draftState.current = state;
    }
}

export const Actions = createActionCreators(UserReducers);
export const Reducers = createReducerFunction(UserReducers, {login: null, validating: false, current: null});