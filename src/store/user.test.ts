import { actions, submitLoginSaga, loadIfPossibleSaga, submitRegisterSaga, updateProfileSaga, reducers } from "./user";
import { put } from "redux-saga/effects";
import { callMethod } from "../utils";
import { loginRequest, currentUserRequest, registerRequest } from "../services/api/requests";
import { services, ApiErrors, callApi } from "../services";
import { FactoryBot } from "factory-bot-ts";
import { UserProfile, User, CurrentUser } from "../services/api/models";

describe('user sagas', () => {
    describe('submitRegisterSaga', () => {
        it('marks the state as loading on start', () => {
            const email = 'test@example.com';
            const effects: Generator = submitRegisterSaga(actions.submitRegister({email}));
            expect(effects.next().value).toEqual(put(actions.setRegisterResult({type: 'loading'})));
        });

        it('passes the given email to the api', () => {
            const email = 'test@example.com';
            const effects: Generator = submitRegisterSaga(actions.submitRegister({email}));
            effects.next();
            expect(effects.next().value.CALL.body).toEqual((callApi(registerRequest({email})) as any).CALL.body);
        });

        it('marks the state with the result of the api call', () => {
            const email = 'test@example.com';
            const effects: Generator = submitRegisterSaga(actions.submitRegister({email}));
            const result = {type: 'success', value: {}};
            effects.next();
            effects.next();
            expect(effects.next(result).value).toEqual(put(actions.setRegisterResult(result as any)));
        });
    });

    describe('submitLoginSaga', () => {
        it('marks the state as loading on start', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            expect(effects.next().value).toEqual(put(actions.setLoginResult({type: 'loading'})));
        });

        it('passes the given email to the api', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            effects.next();
            expect(effects.next().value.CALL.body).toEqual((callApi(loginRequest({email})) as any).CALL.body);
        });

        it('marks the state with the result of the api call', () => {
            const email = 'test@example.com';
            const effects: Generator = submitLoginSaga(actions.submitLogin({email}));
            const result = {type: 'success', value: {username: 'whatever', email}};
            effects.next();
            effects.next();
            expect(effects.next(result).value).toEqual(put(actions.setLoginResult(result as any)));
        });
    });

    describe('loadIfPossibleSaga', () => {
        it('does not validate a token if we do not have one', () => {
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token: undefined}));
            expect(effects.next().value).not.toEqual(put(actions.setValidating(true)));
        });

        it('does start validating a token if we do have one', () => {
            const token = 'abc123';
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token}));
            expect(effects.next().value).toEqual(put(actions.setValidating(true)));
        });

        it('if validation succeeds we store the token', () => {
            const token = 'abc123';
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token}));
            effects.next();
            effects.next();
            const result = {type: 'success', value: {token: token}};
            expect(effects.next(result).value.CALL.args).toEqual(callMethod(services.storage, o => o.setToken, token).CALL.args);
        });

        it('if validation succeeds we do not store the token', () => {
            const token = 'abc123';
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token}));
            effects.next();
            effects.next();
            const result = {type: 'failure', error: {}};
            expect(effects.next(result).value.CALL).toBeFalsy();
        });

        it('if we do not have a token we do not try to load the current user', () => {
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token: undefined}));
            effects.next();
            expect(effects.next().value).toEqual(put(actions.setCurrentUserResult({type: 'failure', error: ApiErrors.noTokenError})));
        });

        it('if we have a token we try to load the current user', () => {
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token: undefined}));
            effects.next();
            expect(effects.next('token').value).toEqual(put(actions.setCurrentUserResult({type: 'loading'})));
        });

        it('if we have a token we request the current user', () => {
            const effects: Generator = loadIfPossibleSaga(actions.loadIfPossible({token: undefined}));
            effects.next();
            expect(effects.next('token').value).toEqual(put(actions.setCurrentUserResult({type: 'loading'})));
            expect(effects.next().value.CALL.body).toEqual((callApi(currentUserRequest()) as any).CALL.body);
            const result = {type: 'success', value: {username: 'whatever', email: 'whatever'}};
            expect(effects.next(result).value).toEqual(put(actions.setCurrentUserResult(result as any)));
        });

    });

    describe('updateProfileSaga', () => {
        it('sets loading on start', () => {
            const user = FactoryBot.build<CurrentUser>('currentUser');
            const effects: Generator = updateProfileSaga(actions.updateProfile({username: user.username, profile: user.profile}));
            expect(effects.next().value).toEqual(put(actions.setUpdateProfileResult({type: 'loading'})));
        });

        it('sets loading on start', () => {
            const user = FactoryBot.build<CurrentUser>('currentUser');
            const effects: Generator = updateProfileSaga(actions.updateProfile({username: user.username, profile: user.profile}));
            expect(effects.next().value).toEqual(put(actions.setUpdateProfileResult({type: 'loading'})));
        });

        it('updates with the result', () => {
            const user = FactoryBot.build<CurrentUser>('currentUser');
            const effects: Generator = updateProfileSaga(actions.updateProfile({username: user.username, profile: user.profile}));
            effects.next();
            effects.next();
            const result = {type: 'failure' as 'failure', error: ApiErrors.connectionError};
            expect(effects.next(result).value).toEqual(put(actions.setUpdateProfileResult(result)));
        });

        it('it ends after setting the value if the result is failure', () => {
            const user = FactoryBot.build<CurrentUser>('currentUser');
            const effects: Generator = updateProfileSaga(actions.updateProfile({username: user.username, profile: user.profile}));
            effects.next();
            effects.next();
            const result = {type: 'failure' as 'failure', error: ApiErrors.connectionError};
            effects.next(result);
            expect(effects.next().done).toBe(true);
        });

        it('it updates the current user if the result is success', () => {
            const user = FactoryBot.build<CurrentUser>('currentUser');
            const effects: Generator = updateProfileSaga(actions.updateProfile({username: user.username, profile: user.profile}));
            effects.next();
            effects.next();
            const result = {type: 'success' as 'success', value: user.profile};
            effects.next(result);
            expect(effects.next().value).toEqual(put(actions.setCurrentUserProfile(result.value)));
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
            const result = {type: 'success', value: {
                profile: {
                    bio: 'abc123'
                }
            }}
            const state = reducers({currentUserResult: result} as any, actions.setCurrentUserProfile(profile));
            expect((state.currentUserResult as any).value.profile).toEqual(profile);
        });
    });

    describe('addFollower', () => {
        it('adds to the list of followers for the followee', () => {
            const followeeUser = FactoryBot.build<User>('user');
            const followerUser = FactoryBot.build<User>('user');
            const followeeResult = {type: 'success', value: followeeUser};
            const followerResult = {type: 'success', value: followerUser};
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
            const followeeResult = {type: 'success', value: followeeUser};
            const followerResult = {type: 'success', value: followerUser};
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
            const result = {type: 'success', value: user};
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