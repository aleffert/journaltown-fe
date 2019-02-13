import * as faker from 'faker';
import { FactoryBot } from 'factory-bot-ts';
import { Post, CurrentUser, User, DraftPost, UserProfile, RelatedUser } from '../services/api/models';
import { DateTime } from 'luxon';

FactoryBot.define<CurrentUser>('currentUser', {
    id: FactoryBot.seq(s => s) as any,
    username: (() => FactoryBot.seq(s => `${faker.name.firstName()}_${s}`)) as any,
    email: faker.internet.exampleEmail as any,
    profile: (() => FactoryBot.build<UserProfile>('userProfile')) as any
});

FactoryBot.define<RelatedUser>('relatedUser', {
    username: (() => FactoryBot.seq(s => `${faker.name.firstName()}_${s}`)) as any,
});

FactoryBot.define<User>('user', {
    username: (() => FactoryBot.seq(s => `${faker.name.firstName()}_${s}`)) as any,
    id: (() => FactoryBot.seq(s => s)) as any,
    profile: (() => FactoryBot.build<UserProfile>('userProfile')) as any
});

FactoryBot.define<UserProfile>('userProfile', {
    bio: 'Some stuff about me'
});

FactoryBot.define<DraftPost>('draftPost', {
    title: 'My Amazing Post',
    body: 'This is a post about stuff...'
});

FactoryBot.define<Post>('post', {
    title: 'My Amazing Post',
    body: 'This is a post about stuff...',
    created_at: (() => DateTime.fromJSDate(faker.date.recent(2)).toISO()) as any,
    last_modified: (() => DateTime.fromJSDate(faker.date.recent(1)).toISO()) as any,
    author: (() => FactoryBot.build('user')) as any,
    id: (() => FactoryBot.seq(s => s)) as any
});