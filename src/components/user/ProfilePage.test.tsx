import React from 'react';
import { mount } from "enzyme";
import { _ProfilePage } from "./ProfilePage";
import { MemoryRouter } from "react-router";
import { merge } from 'lodash';
import { FactoryBot } from 'factory-bot-ts';
import { User, CurrentUser } from '../../services/api/models';
import strings from '../../strings';

describe('ProfilePage', () => {
    const baseProps = {
        match: {
            params: {
            }
        },
        user: {
            users: {}
        },
        actions: {
            user: {
                loadUser: () => {}
            }
        }
    } as any;

    it('shows an email address if this is the profile of the current user', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser', user as any);
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
            user: {
                users: {[user.username]: {type: 'success', value: user}},
                currentUserResult: {type: 'success', value: currentUser}
            }
        });
        const w = mount(
            <MemoryRouter>
                <_ProfilePage {...props}></_ProfilePage>
            </MemoryRouter>
        );
        expect(w.html()).toContain(currentUser.email);
    });
    it('does not show an email address if this is not the profile of the current user', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
            user: {
                users: {[user.username]: {type: 'success', value: user}},
                currentUserResult: {type: 'success', value: currentUser}
            }
        });
        const w = mount(
            <MemoryRouter>
                <_ProfilePage {...props}></_ProfilePage>
            </MemoryRouter>
        );
        expect(w.html()).not.toContain(currentUser.email);
    });
    it('shows a bio if there is one', () => {
        const user = FactoryBot.build<User>('user');
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: user.username}},
            user: {
                users: {[user.username]: {type: 'success', value: user}},
                currentUserResult: {type: 'success', value: currentUser}
            }
        });
        const w = mount(
            <MemoryRouter>
                <_ProfilePage {...props}></_ProfilePage>
            </MemoryRouter>
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
            user: {
                users: {[user.username]: {type: 'success', value: user}},
                currentUserResult: {type: 'success', value: currentUser}
            }
        });
        const w = mount(
            <MemoryRouter>
                <_ProfilePage {...props}></_ProfilePage>
            </MemoryRouter>
        );
        expect(w.html()).not.toContain(strings.user.profile.biography['en']);
    });
});