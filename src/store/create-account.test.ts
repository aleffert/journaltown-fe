import { submitCreateAccountSaga, actions, checkAvailabilitySaga } from "./create-account";
import { put } from "redux-saga/effects";
import { ApiErrors, callApi } from "../services";
import { usernameAvailableRequest } from "../services/api/requests";

describe('create-account', () => {
    const username = "someuser";
    describe('submitCreateAccountSaga', () => {
        const token = "abc123";

        it('marks the state as loading when it starts', () => {
            const events: Generator = submitCreateAccountSaga(actions.submitCreateAccount({username, token}));
            expect(events.next().value).toEqual(put(actions.setCreateAccountResult({type: 'loading'})));
        });

        it('marks the state as failed if the request fails', () => {
            const events: Generator = submitCreateAccountSaga(actions.submitCreateAccount({username, token}));
            const result = {type: 'failure' as 'failure', error: ApiErrors.unknownError};
            events.next();
            events.next();
            expect(events.next(result).value).toEqual(put(actions.setCreateAccountResult(result)));;
        });

        it('sets the returned token if the request succeeds', () => {
            const events: Generator = submitCreateAccountSaga(actions.submitCreateAccount({username, token}));
            const result = {type: 'success' as 'success', value: {token}};
            events.next();
            events.next();
            expect(events.next(result).value.CALL.args).toEqual([token]);
        });

        it('refreshes the page if the request succeeds', () => {
            const events: Generator = submitCreateAccountSaga(actions.submitCreateAccount({username, token}));
            const result = {type: 'success' as 'success', value: {token}};
            events.next();
            events.next();
            events.next(result);
            expect(events.next().value.CALL).not.toBeUndefined();
        });
    });

    describe('checkAvailabilitySaga', () => {
        it('sets the username and result state on start', () => {
            const events: Generator = checkAvailabilitySaga(actions.checkAvailability({username}));
            const emitted = [];
            emitted.push(events.next().value);
            emitted.push(events.next().value);
            expect(emitted).toContainEqual(put(actions.setUsername(username)));
            expect(emitted).toContainEqual(put(actions.setCheckAvailabilityResult(undefined)));
        });

        it('does nothing after setting state if username is empty', () => {
            const events: Generator = checkAvailabilitySaga(actions.checkAvailability({username: ''}));
            events.next();
            events.next();
            expect(events.next().done).toBe(true);
        });

        it('sends a check availability request if the username is not empty', () => {
            const events: Generator = checkAvailabilitySaga(actions.checkAvailability({username}));
            events.next();
            events.next();
            expect(events.next().value).toEqual(put(actions.setCheckAvailabilityResult({type: 'loading'})));
            expect(events.next().value.CALL.args[0].path).toEqual(usernameAvailableRequest(username).path);

            const result = {type: 'success' as 'success', value: {}};
            expect(events.next(result).value).toEqual(put(actions.setCheckAvailabilityResult(result)));
        });
    });
});