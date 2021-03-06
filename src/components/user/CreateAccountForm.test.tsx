import React from 'react';
import { mount } from 'enzyme';
import { _CreateAccountForm } from './CreateAccountForm';
import strings from '../../strings';
import { Button } from 'semantic-ui-react';
import { makeSuccess, makeFailure } from '../../utils';
import { AppErrors } from '../../utils/errors';

describe("CreateAccountForm", () => {

    it('does not allow submission when there is no username', () => {
        const props = {createAccount: {username: ''}} as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.find("#submit-button").hostNodes().props().disabled).toBe(true);
    });

    it('shows a message when the username is unavailable', () => {
        const props = {createAccount: {username: 'abc', checkAvailabilityResult: makeFailure({type: 'invalid-fields'})}} as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.html()).toContain(strings.login.unavailable('abc')['en']);
    });

    it('shows a message when username is bad for some other reason', () => {
        const props = {createAccount: {username: 'abc', checkAvailabilityResult: makeFailure(AppErrors.unknownError)}} as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.html()).toContain(strings.login.unavailable('abc')['en']);
    });

    it('shows a spinner when creating an account', () => {
        const props = {
            createAccount: {
                username: 'abc', 
                checkAvailabilityResult: makeSuccess({}),
                createAccountResult: {type: 'loading'}
            }
        } as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.find("#submit-button").find(Button).props().loading).toBe(true);
    });

    it('disables the submit button creating an account', () => {
        const props = {
            createAccount: {
                username: 'abc', 
                checkAvailabilityResult: makeSuccess({}),
                createAccountResult: {type: 'loading'}
            }
        } as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.find("#submit-button").find(Button).props().disabled).toBe(true);
    });

    it('shows a spinner on the button when checking availability', () => {
        const props = {
            createAccount: {
                username: 'abc', 
                checkAvailabilityResult: {type: 'loading'}
            }
        } as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.find("#submit-button").find(Button).props().loading).toBe(true);
    });

    it('shows an error when creation fails for an invalid username', () => {
        const props = {
            createAccount: {
                username: 'abc', 
                checkAvailabilityResult: makeSuccess({}),
                createAccountResult: makeFailure({type: 'invalid-fields'})
            }
        } as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.html()).toContain(strings.login.invalidUsername['en']);
    });

    it('shows an error when creation fails for an unknown reason', () => {
        const props = {
            createAccount: {
                username: 'abc', 
                checkAvailabilityResult: makeSuccess({}),
                createAccountResult: makeFailure(AppErrors.unknownError)
            }
        } as any;
        const w = mount(<_CreateAccountForm {...props} />);
        expect(w.html()).toContain(strings.login.createAccountFailure['en']);
    });
});