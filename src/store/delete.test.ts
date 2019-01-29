import { actions, deletePostSaga } from './delete';
import { ApiErrors } from '../services';
import { put } from 'redux-saga/effects';
import * as Feed from './feed';
import * as Post from './post';
import * as Navigate from './navigation';

describe('delete sagas', () => {
    describe('deletePostSaga', () => {

        const postId = 123;

        it('sends a request to delete the post', () => {
            const effects: Generator = deletePostSaga(actions.sendDeletePost({postId}));
            const args = effects.next().value.CALL.args;
            expect(args[0].path).toEqual('/posts/123/');
            expect(args[0].method).toEqual('DELETE');
        });

        it('does nothing if the API request fails', () => {
            const effects: Generator = deletePostSaga(actions.sendDeletePost({postId}));
            const result = {type: 'failure', error: ApiErrors.unknownError};
            effects.next();
            effects.next(result);
            expect(effects.next().done).toBe(true);
        });

        it('clears stuff out if the request succeeds', () => {
            const effects: Generator = deletePostSaga(actions.sendDeletePost({postId}));
            const result = {type: 'success', value: {}};
            effects.next();
            const emitted = [];
            emitted.push(effects.next(result).value);
            emitted.push(effects.next().value);
            expect(emitted).toContainEqual(put(Feed.actions.deletePost(postId)))
            expect(emitted).toContainEqual(put(Post.actions.clearPost(postId)))
        });

        it('ends if there is no redirect', () => {
            const effects: Generator = deletePostSaga(actions.sendDeletePost({postId}));
            const result = {type: 'success', value: {}};
            effects.next();
            effects.next(result);
            effects.next();
            expect(effects.next().done).toBe(true);
        });

        it('redirects if there is a redirect', () => {
            const redirect: Navigate.NavigationPath = {type: 'main'};
            const effects: Generator = deletePostSaga(actions.sendDeletePost({postId, redirect}));
            const result = {type: 'success', value: {}};
            effects.next();
            effects.next(result);
            effects.next();
            expect(effects.next().value).toEqual(put(Navigate.actions.to(redirect)));
        });
    });
});