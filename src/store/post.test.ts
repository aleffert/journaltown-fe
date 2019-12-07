import { loadPostSaga, actions } from './post';
import { put } from 'redux-saga/effects';
import { FactoryBot } from 'factory-bot-ts';
import { Post } from '../services/api/models';
import { makeSuccess } from '../utils';

describe('post sagas', () => {
    describe('loadPostSaga', () => {
        it('sets loading if there is not a current post', () => {
            const postId = 1;
            const effects = loadPostSaga(actions.loadPost({postId, current: undefined}));
            expect(effects.next().value).toEqual(put(actions.setPostResult({postId, value: {type: 'loading'}})));
        });

        it('does not set loading if there is a current post', () => {
            const post = FactoryBot.build<Post>('post');
            const effects = loadPostSaga(actions.loadPost({postId: post.id, current: makeSuccess(post)}));
            expect(effects.next().value).not.toEqual(
                put(actions.setPostResult({postId: post.id, value: {type: 'loading'}}))
            );
        });

        it('updates the post with the api result', () => {
            const post = FactoryBot.build<Post>('post');
            const effects = loadPostSaga(actions.loadPost({postId: post.id, current: makeSuccess(post)}));
            effects.next();
            expect(effects.next(makeSuccess(post)).value).toEqual(
                put(actions.setPostResult({postId: post.id, value: makeSuccess(post)}))
            );
        });
    });
});