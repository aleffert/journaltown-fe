import produce from "immer"
import { put } from 'redux-saga/effects';
import { FactoryBot } from 'factory-bot-ts';
import { actions, getNextPostsSaga, getChangedPostsSaga, reducers } from './feed';
import { ApiErrors } from '../services';
import { Post } from '../services/api/models';

describe('feed sagas', () => {
    describe('getNextPostsSaga', () => {
        it('marks the state as loading on start', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since: null}));
            expect(effects.next().value).toEqual(put(actions.setNextPostsResult({type: 'loading'})));
        });

        it('does not include query param if since is not set', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since: null}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual({});
        });

        it('does include query param if since is set', () => {
            const since = '2019-01-19T14:22:17.566979+00:00';
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual({created_at__lt: since});
        });

        it('integrates posts on success', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since: null}));
            const posts = FactoryBot.buildList<Post>('post', 2);
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: posts}).value).toEqual(put(actions.integratePosts(posts)));
        });

        it('does not integrate posts on failure', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since: null}));
            const posts = FactoryBot.buildList<Post>('post', 2);
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.connectionError}).value).not.toEqual(put(actions.integratePosts(posts)));
        });

        it('sets the result status when done', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({since: null}));
            const posts: any = [];
            effects.next();
            effects.next();
            const result = {type: 'success' as 'success', value: posts};
            effects.next(result);
            expect(effects.next().value).toEqual(put(actions.setNextPostsResult(result)));
            expect(effects.next().done).toBe(true);
        });
    });

    describe('getChangedPostsSaga', () => {
        it('marks the state as loading on start', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since: null}));
            expect(effects.next().value).toEqual(put(actions.setChangedPostsResult({type: 'loading'})));
        });

        it('does not include query param if since is not set', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since: null}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual({});
        });

        it('does include query param if since is set', () => {
            const since = '2019-01-19T14:22:17.566979+00:00';
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual({last_modified__gt: since});
        });

        it('integrates posts on success', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since: null}));
            const posts = [{
                title: 'title',
                body: 'body',
                created_at: 'date',
                last_modified: 'date',
                author: 1,
                id: 2
            }];
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: posts}).value).toEqual(put(actions.integratePosts(posts)));
        });

        it('does not integrate posts on failure', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since: null}));
            const posts = [{
                title: 'title',
                body: 'body',
                created_at: 'date',
                last_modified: 'date',
                author: 1,
                id: 2
            }];
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.connectionError}).value).not.toEqual(put(actions.integratePosts(posts)));
        });

        it('sets the result status when done', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({since: null}));
            const posts: any = [];
            effects.next();
            effects.next();
            const result = {type: 'success' as 'success', value: posts};
            effects.next(result);
            expect(effects.next().value).toEqual(put(actions.setChangedPostsResult(result)));
            expect(effects.next().done).toBe(true);
        });
    });

    describe('integratePosts', () => {
        it('adds in new posts', () => {
            const count = 2;
            const posts = FactoryBot.buildList<Post>('post', count);
            const store = {posts: {}} as any;
            const integrated = reducers(store, actions.integratePosts(posts)).posts;
            expect(Object.keys(integrated)).toHaveLength(2);
            for(let i = 0; i < count; i++) {
                expect(integrated[posts[i].id]).toEqual(posts[i]);
            }
        });
        it('overwrites existing posts', () => {
            const count = 2;
            const posts = FactoryBot.buildList<Post>('post', count);
            const initial = reducers({posts: {}} as any, actions.integratePosts(posts));
            const updatedPosts = produce(posts, draftState => {
                draftState[0].title = 'some other title';
                draftState[1].title = 'yet another title';
            });
            const integrated = reducers(initial, actions.integratePosts(updatedPosts)).posts;
            expect(Object.keys(integrated)).toHaveLength(2);
            for(let i = 0; i < count; i++) {
                expect(integrated[updatedPosts[i].id]).toEqual(updatedPosts[i]);
                expect(initial.posts[posts[i].id]).not.toEqual(updatedPosts[i]);
            }
        });
    });
});