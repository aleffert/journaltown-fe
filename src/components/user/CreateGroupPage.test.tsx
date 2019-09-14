import React from 'react';
import { merge } from 'lodash';
import { CreateGroupPage } from './CreateGroupPage';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { FactoryBot } from 'factory-bot-ts';
import { User } from '../../services/api/models';
import { ApiErrors, ApiError } from '../../services';
import strings from '../../strings';

describe('CreateGroupPage', () => {

    function makeTestStore(overrides: any) {
        return configureMockStore([])(
            merge({}, {}, overrides) as any
    )};

    it('renders', () => {
        const store = makeTestStore({
            user: {profiles: {}}
        });
        const user = FactoryBot.build<User>('user');
        const props = {
            match: {
                params: user.username
            }
        } as any;
        const w = mount(
            <Provider store={store}><CreateGroupPage {...props}/></Provider>
        );
        expect(w.exists()).toBe(true);
    });

    describe('when create friend group fails', () => {

        function makeFailingStore(error: ApiError) {
            const store = makeTestStore({
                user: {profiles: {
                    [user.username]: {type: 'success', value: user}
                }},
                friendGroup: {
                    createGroupResult: {type: 'failure', error},
                    selectedFriends: []
                }
            });
            return store;
        }

        const user = FactoryBot.build<User>('user');
        const props = {
            match: {
                params: {
                    username: user.username
                }
            }
        } as any;

        it('shows a failure message when group creation fails', () => {
            const store = makeFailingStore(ApiErrors.unknownError);
            const w = mount(
                <Provider store={store}><CreateGroupPage {...props}/></Provider>
            );
            expect(w.html()).toContain(strings.errors.unknown['en']);
        });
    });

});