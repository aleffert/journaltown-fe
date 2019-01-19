import { ValidatorOf, isString, isObject } from '../../utils/';
import { isNumber } from 'util';

export const isCurrentUser = isObject({
    username: isString,
    email: isString
});

export type CurrentUser = ValidatorOf<typeof isCurrentUser>;

export const isToken = isObject({
    token: isString
});
export type Token = ValidatorOf<typeof isToken>;

export const isDraftPost = isObject({
    title: isString,
    body: isString
});
export type DraftPost = ValidatorOf<typeof isDraftPost>;

export const isPost = isObject({
    title: isString,
    body: isString,
    last_modified: isString,
    created_at: isString,
    id: isNumber,
    author: isNumber
});
export type Post = ValidatorOf<typeof isPost>;