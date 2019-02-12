import { Validates, isString, isObject, isOptional, isArray } from '../../utils/';
import { isNumber } from 'util';

export const isUserProfile = isObject({
    bio: isOptional(isString)
});

export type UserProfile = Validates<typeof isUserProfile>;

export const isCurrentUser = isObject({
    id: isNumber,
    username: isString,
    email: isString,
    profile: isUserProfile
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

export const isRelatedUser = isObject({
    username: isString
});
export type RelatedUser = Validates<typeof isRelatedUser>;

export const isUser = isObject({
    id: isNumber,
    username: isString,
    profile: isOptional(isUserProfile),
    followers: isOptional(isArray(isRelatedUser)),
    following: isOptional(isArray(isRelatedUser))
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