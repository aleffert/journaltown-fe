import { Result, isObject, isArray, Validator, Async, makeSuccess, makeFailure, } from '../../utils';
import { Method } from '../api-service';
import * as models from './models';
import { AppErrors, AppError } from '../../utils/errors';

export type ApiResult<V, E = AppError> = Result<V, E>
export type ApiAsync<V> = Async<ApiResult<V>>

type RequestResponseType<T extends (...args: any) => any> = 
    ReturnType<T> extends {deserializer: (...args: any) => infer T1} ? 
    T1 extends Promise<infer T2> ?
    T2 extends Result<infer T3> ?
    T3
    : never : never : never;

function parseError(type: string, error: any): AppError {
    switch(type) {
        case 'invalid-fields':
            return {type: 'invalid-fields', errors: error};
        case 'missing-fields':
            return {type: 'invalid-fields', errors: error};
        case 'email-in-use':
            return {type: 'email-in-use', message: error};
        case 'name-in-use':
            return {type: 'name-in-use', errors: error};
        default:
            return AppErrors.unknownError;
    }
}

async function noContentDeserializer(response: Response): Promise<Result<{}, AppError>> {
    if(response.ok) {
        return makeSuccess({})
    }
    else if(response.status === 404) {
        return makeFailure(AppErrors.notFoundError)
    }
    else {
        const json = await response.json();
        return makeFailure(parseError(json.type, json.errors));
    }
}

function jsonDeserializer<T>(validator: Validator<T>): (response: Response) => Promise<Result<T, AppError>> {
    return async function(response: Response) {
        if(response.ok) {
            const json = await response.json();
            if(validator(json)) {
                return makeSuccess(json);
            }
        }
        else if(response.status === 404) {
            return makeFailure(AppErrors.notFoundError);
        }
        else {
            const json = await response.json();
            return makeFailure(parseError(json.type, json.errors));
        }
        return makeFailure(AppErrors.unknownError);
    }
}


export function userRequest(username: string) {
    return {
        path: `/users/${username}/`,
        method: Method.GET,
        query: {expand: 'profile,followers,following'},
        deserializer: jsonDeserializer(models.isUser)
    };
}
export type UserResponse = RequestResponseType<typeof userRequest>;

export type FollowsFilters = {
    username?: string
    username__in?: string[]
};
export function followsRequest(params: {followee: string, filters: FollowsFilters}) {
    debugger;
    return {
        path: `/users/${params.followee}/follows/`,
        method: Method.GET,
        query: params.filters,
        deserializer: jsonDeserializer(isArray(models.isRelatedUser))
    }
}
export type FollowsResponse = RequestResponseType<typeof followsRequest>;

export function addUserFollowsRequest(params: {follower: string, followee: string}) {
    return {
        path: `/users/${params.follower}/follows/`,
        method: Method.PUT,
        body:{username: params.followee},
        deserializer: jsonDeserializer(isArray(models.isRelatedUser))
    }
}
export type AddUserFollowsResponse = RequestResponseType<typeof addUserFollowsRequest>;

export function removeUserFollowsRequest(params: {follower: string, followee: string}) {
    return {
        path: `/users/${params.follower}/follows/`,
        method: Method.DELETE,
        body:{username: params.followee},
        deserializer: noContentDeserializer
    }
}
export type RemoveUserFollowsResponse = RequestResponseType<typeof removeUserFollowsRequest>;

export function updateProfileRequest(params: {username: string, profile: models.UserProfile}) {
    return {
        path: `/users/${params.username}/`,
        method: Method.PUT,
        query: {expand: 'profile'},
        body: {profile: params.profile},
        deserializer: jsonDeserializer(models.isUserProfile)
    };
}
export type UpdateProfileResponse = RequestResponseType<typeof updateProfileRequest>;

export function currentUserRequest() {
    return {
        path: '/me/',
        method: Method.GET,
        deserializer: jsonDeserializer(models.isCurrentUser)
    };
}
export type CurrentUserResponse = RequestResponseType<typeof currentUserRequest>;

export function loginRequest(body: {email: string}) {
    return {
        path: '/auth/email/',
        method: Method.POST,
        body,
        deserializer: jsonDeserializer(isObject({}))
    };
}
export type LoginResponse = RequestResponseType<typeof loginRequest>;

export function registerRequest(body: {email: string}) {
    return {
        path: '/register/email/',
        method: Method.POST,
        body,
        deserializer: noContentDeserializer
    };
}
export type RegisterResponse = RequestResponseType<typeof registerRequest>;

export function createAccountRequest(body: {username: string, token: string}) {
    return {
        path: '/callback/register/',
        method: Method.POST,
        body,
        deserializer: jsonDeserializer(models.isToken)
    };
}
export type CreateAccountResponse = RequestResponseType<typeof createAccountRequest>;

export function usernameAvailableRequest(username: string) {
    return {
        path: `/users/${username}/available`,
        method: Method.GET,
        deserializer: noContentDeserializer
    };
}
export type UsernameAvailableResponse = RequestResponseType<typeof usernameAvailableRequest>;

export function exchangeTokenRequest(body: {token: string}) {
    return {
        path: '/callback/auth/',
        method: Method.POST,
        body,
        deserializer: jsonDeserializer(models.isToken)
    };
}
export type ExchangeTokenResponse = RequestResponseType<typeof exchangeTokenRequest>;

export function createPostRequest(draft: models.DraftPost) {
    return {
        path: '/posts/',
        method: Method.POST,
        body: draft,
        deserializer: jsonDeserializer(models.isPost)
    };
}
export type CreatePostResponse = RequestResponseType<typeof createPostRequest>;

export function updatePostRequest(postId: number, draft: models.DraftPost) {
    return {
        path: `/posts/${postId}/`,
        method: Method.PUT,
        body: draft,
        deserializer: jsonDeserializer(models.isPost)
    };
}
export type UpdatePostResponse = RequestResponseType<typeof updatePostRequest>;

export function deletePostRequest(postId: number) {
    return {
        path: `/posts/${postId}/`,
        method: Method.DELETE,
        deserializer: noContentDeserializer
    };
}
export type DeletePostResponse = RequestResponseType<typeof deletePostRequest>;

export type PostsFeedFilters = {
    username ?: string
};
export type PostsFilters = {
    last_modified__lt?: string,
    last_modified__gt?: string,
    created_at__lt?: string,
    created_at__gt?: string
} & PostsFeedFilters
export function postsRequest(filters: PostsFilters) {
    return {
        path: '/posts/',
        method: Method.GET,
        query: filters,
        deserializer: jsonDeserializer(isArray(models.isPost))
    };
}
export type PostsResponse = RequestResponseType<typeof postsRequest>;

export function postRequest(id: number) {
    return {
        path: `/posts/${id}/`,
        method: Method.GET,
        deserializer: jsonDeserializer(models.isPost)
    };
}
export type PostResponse = RequestResponseType<typeof postRequest>;

export function createGroupRequest(params: {username: string, groupName: string, members: string[]}) {
    return {
        path: `/users/${params.username}/groups/`,
        method: Method.POST,
        body: {name: params.groupName},
        deserializer: jsonDeserializer(models.isFriendGroup)
    };
}
export type CreateGroupResponse = RequestResponseType<typeof createGroupRequest>;

export function groupRequest(params: {username: string, groupId: number}) {
    return {
        path: `/users/${params.username}/groups/${params.groupId}/`,
        method: Method.GET,
        deserializer: jsonDeserializer(models.isFriendGroup)
    };
}
export type GroupResponse = RequestResponseType<typeof groupRequest>;

export function updateGroupRequest(params: {username: string, groupId: number, groupName: string, members: string[]}) {
    return {
        path: `/users/${params.username}/groups/${params.groupId}/`,
        method: Method.PUT,
        body: {
            name: params.groupName,
            members: params.members
        },
        deserializer: jsonDeserializer(models.isFriendGroup)
    };
}
export type UpdateGroupResponse = RequestResponseType<typeof groupRequest>;