import React from 'react';
import { _Root } from './Root';
import { mount } from 'enzyme';
import { LoginForm } from './user/LoginForm';
import { ApiErrors } from '../services';
import { InitialLoader } from './user/InitialLoader';
import { Header } from './Header';
import { MemoryRouter as Router } from 'react-router';

describe('Root', () => {
    const baseProps = {
        router: {location: {search: '' }},
        actions: {user: {loadIfPossible: () => {}}, history: {replace: () => {}}},
    };
    it('shows header when there is a current user', () => {
        const w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(Header).exists()).toBe(true);
    });

    it('does not show header message when there is not a current user', () => {
        const w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'loading'}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(Header).exists()).toBe(false);
    });

    it('shows the initial loader when loading', () => {
        const w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'loading'}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(true);
    });

    it('does not show the initial loader after loading', () => {
        let w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);

        w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'failed', error: ApiErrors.noTokenError}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);
    });

    it('shows the login form when there is not a current user', () => {
        const w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'failed', error: ApiErrors.noTokenError}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(LoginForm).exists()).toBe(true);
    });

    it('does not show the login form when there is a current user', () => {
        const w = mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}}
                {...{} as any}
            /></Router>
        );
        expect(w.find(LoginForm).exists()).toBe(false);
    });

    it('removes login codes from the url', () => {
        const spy = jest.fn();
        mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}}
                router={{location:{search: 'token=foo'}}}
                actions={{...baseProps.actions, history: {replace: spy}}}
                {...{} as any}
            /></Router>
        );
        expect(spy.mock.calls[0]).toEqual([{search: ""}]);
    });

    it('does not remove other arguments from the url', () => {
        const spy = jest.fn();
        mount(
            <Router>
            <_Root
                {...baseProps}
                user={{current:{type: 'success', value: {email: 'abc@example.com', username: 'abc'}}}}
                router={{location:{search: 'token=xyz&foo=bar'}}}
                actions={{...baseProps.actions, history: {replace: spy}}}
                {...{} as any}
            /></Router>
        );
        expect(spy.mock.calls[0]).toEqual([{search: "foo=bar"}]);
    });
});