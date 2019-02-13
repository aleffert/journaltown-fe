import React from 'react';
import { render, mount } from 'enzyme';
import { IsFollowingUserView } from './IsFollowingUserView';
import strings from '../../strings';

describe('IsFollowingUserView', () => {
    it('tells the user they are followed if they are', () => {
        const w = mount(<IsFollowingUserView following={true} username="abc123"/>);
        expect(w.text()).toContain(strings.user.follows.followsYou['en']);
    });

    it('tells the user they are followed if they are', () => {
        const w = mount(<IsFollowingUserView following={false} username="abc123"/>);
        expect(w.text()).toContain(strings.user.follows.doesNotFollowYou['en']);
    });

});