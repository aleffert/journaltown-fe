import React from 'react';
import { FactoryBot } from 'factory-bot-ts';
import { CurrentUser } from '../../services/api/models';
import { merge } from 'lodash';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { _EditProfilePage } from './EditProfilePage';

describe('EditProfilePage', () => {
    const baseProps = {
        match: {
            params: {
            }
        },
        user: {
            draftProfile: {}
        },
        actions: {
            user: {
            }
        }
    } as any;

    it('sets the draft profile on mount if there is a current user', () => {
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: currentUser.username}},
            user: {
                currentUserResult: {type: 'success', value: currentUser}
            },
            actions: {
                user: {
                    setDraftProfile: jest.fn()
                }
            }
        });
        mount(
            <MemoryRouter>
                <_EditProfilePage {...props}></_EditProfilePage>
            </MemoryRouter>
        );
        expect(props.actions.user.setDraftProfile.mock.calls[0]).toEqual([currentUser.profile]);
    });

    it('does not set the draft profile on mount if there is no current user', () => {
        const currentUser = FactoryBot.build<CurrentUser>('currentUser');
        const props = merge({}, baseProps, {
            match: {params: {username: currentUser.username}},
            user: {
                currentUserResult: undefined
            },
            actions: {
                user: {
                    setDraftProfile: jest.fn()
                }
            }
        });
        mount(
            <MemoryRouter>
                <_EditProfilePage {...props}></_EditProfilePage>
            </MemoryRouter>
        );
        expect(props.actions.user.setDraftProfile.mock.calls).toHaveLength(0);
    });

});