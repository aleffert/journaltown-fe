import { createPostSaga, startEditingPostSaga, updatePostSaga, actions } from './compose';
import { FactoryBot } from 'factory-bot-ts';
import { DraftPost, Post } from '../services/api/models';
import { put } from 'redux-saga/effects';
import { ApiErrors } from '../services';
import { push } from 'connected-react-router';
import { renderNavigationAction } from './navigation';

describe('compose sagas', () => {
    describe('createPostSaga', () => {
        it('marks the state as loading on start', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const effects: Generator = createPostSaga(actions.post(draft));
            expect(effects.next().value).toEqual(put(actions.setCreatePostResult({type: 'loading'})));
        });

        it('clears the draft state if the request succeeds', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const post = FactoryBot.build<Post>('post', draft);
            const effects: Generator = createPostSaga(actions.post(draft));
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: post}).value).toEqual(put(actions.clear()));
        });

        it('redirects to the post if the request succeeds', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const post = FactoryBot.build<Post>('post', draft);
            const effects: Generator = createPostSaga(actions.post(draft));
            effects.next();
            effects.next();
            effects.next({type: 'success', value: post});
            expect(effects.next().value).toEqual(put(push(renderNavigationAction({type: 'view-post', id: post.id, username: post.author.username}))));
        });

        it('does not clear the draft state if the request fails', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const post = FactoryBot.build<Post>('post', draft);
            const effects: Generator = createPostSaga(actions.post(draft));
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.noTokenError}).value).not.toEqual(put(actions.clear()));
        })
    });

    describe('updatePostSaga', () => {
        it('marks the state as loading on start', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const effects: Generator = updatePostSaga(actions.update({postId: 1, draft}));
            expect(effects.next().value).toEqual(put(actions.setUpdatePostResult({type: 'loading'})));
        });

        it('clears the draft state if the request succeeds', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const post = FactoryBot.build<Post>('post', draft);
            const effects: Generator = updatePostSaga(actions.update({postId: 1, draft}));
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: post}).value).toEqual(put(actions.clear()));
        });

        it('redirects to the post if the request succeeds', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const post = FactoryBot.build<Post>('post', draft);
            const effects: Generator = updatePostSaga(actions.update({postId: 1, draft}));
            effects.next();
            effects.next();
            effects.next({type: 'success', value: post});
            expect(effects.next().value).toEqual(put(push(renderNavigationAction({type: 'view-post', id: post.id, username: post.author.username}))));
        });

        it('does not clear the draft state if the request fails', () => {
            const draft = FactoryBot.build<DraftPost>('draftPost')
            const effects: Generator = updatePostSaga(actions.update({postId: 1, draft}));
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.noTokenError}).value).not.toEqual(put(actions.clear()));
        })
    });

    describe('startEditingPostSaga', () => {
        it('clears all the result fields', () => {
            const postId = 1;
            const effects: Generator = startEditingPostSaga(actions.startEditingPost(postId));
            expect(effects.next().value).toEqual(put(actions.setCreatePostResult(undefined)));
            expect(effects.next().value).toEqual(put(actions.setUpdatePostResult(undefined)));
            expect(effects.next().value).toEqual(put(actions.setExistingPostResult({type: 'loading'})));
        });

        it('it sets the draft properties if the load request succeeds', () => {
            const post = FactoryBot.build<Post>('post');
            const effects: Generator = startEditingPostSaga(actions.startEditingPost(post.id));
            effects.next();
            effects.next();
            effects.next();
            effects.next();
            expect(effects.next({type: 'success', value: post}).value).toEqual(put(actions.setTitle(post.title)));
            expect(effects.next().value).toEqual(put(actions.setBody(post.body)));
        });

        it('it does not set the draft properties if the load request fails', () => {
            const post = FactoryBot.build<Post>('post');
            const effects: Generator = startEditingPostSaga(actions.startEditingPost(post.id));
            effects.next();
            effects.next();
            effects.next();
            effects.next();
            expect(effects.next({type: 'failed', error: ApiErrors.connectionError}).value).not.toEqual(put(actions.setTitle(post.title)));
        });
    });
});