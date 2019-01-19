import * as faker from 'faker';
import { FactoryBot } from 'factory-bot-ts';
import { Post, CurrentUser } from '../services/api/models';
import { DateTime } from 'luxon';

FactoryBot.define<CurrentUser>('currentUser', {
    id: (() => FactoryBot.seq(s => s)) as any,
    username: faker.name.firstName as any,
    email: faker.internet.exampleEmail as any,
})

FactoryBot.define<Post>('post', {
    title: 'My Amazing Post',
    body: 'This is a post about stuff...',
    created_at: DateTime.fromJSDate(faker.date.recent(2)).toISO(),
    last_modified: DateTime.fromJSDate(faker.date.recent(1)).toISO(),
    author: 1,
    id: (() => FactoryBot.seq(s => s)) as any
});