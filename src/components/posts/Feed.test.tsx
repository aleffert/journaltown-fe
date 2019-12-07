import React from 'react';
import { shuffle } from 'lodash';
import { shallow, render } from 'enzyme';
import { FactoryBot } from 'factory-bot-ts';
import * as faker from 'faker';
import { DateTime, Duration } from 'luxon';

import { Feed } from './Feed';
import { Post } from '../../services/api/models';
import { FeedPost } from './FeedPost';
import { FeedSummary } from 'semantic-ui-react';
import { makeSuccess } from '../../utils';

describe('Feed', () => {

    const baseProps = {
        filters: {},
        user: {
            currentUserResult: undefined
        },
        feed: {
            posts: {},
            feeds: {}
        },
        actions: {
            feed: {
                loadChangedPosts: () => {}
            }
        }
    }

    it('shows posts in chronological order—newest first', () => {
        const posts = FactoryBot.buildList<Post>('post', 5);
        const order = shuffle([1, 2, 3, 4, 5]);
        const base = faker.date.past();
        for(let i = 0; i < order.length; i++) {
            posts[i].title = `${order[i]}`;
            posts[i].created_at = DateTime.fromJSDate(base).minus(Duration.fromObject({days: order[i]})).toISO();
        }
        const props = Object.assign({}, baseProps, {feed: {posts: posts, feeds: {}}}) as any;
        const w = shallow(<Feed {...props}/>);
        expect(w.find(FeedPost).map(post => post.props().post.title)).toEqual(["1", "2", "3", "4", "5"]);
    });

    it('shows a load more button when there may be posts left to load', () => {
        const props = Object.assign({}, baseProps, {feed: {posts: {}, feeds: {}}}) as any;
        const w = render(<Feed {...props}/>);
        expect(w.find('#load-more-button').length).toBe(1);
    });

    it('does not show a load more button when there should not be posts left to load', () => {
        const feed = {
            posts: [],
            feeds: {
                '': {
                    nextPostsResult: makeSuccess([])
                }
            }
        };
        const props = Object.assign({}, baseProps, {feed}) as any;
        const w = render(<Feed {...props}/>);
        expect(w.find('#load-more-button').length).toBe(0);
    });
});