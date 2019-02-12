import {actions, reducers} from './follows';
import { FactoryBot } from 'factory-bot-ts';
import { RelatedUser } from '../services/api/models';

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