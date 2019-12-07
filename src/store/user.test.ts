import { actions, submitLoginSaga, loadIfPossibleSaga, submitRegisterSaga, updateProfileSaga, reducers } from "./user";
import { ApiErrors } from "../services";
import { FactoryBot } from "factory-bot-ts";
import { UserProfile, User, CurrentUser } from "../services/api/models";
import { expectSaga } from "redux-saga-test-plan";
import { makeSuccess, makeFailure } from "../utils";
import { AppErrors } from "../utils/errors";

describe('user sagas', () => {
    describe('submitRegisterSaga', () => {
        const email = 'test@example.com';
        const action = actions.submitRegister({email});
        it('marks the state as loading on start', async () => {
            await expectSaga(submitRegisterSaga, action)
                .provide({call: () => ({type: 'loading'})})
                .put(actions.setRegisterResult({type: 'loading'}))
                .run();
        });

        it('passes the given email to the api', async () => {
            await expectSaga(submitRegisterSaga, action)
                .provide({call: () => ({type: 'loading'})})
                .call.like({args: [{body: {email}}]})
                .run();
        });

        it('marks the state with the result of the api call', async () => {
            const result = makeSuccess({});
            await expectSaga(submitRegisterSaga, action)
                .provide({call: () => result})
                .put(actions.setRegisterResult(result))
                .run();
        });
    });

    describe('submitLoginSaga', () => {
        const email = 'test@example.com';
        const action = actions.submitLogin({email});
        it('marks the state as loading on start', async () => {
            await expectSaga(submitLoginSaga, action)
                .provide({call: () => ({type: 'loading'})})
                .put(actions.setLoginResult({type: 'loading'}))
                .run();
        });

        it('passes the given email to the api', async () => {
            await expectSaga(submitLoginSaga, action)
                .provide({call: () => ({type: 'loading'})})
                .call.like({args: [{body: {email}}]})
                .run();
        });

        it('marks the state with the result of the api call', async () => {
            const result = makeSuccess({});
            await expectSaga(submitLoginSaga, action)
                .provide({call: () => result})
                .put(actions.setLoginResult(result))
                .run();
        });
    });

    describe('loadIfPossibleSaga', () => {
        const token = 'abc123';
        it('does not validate a token if we do not have one', async () => {
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token: undefined}))
                .provide({call: () => {}})
                .not.put(actions.setValidating(true))
                .run();
        });

        it('does start validating a token if we do have one', async () => {
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token}))
                .provide({call: () => ({type: 'loading'})})
                .put(actions.setValidating(true))
                .run();
        });

        it('if validation succeeds we store the token', async () => {
            const result = makeSuccess({token});
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token}))
                .provide({call: () => result})
                .call.like({args: [token]})
                .run();
        });

        it('if validation fails we do not store the token', async () => {
            const result = makeFailure(undefined);
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token}))
                .provide({call: () => result})
                .not.call.like({args: [token]})
                .run();
        });

        it('if we do not have a token we do not try to load the current user', async () => {
            const result = makeFailure(AppErrors.noTokenError);
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token: undefined}))
                .provide({call: () => result})
                .put(actions.setCurrentUserResult(result))
                .run();
        });

        it('if we have a token we try to load the current user', async () => {
            const result = makeSuccess('whatever');
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token}))
                .provide({call: () => result})
                .put(actions.setCurrentUserResult({type: 'loading'}))
                .run();
        });

        it('if we have a token we request the current user', async () => {
            const currentUser = FactoryBot.build<CurrentUser>('currentUser');
            const result = makeSuccess(currentUser);
            await expectSaga(loadIfPossibleSaga, actions.loadIfPossible({token}))
                .provide({call: () => result})
                .put(actions.setCurrentUserResult(result))
                .run();
        });

    });

    describe('updateProfileSaga', () => {
        const user = FactoryBot.build<CurrentUser>('currentUser');
        const action = actions.updateProfile({username: user.username, profile: user.profile});
        it('sets loading on start', async () => {
            await expectSaga(updateProfileSaga, action)
                .provide({call: () => ({type: 'loading'})})
                .put(actions.setUpdateProfileResult({type: 'loading'}))
                .run();
        });

        it('updates with the result', async () => {
            const result = makeFailure(AppErrors.connectionError);
            await expectSaga(updateProfileSaga, action)
                .provide({call: () => result})
                .put(actions.setUpdateProfileResult(result))
                .run();
        });

        it('it does not update the current user if the result is failure', async () => {
            const result = makeFailure(AppErrors.connectionError);
            await expectSaga(updateProfileSaga, action)
                .provide({call: () => result})
                .not.put.like({action: {type: actions.setCurrentUserProfile.type}})
                .run();
        });

        it('it updates the current user if the result is success', async () => {
            const result = makeSuccess(user.profile);
            await expectSaga(updateProfileSaga, action)
                .provide({call: () => result})
                .put(actions.setCurrentUserProfile(result.value))
                .run();
        });
    });
});

describe('user reducers', () => {
    describe('setCurrentUserProfile', () => {
        it('does not change the value if the current user is not set', () => {
            const profile = FactoryBot.build<UserProfile>('userProfile');
            const state = reducers({currentUserResult: undefined} as any, actions.setCurrentUserProfile(profile));
            expect(state.currentUserResult).toBeUndefined();
        });
        it('does not change the value if the current user is set', () => {
            const profile = FactoryBot.build<UserProfile>('userProfile');
            const result = makeSuccess({
                profile: {
                    bio: 'abc123'
                }
            });
            const state = reducers({currentUserResult: result} as any, actions.setCurrentUserProfile(profile));
            expect((state.currentUserResult as any).value.profile).toEqual(profile);
        });
    });

    describe('addFollower', () => {
        it('adds to the list of followers for the followee', () => {
            const followeeUser = FactoryBot.build<User>('user');
            const followerUser = FactoryBot.build<User>('user');
            const followeeResult = makeSuccess(followeeUser);
            const followerResult = makeSuccess(followerUser);
            const followeeUsername = followeeUser.username;
            const followerUsername = followerUser.username;
            const baseState = {
                profiles: {
                    [followeeUser.username]: followeeResult,
                    [followerUser.username]: followerResult
                }
            } as any;
            const state = reducers(baseState, actions.addFollower({followeeUsername, followerUsername}));
            expect((state.profiles[followeeUser.username] as any).value.followers).toEqual([{username: followerUser.username}]);
        });

        it('adds to the list of followees for the follower', () => {
            const followeeUser = FactoryBot.build<User>('user');
            const followerUser = FactoryBot.build<User>('user');
            const followeeResult = makeSuccess(followeeUser);
            const followerResult = makeSuccess(followerUser);
            const followeeUsername = followeeUser.username;
            const followerUsername = followerUser.username;
            const baseState = {
                profiles: {
                    [followeeUser.username]: followeeResult,
                    [followerUser.username]: followerResult
                }
            } as any;
            const state = reducers(baseState, actions.addFollower({followeeUsername, followerUsername}));
            expect((state.profiles[followerUser.username] as any).value.following).toEqual([{username: followeeUser.username}]);
        });

        it('adds to the both lists if the user follows themselves', () => {
            const user = FactoryBot.build<User>('user');
            const result = makeSuccess(user);
            const followeeUsername = user.username;
            const followerUsername = user.username;
            const baseState = {
                profiles: {
                    [user.username]: result,
                }
            } as any;
            const state = reducers(baseState, actions.addFollower({followeeUsername, followerUsername}));
            expect((state.profiles[user.username] as any).value.following).toEqual([{username: user.username}]);
            expect((state.profiles[user.username] as any).value.followers).toEqual([{username: user.username}]);
        });

    });
});