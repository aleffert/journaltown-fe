import React from 'react';
import { render, shallow, mount } from 'enzyme';
import { _LoginForm } from './LoginForm';
import { Button } from 'semantic-ui-react';
import strings from '../strings';

describe('LoginForm', () => {
    it('shows no spinner when status is undefined', () => {
        const w = shallow(
            <_LoginForm language='en' status={undefined} onSubmit={() => {}}></_LoginForm>
        );
        expect(w.find(Button).props().spinner).toEqual(undefined);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a spinner when status loading', () => {
        const w = shallow(
            <_LoginForm language='en' status={{type: 'loading'}} onSubmit={() => {}}></_LoginForm>
        );
        expect(w.find(Button).props().loading).toEqual(true);
        expect(w.render().text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.render().text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a success message when status is success', () => {
        const w = render(
            <_LoginForm language='en' status={{type: 'success', value: {}}} onSubmit={() => {}}></_LoginForm>
        );
        expect(w.text()).toContain(strings.login.sendSuccess['en']);
        expect(w.text()).not.toContain(strings.login.sendFailure['en']);
    });

    it('shows a failure message when status is failure', () => {
        const w = render(
            <_LoginForm language='en' status={{type: 'failure', error: {}}} onSubmit={() => {}}></_LoginForm>
        );
        expect(w.text()).not.toContain(strings.login.sendSuccess['en']);
        expect(w.text()).toContain(strings.login.sendFailure['en']);
    });

    it('calls onSubmit with the current email when clicked', () => {
        const spy = jest.fn();
        const w = mount(
            <_LoginForm language='en' status={undefined} onSubmit={spy}></_LoginForm>
        );
        w.find('#email-field').hostNodes().simulate('change', {target: {value: 'test@example.com'}});
        w.find('#submit-button').hostNodes().simulate('click');
        expect(spy.mock.calls[0]).toEqual(['test@example.com']);
    });
});