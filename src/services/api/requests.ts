import { Result, isObject, isArray, Validator, } from '../../utils';
import { ApiError, ApiRequest } from '../api-service';
import * as models from './models';

function jsonDeserializer<T, E>(validator: Validator<T>): (response: Response) => Promise<Result<T, ApiError<E>>> {
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
export type CurrentUserResult = Result<CurrentUserResponse, CurrentUserError>;
export function currentUserRequest(): ApiRequest<CurrentUserResult> {
    return {
        path: '/me/',
        method: 'GET',
        deserializer: jsonDeserializer(models.isCurrentUser)
    }
}

export type LoginResponse = {};
export type LoginError = ApiError;
export type LoginResult = Result<LoginResponse, LoginError>;
export function loginRequest(body: {email: string}): ApiRequest<LoginResult> {
    return {
        path: '/auth/email/',
        method: 'POST',
        body,
        deserializer: jsonDeserializer(isObject({}))
    }
}

export type ExchangeTokenResponse = models.Token;
export type ExchangeTokenError = ApiError;
export type ExchangeResult = Result<ExchangeTokenResponse, ExchangeTokenError>;
export function exchangeTokenRequest(body: {token: string}): ApiRequest<ExchangeResult> {
    return {
        path: '/callback/auth/',
        method: 'POST',
        body,
        deserializer: jsonDeserializer(models.isToken)
    }
}

export type CreatePostResponse = models.Post;
export type CreatePostError = ApiError;
export type CreatePostResult = Result<CreatePostResponse, CreatePostError>;
export function createPostRequest(body: models.DraftPost): ApiRequest<CreatePostResult> {
    return {
        path: '/posts/',
        method: 'POST',
        body,
        deserializer: jsonDeserializer(models.isPost)
    }
}

export type PostsResponse = models.Post[];
export type PostsError = ApiError;
export type PostsResult = Result<PostsResponse, PostsError>;
export type PostsFilters = {
    modification_date__lt?: string,
    modification_date__gt?: string,
    created_at__lt?: string,
    created_at__gt?: string
}
export function postsRequest(filters: PostsFilters): ApiRequest<PostsResult> {
    return {
        path: '/posts/',
        method: 'GET',
        query: filters,
        deserializer: jsonDeserializer(isArray(models.isPost))
    }
}