import React from 'react';
import { mount } from 'enzyme';
import { _PostPage } from './PostPage';
import { FeedPost } from './FeedPost';
import { FactoryBot } from 'factory-bot-ts';
import { Post, CurrentUser } from '../../services/api/models';
import { MemoryRouter } from 'react-router';
import { makeSuccess } from '../../utils';

describe('PostPage', () => {

    it('should show a post once the post is loaded', () => {
        const post = FactoryBot.build<Post>('post');
        const user = FactoryBot.build<CurrentUser>('currentUser');
        const props = {
            match: {
                params: {postId: '123'}
            },
            post: {
                posts: {123: makeSuccess(post)}
            },
            user: {
                currentUserResult: makeSuccess(user)
            },
            actions: {
                post: {loadPost: () => {}}
            }
        } as any;
        const w = mount(<MemoryRouter><_PostPage {...props}/></MemoryRouter>)
        expect(w.find(FeedPost).exists()).toBe(true);
    });

});