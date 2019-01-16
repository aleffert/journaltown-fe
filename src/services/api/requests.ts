import { Result, isObject, Validator } from '../../utils';
import { ApiError, ApiRequest } from '../api-service';
import * as models from './models';

function objectDeserializer<T extends object, E>(validator: Validator<T>): (response: Response) => Promise<Result<T, ApiError<E>>> {
    return async function(response: Response) {
        if(response.ok) {
            const json = await response.json();
            if(validator(json)) {
                return {type: 'success', value: json};
            }
        }
        return {type: 'failure', error: {type: 'connection'}};
    }
}

export type CurrentUserResponse = models.CurrentUser;
export type CurrentUserError = ApiError
export function currentUserRequest(): ApiRequest<Result<CurrentUserResponse, CurrentUserError>> {
    return {
        path: '/me/',
        method: 'GET',
        deserializer: objectDeserializer(models.isCurrentUser)
    }
}

export type LoginResponse = {};
export type LoginError = ApiError;
export function loginRequest(body: {email: string}): ApiRequest<Result<LoginResponse, LoginError>> {
    return {
        path: '/auth/email/',
        method: 'POST',
        body,
        deserializer: objectDeserializer(isObject({}))
    }
}

export type ExchangeTokenResponse = models.Token;
export type ExchangeTokenError = ApiError;
export function exchangeTokenRequest(body: {token: string}): ApiRequest<Result<ExchangeTokenResponse, ExchangeTokenError>> {
    return {
        path: '/callback/auth/',
        method: 'POST',
        body,
        deserializer: objectDeserializer(models.isToken)
    }
}

export type CreatePostResponse = models.Post;
export type CreatePostError = ApiError;

export function createPostRequest(body: {title: string, body: string}): ApiRequest<Result<CreatePostResponse, CreatePostError>> {
    return {
        path: '/posts/',
        method: 'POST',
        body,
        deserializer: objectDeserializer(models.isPost)
    }
}