import React from 'react';
import { FeedPost } from './FeedPost';
import { FactoryBot } from 'factory-bot-ts';
import { Post, CurrentUser } from '../../services/api/models';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { Modal } from 'semantic-ui-react';
import { makeSuccess } from '../../utils';

describe('FeedPost', () => {
    const post = FactoryBot.build<Post>('post');
    it('does not show a modal by default', () => {
        const w = mount(
            <MemoryRouter>
                <FeedPost post={post} currentUser={undefined} onDelete={() => {}}/>
            </MemoryRouter>
        );
        expect(w.find(Modal).props().open).toBe(false);
    });

    it('shows a modal when delete is chosen', () => {
        const user = FactoryBot.build<CurrentUser>('currentUser', post.author);
        const w = mount(
            <MemoryRouter>
                <FeedPost post={post} currentUser={makeSuccess(user)} onDelete={() => {}}/>
            </MemoryRouter>
        );
        w.find('#action-delete').hostNodes().simulate('click');
        expect(w.find(Modal).props().open).toBe(true);
    });
});