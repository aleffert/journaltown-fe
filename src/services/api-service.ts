import * as qs from 'query-string';
import { Result } from '../utils/';

declare global {
    interface EnvironmentVariables {
        REACT_APP_API_BASE: string
    }
}

type ConnectionError = {'type': 'connection-error'};
const ApiErrors = {
    connectionError: {'type': 'connection-error'} as ConnectionError
}

type ApiError<T> = ConnectionError | T;

type ApiArgs = {[K: string]: string}

export type ApiRequest<Result> = {
    path: string,
    method: 'GET' | 'POST',
    query?: ApiArgs,
    body?: object,
    deserializer(response: Response): Result
}

export class ApiService {

    private base: string

    constructor(base: string = process.env.REACT_APP_API_BASE) {
        this.base = base;
    }

    async request<Result>(request: ApiRequest<Result>): Promise<Result> {
        const query = request.query ? qs.stringify(request.query) : '';
        const url = new URL(`${request.path}?${query}`, this.base);
        const result = await fetch(url.href, {
            method: request.method,
            body: request.body ? JSON.stringify(request.body) : undefined,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return request.deserializer(result);
    }
}

export type LoginError = ApiError<{}>;
export type LoginResponse = {};
export function loginRequest({email}: {email: string}): ApiRequest<Result<LoginResponse, LoginError>> {
    return {
        path: '/auth/email/',
        method: 'POST',
        query: {},
        body: {email},
        deserializer(response: Response) {
            if(response.ok) {
                return {type: 'success', value: {}};
            }
            return {type: 'failure', error: {type: 'connection-failure'}};
        }
    }
}

