import React from 'react';
import { mount } from 'enzyme';
import { RegisterForm } from './RegisterForm';
import { Button } from 'semantic-ui-react';
import { MemoryRouter } from 'react-router';
import { merge } from 'lodash';
import strings from '../../strings';
import { makeSuccess, makeFailure } from '../../utils';
import { AppErrors } from '../../utils/errors';

describe('RegisterForm', () => {
    const baseProps = {
        onSubmit: () => {},
        language: 'en',
        status: undefined
    };

    it('disables the submit button when there is no email', () => {
        const props = merge({}, baseProps);
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        expect(w.find(Button).props().disabled).toBe(true);
    });

    it('disables the submit button when the email is bad', () => {
        const props = merge({}, baseProps);
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'some bad email'}});
        expect(w.find(Button).props().disabled).toBe(true);
    });

    it('enables the submit button when the email is good', () => {
        const props = merge({}, baseProps);
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'to@example.com'}});
        expect(w.find(Button).props().disabled).toBe(false);
    });

    it('emits an action when the register button is clicked', () => {
        const spy = jest.fn();
        const props = merge({}, baseProps, {
            onSubmit: spy
        });
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'to@example.com'}});
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0]).toEqual(["to@example.com"]);
    });

    it('shows a message once the request has succeeded', () => {
        const props = merge({}, baseProps, {
            status: makeSuccess({})
        });
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        expect(w.html()).toContain(strings.login.sendRegisterSuccess['en']);
    });

    it('shows an error when the email address is already associated with an account', () => {
        const props = merge({}, baseProps, {
            status: makeFailure({type: 'email-in-use'})
        });
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        expect(w.html()).toContain(strings.login.emailInUse['en']);
    });

    it('shows an error when something happens', () => {
        const props = merge({}, baseProps, {
            status: makeFailure(AppErrors.unknownError)
        });
        const w = mount(<MemoryRouter>
            <RegisterForm {...props}/>
        </MemoryRouter>);
        expect(w.html()).toContain(strings.login.sendLoginFailure['en']);
    });

});