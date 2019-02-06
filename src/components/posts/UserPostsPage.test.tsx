import React from 'react';
import { shallow } from "enzyme";
import { Feed } from './Feed';
import { _UserPostsPage } from './UserPostsPage';

describe('UserPostsPage', () => {
    it('passes the right username down to the feed', () => {
        const props = {
            match: {params: {username: 'someuser'}}
        };
        const w = shallow(<_UserPostsPage {...props as any}/>);
        expect(w.find(Feed).props().filters.username).toEqual('someuser');
    })
});