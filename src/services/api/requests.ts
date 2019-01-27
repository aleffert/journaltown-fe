import { Result, isObject, isArray, Validator, } from '../../utils';
import { ApiError, ApiRequest, NoTokenError, ApiErrors } from '../api-service';
import * as models from './models';
import { ApiErrorView } from '../../components/widgets/ErrorView';

function parseError(type: string, error: any): ApiError {
    switch(type) {
        case 'invalid-fields':
            return {type: 'invalid-fields', errors: error};
        case 'missing-fields':
            return {type: 'invalid-fields', errors: error};
        case 'email-in-use':
            return {type: 'email-in-use', message: error};
        default:
            return ApiErrors.unknownError;
    }
}

async function noContentDeserializer(response: Response): Promise<Result<{}, ApiError>> {
    if(response.ok) {
        return {type: 'success', value: {}};
    }
    else if(response.status == 404) {
        return {type: 'failure', error: {type: 'not-found'}};
    }
    else if (response.status == 400) {
        const json = await response.json();
        return {type: 'failure', error: parseError(json.type, json.errors)};
    }
    return {type: 'failure', error: {type: 'connection'}};
}

function jsonDeserializer<T>(validator: Validator<T>): (response: Response) => Promise<Result<T, ApiError>> {
    return async function(response: Response) {
        if(response.ok) {
            const json = await response.json();
            if(validator(json)) {
                return {type: 'success', value: json};
            }
        }
        else if(response.status == 404) {
            return {type: 'failure', error: {type: 'not-found'}};
        }
        return {type: 'failure', error: {type: 'connection'}};
    }
}

export type CurrentUserResponse = models.CurrentUser;
export type CurrentUserError = ApiError;
export type CurrentUserResult = Result<CurrentUserResponse, CurrentUserError>;
export function currentUserRequest(): ApiRequest<CurrentUserResult> {
    return {
        path: '/me/',
        method: 'GET',
        deserializer: jsonDeserializer(models.isCurrentUser)
    };
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
    };
}

export type RegisterResponse = {};
export type RegisterError = ApiError;
export type RegisterResult = Result<RegisterResponse, LoginError>;
export function registerRequest(body: {email: string}): ApiRequest<RegisterResult> {
    return {
        path: '/register/email/',
        method: 'POST',
        body,
        deserializer: noContentDeserializer
    };
}

export type CreateAccountResponse = {token: string};
export type CreateAccountError = ApiError;
export type CreateAccountResult = Result<CreateAccountResponse, CreateAccountError>;
export function createAccountRequest(body: {username: string, token: string}): ApiRequest<CreateAccountResult> {
    return {
        path: '/callback/register/',
        method: 'POST',
        body,
        deserializer: jsonDeserializer(models.isToken)
    };
}

export type UsernameAvailableResponse = {};
export type UsernameAvailableError = ApiError;
export type UsernameAvailableResult = Result<UsernameAvailableResponse, UsernameAvailableError>;
export function usernameAvailableRequest(username: string): ApiRequest<UsernameAvailableResult> {
    return {
        path: `/users/${username}/available`,
        method: 'GET',
        deserializer: noContentDeserializer
    };
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
    };
}

export type CreatePostResponse = models.Post;
export type CreatePostError = ApiError;
export type CreatePostResult = Result<CreatePostResponse, CreatePostError>;
export function createPostRequest(draft: models.DraftPost): ApiRequest<CreatePostResult> {
    return {
        path: '/posts/',
        method: 'POST',
        body: draft,
        deserializer: jsonDeserializer(models.isPost)
    };
}

export type UpdatePostResponse = models.Post;
export type UpdatePostError = ApiError;
export type UpdatePostResult = Result<CreatePostResponse, CreatePostError>;
export function updatePostRequest(postId: number, draft: models.DraftPost): ApiRequest<CreatePostResult> {
    return {
        path: `/posts/${postId}/`,
        method: 'PUT',
        body: draft,
        deserializer: jsonDeserializer(models.isPost)
    };
}

export type DeletePostResponse = {};
export type DeletePostError = ApiError;
export type DeletePostResult = Result<DeletePostResponse, DeletePostError>;
export function deletePostRequest(postId: number): ApiRequest<DeletePostResult> {
    return {
        path: `/posts/${postId}/`,
        method: 'DELETE',
        deserializer: noContentDeserializer
    };
}

export type PostsResponse = models.Post[];
export type PostsError = ApiError;
export type PostsResult = Result<PostsResponse, PostsError>;
export type PostsFilters = {
    last_modified__lt?: string,
    last_modified__gt?: string,
    created_at__lt?: string,
    created_at__gt?: string
}
export function postsRequest(filters: PostsFilters): ApiRequest<PostsResult> {
    return {
        path: '/posts/',
        method: 'GET',
        query: filters,
        deserializer: jsonDeserializer(isArray(models.isPost))
    };
}

export type PostResponse = models.Post;
export type PostError = ApiError;
export type PostResult = Result<PostResponse, PostError>;
export function postRequest(id: number): ApiRequest<PostResult> {
    return {
        path: `/posts/${id}/`,
        method: 'GET',
        deserializer: jsonDeserializer(models.isPost)
    };

}