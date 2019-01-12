import { ValidatorOf, isString, isObject } from '../../utils/';

export const isCurrentUser = isObject({
    username: isString,
    email: isString
});

export type CurrentUser = ValidatorOf<typeof isCurrentUser>;

export const isToken = isObject({
    token: isString
});
export type Token = ValidatorOf<typeof isToken>;