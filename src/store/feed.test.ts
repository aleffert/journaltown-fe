import produce from "immer"
import { put } from 'redux-saga/effects';
import { FactoryBot } from 'factory-bot-ts';
import { actions, getNextPostsSaga, getChangedPostsSaga, reducers, keyForFilters } from './feed';
import { ApiErrors } from '../services';
import { Post } from '../services/api/models';

describe('feed sagas', () => {
    const filters = {username: 'hi'};
    describe('getNextPostsSaga', () => {
        it('marks the state as loading on start', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since: null}));
            expect(effects.next().value).toEqual(put(actions.setNextPostsResult(filters, {type: 'loading'})));
        });

        it('does not include query param if since is not set', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since: null}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual(filters);
        });

        it('does include query param if since is set', () => {
            const since = '2019-01-19T14:22:17.566979+00:00';
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual(Object.assign({}, filters, {created_at__lt: since}));
        });

        it('integrates posts on success', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since: null}));
            const posts = FactoryBot.buildList<Post>('post', 2);
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: posts}).value).toEqual(put(actions.integratePosts(filters, posts)));
        });

        it('does not integrate posts on failure', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since: null}));
            const posts = FactoryBot.buildList<Post>('post', 2);
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.connectionError}).value).not.toEqual(
                put(actions.integratePosts(filters, posts))
            );
        });

        it('sets the result status when done', () => {
            const effects: Generator = getNextPostsSaga(actions.loadNextPosts({filters, since: null}));
            const posts: any = [];
            effects.next();
            effects.next();
            const result = {type: 'success' as 'success', value: posts};
            effects.next(result);
            expect(effects.next().value).toEqual(put(actions.setNextPostsResult(filters, result)));
            expect(effects.next().done).toBe(true);
        });
    });

    describe('getChangedPostsSaga', () => {
        it('marks the state as loading on start', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since: null}));
            expect(effects.next().value).toEqual(put(actions.setChangedPostsResult(filters, {type: 'loading'})));
        });

        it('does not include query param if since is not set', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since: null}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual(filters);
        });

        it('does include query param if since is set', () => {
            const since = '2019-01-19T14:22:17.566979+00:00';
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since}));
            effects.next();
            expect(effects.next().value.CALL.args[0].query).toEqual(Object.assign({}, filters, {last_modified__gt: since}));
        });

        it('integrates posts on success', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since: null}));
            const post = FactoryBot.build<Post>('post');
            const posts = [post];
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: posts}).value).toEqual(put(actions.integratePosts(filters, posts)));
        });

        it('does not integrate posts on failure', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since: null}));
            const post = FactoryBot.build<Post>('post');
            const posts = [post];
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.connectionError}).value).not.toEqual(put(actions.integratePosts(filters, posts)));
        });

        it('sets the result status when done', () => {
            const effects: Generator = getChangedPostsSaga(actions.loadChangedPosts({filters, since: null}));
            const posts: any = [];
            effects.next();
            effects.next();
            const result = {type: 'success' as 'success', value: posts};
            effects.next(result);
            expect(effects.next().value).toEqual(put(actions.setChangedPostsResult(filters, result)));
            expect(effects.next().done).toBe(true);
        });
    });

    describe('integratePosts', () => {
        it('adds in new posts', () => {
            const count = 2;
            const posts = FactoryBot.buildList<Post>('post', count);
            const store = {posts: {}, feeds: {}} as any;
            const integrated = reducers(store, actions.integratePosts(filters, posts)).posts;
            expect(Object.keys(integrated)).toHaveLength(2);
            for(let i = 0; i < count; i++) {
                expect(integrated[posts[i].id]).toEqual(posts[i]);
            }
        });
        it('overwrites existing posts', () => {
            const count = 2;
            const posts = FactoryBot.buildList<Post>('post', count);
            const initial = reducers({posts: {}, feeds: {}} as any, actions.integratePosts(filters, posts));
            const updatedPosts = produce(posts, draftState => {
                draftState[0].title = 'some other title';
                draftState[1].title = 'yet another title';
            });
            const integrated = reducers(initial, actions.integratePosts(filters, updatedPosts)).posts;
            expect(Object.keys(integrated)).toHaveLength(2);
            for(let i = 0; i < count; i++) {
                expect(integrated[updatedPosts[i].id]).toEqual(updatedPosts[i]);
                expect(initial.posts[posts[i].id]).not.toEqual(updatedPosts[i]);
            }
        });
        it('creates a feed if necessary', () => {
            const store = {posts: {}, feeds: {}} as any;
            const posts = FactoryBot.buildList<Post>('post', 2);
            const postIds = posts.map(post => post.id);
            const integrated = reducers(store, actions.integratePosts(filters, posts));
            expect(integrated.feeds[keyForFilters(filters)]).toEqual({
                changedPostResults: undefined, filters, postIds, nextPostsResult: undefined
            });
        });
        it('does not affect other feeds', () => {
            const feed = {postIds: [], nextPostsResult: undefined, changedPostResults: undefined, filters: {username: 'someone'}};
            const store = {posts: {}, feeds: {[keyForFilters(feed.filters)]: feed}} as any;
            const posts = FactoryBot.buildList<Post>('post', 2);
            const integrated = reducers(store, actions.integratePosts(filters, posts));
            expect(integrated.feeds[keyForFilters(feed.filters)]).toEqual(feed);
        });
    });

    describe('setNextPostsResult', () => {
        it('makes up a new feed entry if none is present', () => {
            const store = {posts: {}, feeds: {}};
            const result = {type: 'success' as 'success', value: []};
            expect(reducers(store, actions.setNextPostsResult(filters, result)).feeds[keyForFilters(filters)]).toEqual(
                {changedPostsResult: undefined, filters, nextPostsResult: result, postIds: []}
            );
        });
    });

    describe('setChangedPostsResult', () => {
        it('makes up a new feed entry if none is present', () => {
            const store = {posts: {}, feeds: {}};
            const result = {type: 'success' as 'success', value: []};
            expect(reducers(store, actions.setChangedPostsResult(filters, result)).feeds[keyForFilters(filters)]).toEqual(
                {changedPostsResult: result, filters, nextPostsResult: undefined, postIds: []}
            );
        });
    });

    describe('deletePost', () => {
        it('removes the post from the list of posts', () => {
            const posts = FactoryBot.buildList<Post>('post', 2);
            const post = posts[0];
            let store: any = {posts: {}, feeds: {}};
            store = reducers(store, actions.integratePosts({}, posts));
            store = reducers(store, actions.deletePost(post.id));
            expect(store.posts[posts[0].id]).toBeUndefined();
            expect(Object.keys(store.posts)).toEqual([`${posts[1].id}`]);
        });
        it('removes the post from all feeds', () => {
            const posts = FactoryBot.buildList<Post>('post', 2);
            const post = posts[0];
            let store: any = {posts: {}, feeds: {}};
            store = reducers(store, actions.integratePosts({}, posts));
            store = reducers(store, actions.integratePosts({username: 'someone'}, posts));
            store = reducers(store, actions.deletePost(post.id));
            expect(store.feeds[keyForFilters({})].postIds).toEqual([posts[1].id]);
            expect(store.feeds[keyForFilters({username: "someone"})].postIds).toEqual([posts[1].id]);
        });
    });
});