import React from 'react';
import { PostActions } from './PostActions';
import { shallow } from 'enzyme';
import { FactoryBot } from 'factory-bot-ts';
import { Post } from '../../services/api/models';
import strings from '../../strings';

describe('PostActions', () => {
    const post = FactoryBot.build<Post>('post');

    it('shows a link button when canEdit', () => {
        const w = shallow(<PostActions post={post} canEdit={true}/>);
        expect(w.html()).toContain(strings.post.actions.link['en']);
    });

    it('does not show an edit button when not canEdit', () => {
        const w = shallow(<PostActions post={post} canEdit={false}/>);
        expect(w.html()).not.toContain(strings.post.actions.edit['en']);
    });

    it('shows an edit button when canEdit', () => {
        const w = shallow(<PostActions post={post} canEdit={true}/>);
        expect(w.html()).toContain(strings.post.actions.edit['en']);
    });
});