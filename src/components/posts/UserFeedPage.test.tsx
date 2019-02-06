import React from 'react';
import { shallow } from "enzyme";
import { _UserFeedPage } from "./UserFeedPage";
import { Feed } from './Feed';

describe('UserFeedPage', () => {
    it('passes the right username down to the feed', () => {
        const props = {
            match: {params: {username: 'someuser'}}
        };
        const w = shallow(<_UserFeedPage {...props as any}/>);
        expect(w.find(Feed).props().filters.username).toEqual('someuser');
    })
});