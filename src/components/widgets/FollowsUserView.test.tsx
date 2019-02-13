import React from 'react';
import strings from '../../strings';
import { mount, render } from 'enzyme';
import { Provider } from 'react-redux';
import { merge } from 'lodash';
import { FollowsUserView } from './FollowsUserView';
import { FactoryBot } from 'factory-bot-ts';
import { User, CurrentUser } from '../../services/api/models';
import { Button } from 'semantic-ui-react';
import configureMockStore from 'redux-mock-store';
import * as Follows from '../../store/follows';


describe('FollowsUserView', () => {
    function makeTestStore(overrides: any) {
        return configureMockStore([])(
            merge({}, {}, overrides) as any
    )};

    const user = FactoryBot.build<User>('user');
    const currentUser = FactoryBot.build<CurrentUser>('currentUser');

    it('action shows unfollow when target is already followed', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: true
                },
                results: {}
            }
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        expect(w.text()).toContain(strings.user.follows.unfollow['en']);
    });

    it('action shows follow when target is unknown', () => {
        const store = makeTestStore({
            follows: {
                values: {},
                results: {}
            }
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        expect(w.text()).toContain(strings.user.follows.follow['en']);
    });

    it('action shows follow when target is not followed', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {}
            }
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        expect(w.text()).toContain(strings.user.follows.follow['en']);
    });

    it('shows loading when checking or changing status', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {
                    [user.username]: {type: 'loading'}
                }
            }
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        expect((w.find(Button).props().loading)).toBe(true);
    });

    it('emits remove action on click when already followed', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: true
                },
                results: {}
            },
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        w.find('.follow-toggle-button').hostNodes().simulate('click');
        expect(store.getActions()).toContainEqual(
            Follows.actions.removeUserFollowing({username: user.username, currentUsername: currentUser.username})
        );
    });

    it('emits add action on click when not already followed', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {}
            },
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        w.find('.follow-toggle-button').hostNodes().simulate('click');
        expect(store.getActions()).toContainEqual(
            Follows.actions.addUserFollowing({username: user.username, currentUsername: currentUser.username})
        );
    });

    it('returns null if there is no current user', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {}
            },
        });
        const w = render(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={null}/>
        </Provider>);
        expect(w.html()).toBe(null);
    });

    it('loads follow info on mount', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {}
            },
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);
        expect(store.getActions()).toContainEqual(
            Follows.actions.loadUserFollowing({username: user.username, currentUsername: currentUser.username})
        );
    });

    it('loads follow if the target user changes', () => {
        const store = makeTestStore({
            follows: {
                values: {
                    [user.username]: false
                },
                results: {}
            },
        });
        const w = mount(<Provider store={store}>
            <FollowsUserView targetUsername={user.username} currentUsername={currentUser.username}/>
        </Provider>);

        const otherUser = FactoryBot.build<User>('user');
        w.setProps({children:
            <FollowsUserView targetUsername={otherUser.username} currentUsername={currentUser.username}/>
        });
        expect(store.getActions()).toContainEqual(
            Follows.actions.loadUserFollowing({username: otherUser.username, currentUsername: currentUser.username})
        );
    });
});