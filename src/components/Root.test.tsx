import React from 'react';
import { Root, _Root } from './Root';
import { mount } from 'enzyme';
import { LoginForm } from './user/LoginForm';
import { ApiErrors } from '../services';
import { InitialLoader } from './user/InitialLoader';
import { Header } from './Header';
import { MemoryRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createMemoryHistory } from 'history';
import { routerMiddleware, replace } from 'connected-react-router';
import { Optional } from '../utils';

describe('Root', () => {

    function makeTestStore(currentUserResult: any, spy: any = jest.fn(), search: string = '') {
        const history = createMemoryHistory();
        return createStore((s: any, a: any) => {
            spy(a);
            return {
                router: {location: {search: search}},
                feed: {posts: [] },
                user: {
                    currentUserResult
                },
                actions: {
                    feed: {loadChangedPosts: () => {}},
                    user: {
                        loadIfPossible: () => {},
                    }
                }
            }
        })
    };

    it('shows header when there is a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore({type: 'success', value: {email: 'abc@example.com', username: 'abc'}})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(Header).exists()).toBe(true);
    });

    it('does not show header message when there is not a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore({type: 'loading'})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(Header).exists()).toBe(false);
    });

    it('shows the initial loader when loading', () => {
        const w = mount(
            <Router><Provider store={makeTestStore({type: 'loading'})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(true);
    });

    it('does not show the initial loader after loading', () => {
        let w = mount(
            <Router><Provider store={makeTestStore({type: 'success', value: {email: 'abc@example.com', username: 'abc'}})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);

        w = mount(
            <Router><Provider store={makeTestStore({type: 'failed', error: ApiErrors.noTokenError})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);
    });

    it('shows the login form when there is not a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore({type: 'failed', error: ApiErrors.noTokenError})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(LoginForm).exists()).toBe(true);
    });

    it('does not show the login form when there is a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore({type: 'success', value: {email: 'abc@example.com', username: 'abc'}})}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(LoginForm).exists()).toBe(false);
    });

    it('removes login codes from the url', () => {
        const spy = jest.fn();
        mount(
            <Router><Provider store={makeTestStore(
                {type: 'success', value: {email: 'abc@example.com', username: 'abc'}}, spy, 'token=xyz'
            )}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(spy.mock.calls).toContainEqual([replace({search: ''})]);
    });

    fit('does not remove other arguments from the url', () => {
        const spy = jest.fn();
        mount(
            <Router initialEntries={[{search:'token=xyz&foo=bar'}]}>
            <Provider store={makeTestStore(
                {type: 'success', value: {email: 'abc@example.com', username: 'abc'}}, spy, 'token=xyz&foo=bar'
            )}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(spy.mock.calls).toContainEqual([replace({search: 'foo=bar'})]);
    });
});