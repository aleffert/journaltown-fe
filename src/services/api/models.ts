import { Validates, isString, isObject } from '../../utils/';
import { isNumber } from 'util';

export const isCurrentUser = isObject({
    id: isNumber,
    username: isString,
    email: isString
});

export type CurrentUser = Validates<typeof isCurrentUser>;

export const isToken = isObject({
    token: isString
});
export type Token = Validates<typeof isToken>;

export const isDraftPost = isObject({
    title: isString,
    body: isString
});
export type DraftPost = Validates<typeof isDraftPost>;

export const isUser = isObject({
    id: isNumber,
    username: isString,
});

export type User = Validates<typeof isUser>;

export const isPost = isObject({
    title: isString,
    body: isString,
    last_modified: isString,
    created_at: isString,
    id: isNumber,
    author: isUser
});
export type Post = Validates<typeof isPost>;