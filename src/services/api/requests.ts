import { Result, isObject, isArray, Validator, } from '../../utils';
import { ApiError, ApiRequest, ApiErrors } from '../api-service';
import * as models from './models';

function parseError(type: string, error: any): ApiError {
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
            return ApiErrors.unknownError;
    }
}

async function noContentDeserializer(response: Response): Promise<Result<{}, ApiError>> {
    if(response.ok) {
        return {type: 'success', value: {}};
    }
    else if(response.status === 404) {
        return {type: 'failure', error: {type: 'not-found'}};
    }
    else {
        const json = await response.json();
        return {type: 'failure', error: parseError(json.type, json.errors)};
    }
}

function jsonDeserializer<T>(validator: Validator<T>): (response: Response) => Promise<Result<T, ApiError>> {
    return async function(response: Response) {
        if(response.ok) {
            const json = await response.json();
            if(validator(json)) {
                return {type: 'success', value: json};
            }
        }
        else if(response.status === 404) {
            return {type: 'failure', error: {type: 'not-found'}};
        }
        else {
            const json = await response.json();
            return {type: 'failure', error: parseError(json.type, json.errors)};
        }
        return {type: 'failure', error: {type: 'unknown'}};
    }
}

export type UserResponse = models.User;
export type UserError = ApiError;
export type UserResult = Result<UserResponse, UserError>;
export function userRequest(username: string): ApiRequest<UserResult> {
    return {
        path: `/users/${username}/`,
        method: 'GET',
        query: {expand: 'profile,followers,following'},
        deserializer: jsonDeserializer(models.isUser)
    };
}

export type FollowsResponse = models.RelatedUser[];
export type FollowsError = ApiError;
export type FollowsResult = Result<FollowsResponse, FollowsError>;
export type FollowsFilters = {
    username?: string
    username__in?: string[]
};
export function followsRequest(params: {followee: string, filters: FollowsFilters}): ApiRequest<FollowsResult> {
    return {
        path: `/users/${params.followee}/follows/`,
        method: 'GET',
        query: params.filters,
        deserializer: jsonDeserializer(isArray(models.isRelatedUser))
    }
}

export type AddUserFollowsResponse = models.RelatedUser[];
export type AddUserFollowsError = ApiError;
export type AddUserFollowsResult = Result<AddUserFollowsResponse, AddUserFollowsError>;
export function addUserFollowsRequest(params: {follower: string, followee: string}): ApiRequest<AddUserFollowsResult> {
    return {
        path: `/users/${params.follower}/follows/`,
        method: 'PUT',
        body:{username: params.followee},
        deserializer: jsonDeserializer(isArray(models.isRelatedUser))
    }
}

export type RemoveUserFollowsResponse = {};
export type RemoveUserFollowsError = ApiError;
export type RemoveUserFollowsResult = Result<RemoveUserFollowsResponse, RemoveUserFollowsError>;
export function removeUserFollowsRequest(params: {follower: string, followee: string}): ApiRequest<RemoveUserFollowsResult> {
    return {
        path: `/users/${params.follower}/follows/`,
        method: 'DELETE',
        body:{username: params.followee},
        deserializer: noContentDeserializer
    }
}

export type UpdateProfileResponse = models.UserProfile;
export type UpdateProfileError = ApiError;
export type UpdateProfileResult = Result<UpdateProfileResponse, UpdateProfileError>;
export function updateProfileRequest(params: {username: string, profile: models.UserProfile}): ApiRequest<UpdateProfileResult> {
    return {
        path: `/users/${params.username}/`,
        method: 'PUT',
        query: {expand: 'profile'},
        body: {profile: params.profile},
        deserializer: jsonDeserializer(models.isUserProfile)
    };
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
export type PostsFeedFilters = {
    username ?: string
};
export type PostsFilters = {
    last_modified__lt?: string,
    last_modified__gt?: string,
    created_at__lt?: string,
    created_at__gt?: string
} & PostsFeedFilters
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

export type CreateGroupResponse = models.FriendGroup;
export type CreateGroupError = ApiError;
export type CreateGroupResult = Result<CreateGroupResponse, CreateGroupError>;
export function createGroupRequest(params: {username: string, groupName: string}): ApiRequest<CreateGroupResult> {
    return {
        path: `/users/${params.username}/groups/`,
        method: 'POST',
        body: {name: params.groupName},
        deserializer: jsonDeserializer(models.isFriendGroup)
    };
}

export type SetGroupMembersResponse = models.RelatedUser[];
export type SetGroupMembersError = ApiError;
export type SetGroupMembersResult = Result<SetGroupMembersResponse, SetGroupMembersError>;
export function setGroupMembersRequest(params: {username: string, groupId: number, members: string[]}): ApiRequest<SetGroupMembersResult> {
    return {
        path: `/users/${params.username}/groups/${params.groupId}/members/`,
        method: 'PUT',
        body: {usernames: params.members},
        deserializer: jsonDeserializer(isArray(models.isRelatedUser))
    };
}