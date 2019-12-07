import React from 'react';
import { Root } from './Root';
import { mount } from 'enzyme';
import { LoginForm } from './user/LoginForm';
import { InitialLoader } from './user/InitialLoader';
import { Header } from './Header';
import { MemoryRouter as Router } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { replace } from 'connected-react-router';
import { FactoryBot } from 'factory-bot-ts';
import { CurrentUser } from '../services/api/models';
import { makeSuccess, makeFailure } from '../utils';
import { AppErrors } from '../utils/errors';

describe('Root', () => {

    const user = FactoryBot.build<CurrentUser>('currentUser');

    function makeTestStore(currentUserResult: any, spy: any = jest.fn(), search: string = '') {
        return createStore((_: any, a: any) => {
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
            <Router><Provider store={makeTestStore(makeSuccess(user))}>
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
            <Router><Provider store={makeTestStore(makeSuccess(user))}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);

        w = mount(
            <Router><Provider store={makeTestStore(makeFailure(AppErrors.noTokenError))}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(InitialLoader).exists()).toBe(false);
    });

    it('shows the login form when there is not a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore(makeFailure(AppErrors.noTokenError))}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(w.find(LoginForm).exists()).toBe(true);
    });

    it('does not show the login form when there is a current user', () => {
        const w = mount(
            <Router><Provider store={makeTestStore(makeSuccess(user))}>
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
                makeSuccess(user), spy, 'token=xyz'
            )}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(spy.mock.calls).toContainEqual([replace({search: ''})]);
    });

    it('does not remove other arguments from the url', () => {
        const spy = jest.fn();
        mount(
            <Router initialEntries={[{search:'token=xyz&foo=bar'}]}>
            <Provider store={makeTestStore(
                makeSuccess(user), spy, 'token=xyz&foo=bar'
            )}>
            <Root
                {...{} as any}
            /></Provider></Router>
        );
        expect(spy.mock.calls).toContainEqual([replace({search: 'foo=bar'})]);
    });
});