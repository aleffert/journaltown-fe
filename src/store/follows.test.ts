import { actions, reducers, loadUserFollowingSaga, addUserFollowingSaga, removeUserFollowingSaga } from './follows';
import { FactoryBot } from 'factory-bot-ts';
import { RelatedUser, CurrentUser, User } from '../services/api/models';
import { expectSaga } from 'redux-saga-test-plan';
import * as U from './user';

describe('follows sagas', () => {
    describe('loadUserFollowingSaga', () => {
        const current = FactoryBot.build<CurrentUser>('currentUser');
        const target = FactoryBot.build<User>('user');
        const action = actions.loadUserFollowing({currentUsername: current.username, username: target.username});

        it('sets the status to loading', async () => {
            const result = {type: 'loading' as 'loading'};
            await expectSaga(loadUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: [target]})})
                .put(actions.setUserResults({usernames: [target.username], result}))
                .run();
        });

        it('it passes the right arguments to the api', async () => {
            await expectSaga(loadUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: [target]})})
                .call.like({args: [{query: {username: target.username}}]})
                .run();
        });

        it('it puts the result value', async () => {
            const result = {type: 'success' as 'success', value: [target]};
            await expectSaga(loadUserFollowingSaga, action)
                .provide({call: () => result})
                .put(actions.setUserResults({usernames: [target.username], result}))
                .run();
        });
    });

    describe('addUserFollowingSaga', () => {
        const current = FactoryBot.build<CurrentUser>('currentUser');
        const target = FactoryBot.build<User>('user');
        const action = actions.addUserFollowing({currentUsername: current.username, username: target.username});
        it('sets the status to loading for the given user', async () => {
            const result = {type: 'loading' as 'loading'};
            await expectSaga(addUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: [target]})})
                .put(actions.setUserResults({usernames: [target.username], result}))
                .run();

        });

        it('passes the right arguments to the api', async () => {
            await expectSaga(addUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: [target]})})
                .call.like({args: [{body: {username: target.username}}]})
                .run();
        });

        it('it puts the result value', async () => {
            const result = {type: 'success' as 'success', value: [target]};
            await expectSaga(addUserFollowingSaga, action)
                .provide({call: () => result})
                .put(actions.setUserResults({usernames: [target.username], result}))
                .put(U.actions.addFollower({followerUsername: current.username, followeeUsername: target.username}))
                .run();
        });
    });

    describe('deleteUserFollowingSaga', () => {
        const current = FactoryBot.build<CurrentUser>('currentUser');
        const target = FactoryBot.build<User>('user');
        const action = actions.removeUserFollowing({currentUsername: current.username, username: target.username});

        it('sets the status to loading for the given user', async () => {
            const result = {type: 'loading' as 'loading'};
            await expectSaga(removeUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: {}})})
                .put(actions.setUserResults({usernames: [target.username], result}))
                .run();
        });

        it('passes the right arguments to the api', async () => {
            await expectSaga(removeUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: {}})})
                .call.like({args: [{body: {username: target.username}}]})
                .run();
        });

        it('on success it removes the follow from the store', async () => {
            await expectSaga(removeUserFollowingSaga, action)
                .provide({call: () => ({type: 'success', value: {}})})
                .put(U.actions.removeFollower({followerUsername: current.username, followeeUsername: target.username}))
                .run();
        });

        it('on failure it does not remove the follow from the store', async () => {
            await expectSaga(removeUserFollowingSaga, action)
                .provide({call: () => ({type: 'failure', value: {}})})
                .not.put(U.actions.removeFollower({followerUsername: current.username, followeeUsername: target.username}))
                .run();

        });
    });
});

describe('follows reducers', () => {
    it('sets a value on success when there is a related user', () => {
        const user = FactoryBot.build<RelatedUser>('relatedUser');
        const usernames = [user.username];
        const result = {type: 'success' as 'success', value: [user]};
        const state = reducers({results: {}, values: {}} as any, actions.setUserResults({usernames, result}));
        expect(state.results[user.username]).toEqual({type: 'success', value: user});
        expect(state.values[user.username]).toEqual(true);
    });

    it('clears a value on success when there is no related user', () => {
        const user = FactoryBot.build<RelatedUser>('relatedUser');
        const usernames = [user.username];
        const result = {type: 'success' as 'success', value: []};
        const state = reducers({results: {}, values: {}} as any, actions.setUserResults({usernames, result}));
        expect(state.results[user.username]).toEqual({type: 'success', value: undefined});
        expect(state.values[user.username]).toEqual(false);
    });

    it('sets loading to the result if we pass that', () => {
        const user = FactoryBot.build<RelatedUser>('relatedUser');
        const usernames = [user.username];
        const result = {type: 'loading' as 'loading'};
        const state = reducers({results: {}, values: {}} as any, actions.setUserResults({usernames, result}));
        expect(state.results[user.username]).toEqual({type: 'loading'});
        expect(state.values[user.username]).toEqual(undefined);
    });
});