import React from 'react';
import { render, shallow, mount } from 'enzyme';
import { _LoginForm } from './LoginForm';
import { Button } from 'semantic-ui-react';
import strings from '../../strings';

describe('LoginForm', () => {
    const baseProps = {language: 'en' as 'en', status:undefined, onSubmit: () => {}};

    it('shows no spinner when status is undefined', () => {
        const w = shallow(
            <_LoginForm {...baseProps} status={undefined}></_LoginForm>
        );
        expect(w.find(Button).props().spinner).toEqual(undefined);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a spinner when status loading', () => {
        const w = shallow(
            <_LoginForm {...baseProps} status={{type: 'loading'}}></_LoginForm>
        );
        expect(w.find(Button).props().loading).toEqual(true);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a success message when status is success', () => {
        const w = render(
            <_LoginForm {...baseProps} status={{type: 'success', value: {}}}></_LoginForm>
        );
        expect(w.text()).toContain(strings.login.sendSuccess['en']);
        expect(w.text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a failure message when status is failure', () => {
        const w = render(
            <_LoginForm {...baseProps} status={{type: 'failure', error: {}}}></_LoginForm>
        );
        expect(w.text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.text()).toContain(strings.login.sendFailure['en']);
    });

    it('calls onSubmit with the current email when clicked', () => {
        const spy = jest.fn();
        const w = mount(
            <_LoginForm {...baseProps} onSubmit={spy}></_LoginForm>
        );
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'test@example.com'}});
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0]).toEqual(['test@example.com']);
    });

    it('disables the submit button when there is no email address', () => {
        const w = mount(
            <_LoginForm {...baseProps} status={undefined}></_LoginForm>
        );
        expect(w.find(Button).props().disabled).toEqual(true);
    });

    it('enables the submit button when there is an email address', () => {
        const w = mount(
            <_LoginForm {...baseProps} status={undefined}></_LoginForm>
        );
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'test@example.com'}});
        expect(w.find(Button).props().disabled).toEqual(false);
    });
});