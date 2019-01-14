import { actions, submitLoginSaga, loadUserIfPossibleSaga } from "./store";
import { call, put } from "redux-saga/effects";
import { callMethod } from "../utils";
import { loginRequest, currentUserRequest } from "../services/api/requests";
import { services, ApiErrors } from "../services";
import qs from 'query-string';

describe('user sagas', () => {
    describe('submitLoginSaga', () => {
        it('marks the state as loading on start', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            expect(effects.next().value).toEqual(put(actions.setLoginState({type: 'loading'})));
        });

        it('passes the given email to the api', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            effects.next();
            expect(effects.next().value.CALL.body).toEqual((callMethod(services.api, o => o.request, loginRequest({email})) as any).CALL.body);
        });

        it('marks the state with the result of the api call', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            const result = {type: 'success', value: {username: 'whatever', email}};
            effects.next();
            effects.next();
            expect(effects.next(result).value).toEqual(put(actions.setLoginState(result as any)));
        });
    });

    describe('loadUserIfPossibleSaga', () => {
        it('does not validate a token if we do not have one', () => {
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token: undefined}));
            expect(effects.next().value).not.toEqual(put(actions.setValidating(true)));
        });

        it('does start validating a token if we do have one', () => {
            const token = 'abc123';
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token}));
            expect(effects.next().value).toEqual(put(actions.setValidating(true)));
        });

        it('if validation succeeds we store the token', () => {
            const token = 'abc123';
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token}));
            effects.next();
            effects.next();
            const result = {type: 'success', value: {token: token}};
            expect(effects.next(result).value.CALL.args).toEqual(callMethod(services.storage, o => o.setToken, token).CALL.args);
        });

        it('if validation succeeds we do not store the token', () => {
            const token = 'abc123';
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token}));
            effects.next();
            effects.next();
            const result = {type: 'failure', error: {}};
            expect(effects.next(result).value.CALL).toBeFalsy();
        });

        it('if we do not have a token we do not try to load the current user', () => {
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token: undefined});
            effects.next();
            expect(effects.next().value).toEqual(put(actions.setCurrent({type: 'failure', error: ApiErrors.noTokenError})));
        });

        it('if we have a token we try to load the current user', () => {
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token: undefined}));
            effects.next();
            expect(effects.next('token').value).toEqual(put(actions.setCurrent({type: 'loading'})));
        });

        it('if we have a token we request the current user', () => {
            const effects: Generator = loadUserIfPossibleSaga(actions.loadUserIfPossible({token: undefined}));
            effects.next();
            expect(effects.next('token').value).toEqual(put(actions.setCurrent({type: 'loading'})));
            expect(effects.next().value.CALL.body).toEqual((callMethod(services.api, o => o.request, currentUserRequest()) as any).CALL.body);
            const result = {type: 'success', value: {username: 'whatever', email: 'whatever'}};
            expect(effects.next(result).value).toEqual(put(actions.setCurrent(result as any)));
        });

    });
});