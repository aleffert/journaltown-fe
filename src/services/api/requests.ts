import { Result, isObject, Validator } from '../../utils';
import { ApiError, ApiRequest } from '../api-service';
import { isCurrentUser, CurrentUser, isToken, Token} from './models';

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

export type CurrentUserResponse = CurrentUser;
export type CurrentUserError = ApiError
export function currentUserRequest(): ApiRequest<Result<CurrentUserResponse, CurrentUserError>> {
    return {
        path: '/me/',
        method: 'GET',
        deserializer: objectDeserializer(isCurrentUser)
    }
}

export type LoginResponse = {};
export type LoginError = ApiError;
export function loginRequest({email}: {email: string}): ApiRequest<Result<LoginResponse, LoginError>> {
    return {
        path: '/auth/email/',
        method: 'POST',
        body: {email},
        deserializer: objectDeserializer(isObject({}))
    }
}

export type ExchangeTokenResponse = Token;
export type ExchangeTokenError = ApiError;
export function exchangeTokenRequest({token}: {token: string}): ApiRequest<Result<ExchangeTokenResponse, ExchangeTokenError>> {
    return {
        path: '/callback/auth/',
        method: 'POST',
        body: {token},
        deserializer: objectDeserializer(isToken)
    }
}
