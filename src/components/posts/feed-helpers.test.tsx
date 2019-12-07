import { FactoryBot } from 'factory-bot-ts';
import * as faker from 'faker';
import { DateTime, Duration } from 'luxon';
import { shuffle } from 'lodash';

import { sortPosts, newestModifiedDate, oldestCreatedDate, shouldShowLoadMore, canEditPost } from './feed-helpers';
import { Post, CurrentUser } from '../../services/api/models';
import { isSorted, makeSuccess, makeFailure } from '../../utils';
import { AppErrors } from '../../utils/errors';

describe('feed-helpers', () => {
    describe('shouldShowLoadMore', () => {
        it('it should be hidden when there are no more posts to load', () => {
            expect(shouldShowLoadMore(makeSuccess([]))).toEqual(false);
        });
        it('it should be visible when there are more posts to load', () => {
            expect(shouldShowLoadMore(makeFailure(AppErrors.unknownError))).toEqual(true);
            expect(shouldShowLoadMore(undefined)).toEqual(true);
            expect(shouldShowLoadMore({type: 'loading'})).toEqual(true);
        });
    });

    describe('newestModifiedDate', () => {
        it('should return undefined when there are no posts', () => {
            expect(newestModifiedDate([])).toBeUndefined();
        })
        it('should return the newest modification date', () => {
            const posts = FactoryBot.buildList<Post>('post', 5);
            const order = shuffle([1, 2, 3, 4, 5]);
            const base = faker.date.past();
            for(let i = 0; i < order.length; i++) {
                posts[i].title = `${order[i]}`;
                posts[i].last_modified = DateTime.fromJSDate(base).minus(Duration.fromObject({days: order[i]})).toISO();
            }
            const result = newestModifiedDate(posts);
            expect(result).toEqual((posts.find(post => post.title === "5") as any).last_modified)
        });
    });

    describe('oldestCreationDate', () => {
        it('should return undefined when there are no posts', () => {
            expect(oldestCreatedDate([])).toBeUndefined();
        })
        it('should return the oldest creation date', () => {
            const posts = FactoryBot.buildList<Post>('post', 5);
            const order = shuffle([1, 2, 3, 4, 5]);
            const base = faker.date.past();
            for(let i = 0; i < order.length; i++) {
                posts[i].title = `${order[i]}`;
                posts[i].created_at = DateTime.fromJSDate(base).minus(Duration.fromObject({days: order[i]})).toISO();
            }
            const result = oldestCreatedDate(posts);
            expect(result).toEqual((posts.find(post => post.title === "1") as any).created_at)
        });
    });

    describe('sortPosts', () => {
        it('should sort posts by creation date with the newest first', () => {
            const posts = FactoryBot.buildList<Post>('post', 5);
            const order = shuffle([1, 2, 3, 4, 5]);
            const base = faker.date.past();
            for(let i = 0; i < order.length; i++) {
                posts[i].title = `${order[i]}`;
                posts[i].created_at = DateTime.fromJSDate(base).minus(Duration.fromObject({days: order[i]})).toISO();
            }
            const result = sortPosts(posts);
            expect(isSorted(result.map(p => p.created_at).reverse())).toBe(true);
        });
    });

    describe('canEditPosts', () => {
        it('should return true if the post author is the user', () => {
            const post = FactoryBot.build<Post>('post');
            const currentUser = FactoryBot.build<CurrentUser>('currentUser', post.author);
            expect(canEditPost(post, makeSuccess(currentUser))).toBe(true);
        });

        it('should return false if the post author is not the user', () => {
            const post = FactoryBot.build<Post>('post');
            const currentUser = FactoryBot.build<CurrentUser>('currentUser');
            expect(canEditPost(post, makeSuccess(currentUser))).toBe(false);
        });

        it('should return false if there is no user', () => {
            const post = FactoryBot.build<Post>('post');
            expect(canEditPost(post, undefined)).toBe(false);
        });
    });
})