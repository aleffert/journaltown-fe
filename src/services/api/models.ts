import { ValidatorOf, isString, isObject } from '../../utils/';
import { number, string } from 'prop-types';
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

export const isPost = isObject({
    id: isNumber,
    title: isString,
    body: isString
});
export type Post = ValidatorOf<typeof isPost>;