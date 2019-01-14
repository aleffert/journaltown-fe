import React from 'react';
import { _Root } from './Root';
import { mount } from 'enzyme';
import strings from './strings';
import { LoginForm } from './user/LoginForm';
import { ApiErrors } from './services';
import { InitialLoader } from './user/InitialLoader';
import { MemoryRouter } from 'react-router';

describe('Root', () => {
    it('shows logged in message when there is a current user', () => {
        const w = mount(
            <_Root
                current={{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.text()).toContain(strings.login.loggedInMessage['en']);
    });

    it('does not show logged in message when there is not a current user', () => {
        const w = mount(
            <_Root
                current={{type: 'loading'}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.text()).not.toContain(strings.login.loggedInMessage['en']);
    });

    it('shows the initial loader when loading', () => {
        const w = mount(
            <_Root
                current={{type: 'loading'}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.find(InitialLoader).exists()).toBe(true);
    });

    it('does not show the initial loader after loading', () => {
        let w = mount(
            <_Root
                current={{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.find(InitialLoader).exists()).toBe(false);

        w = mount(
            <_Root
                current={{type: 'failed', error: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.find(InitialLoader).exists()).toBe(false);
    });

    it('shows the login form when there is not a current user', () => {
        const w = mount(
            <_Root
                current={{type: 'failed', error: ApiErrors.noTokenError}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.find(LoginForm).exists()).toBe(true);
    });

    it('does not show the login form when there is a current user', () => {
        const w = mount(
            <_Root
                current={{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: '/'}}
                appStarted={() => {}}
                history={{replace: () => {}}}
                {...{} as any}
            />
        );
        expect(w.find(LoginForm).exists()).toBe(false);
    });

    it('removes login codes from the url', () => {
        const spy = jest.fn();
        mount(
            <_Root
                current={{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: 'token=whatever'}}
                appStarted={() => {}}
                history={{replace: spy}}
                {...{} as any}
            />
        );
        expect(spy.mock.calls[0]).toEqual([{search: ""}]);
    });

    it('does not remove other arguments from the url', () => {

        const spy = jest.fn();
        mount(
            <_Root
                current={{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}
                location={{search: 'token=whatever&foo=bar'}}
                appStarted={() => {}}
                history={{replace: spy}}
                {...{} as any}
            />
        );
        expect(spy.mock.calls[0]).toEqual([{search: "foo=bar"}]);
    });
});