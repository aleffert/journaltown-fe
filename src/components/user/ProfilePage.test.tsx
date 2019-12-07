import React from 'react';
import { mount } from "enzyme";
import { ProfilePage } from "./ProfilePage";
import { Provider } from 'react-redux';
import { MemoryRouter } from "react-router";
import { merge } from 'lodash';
import { FactoryBot } from 'factory-bot-ts';
import { User, CurrentUser } from '../../services/api/models';
import strings from '../../strings';
import configureMockStore from 'redux-mock-store';
import { makeSuccess } from '../../utils';

describe('ProfilePage', () => {

    function makeTestStore(overrides: any) {
        return configureMockStore([])(
            merge({}, {
                user: {
                    profiles: {}
                },
                follows: {
                    values: {},
                    results: {}
                },
                actions: {
                    user: {
                        loadUser: () => {}
                    },
                    follows: {
                        loadUserFollowing: () => {}
                    }
                }
            }, overrides) as any
        )};

    const baseProps = {
        match: {
            params: {}
        }
    } as any;

    it('shows an email address if this is the profile of the current user', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser', user as any);
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
        });
        const store = makeTestStore({
            user: {
                profiles: {[user.username]: makeSuccess(user)},
                currentUserResult: makeSuccess(currentUser)
            }
        });
        const w = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ProfilePage {...props}></ProfilePage>
                </MemoryRouter>
            </Provider>
        );
        expect(w.html()).toContain(currentUser.email);
    });
    it('does not show an email address if this is not the profile of the current user', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
        });
        const store = makeTestStore({
            user: {
                profiles: {[user.username]: makeSuccess(user)},
                currentUserResult: makeSuccess(currentUser)
            }
        });
        const w = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ProfilePage {...props}></ProfilePage>
                </MemoryRouter>
            </Provider>
        );
        expect(w.html()).not.toContain(currentUser.email);
    });
    it('shows a bio if there is one', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
        });
        const store = makeTestStore({
            user: {
                profiles: {[user.username]: makeSuccess(user)},
                currentUserResult: makeSuccess(currentUser)
            }
        });
        const w = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ProfilePage {...props}></ProfilePage>
                </MemoryRouter>
            </Provider>
        );
        expect(w.html()).toContain(currentUser.profile.bio);
        expect(w.html()).toContain(strings.user.profile.biography['en']);
    });
    it('does not show a bio if there is not one', () => {
        const user = FactoryBot.build<User>('user');
        user.profile = merge({}, user.profile, {bio: ''});

        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
        });
        const store = makeTestStore({
            user: {
                profiles: {[user.username]: makeSuccess(user)},
                currentUserResult: makeSuccess(currentUser)
            }
        });
        const w = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ProfilePage {...props}></ProfilePage>
                </MemoryRouter>
            </Provider>
        );
        expect(w.html()).not.toContain(strings.user.profile.biography['en']);
    });
});