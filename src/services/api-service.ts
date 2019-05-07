import * as qs from 'query-string';
import { StorageService } from './storage-service';
import { Optional, commafy } from '../utils';
import { pickBy } from 'lodash';

declare global {
    interface EnvironmentVariables {
        REACT_APP_API_BASE: string
    }
}

export type ConnectionError = {type: 'connection'};
export type NoTokenError = {type: 'no-token'};
export type NotFoundError = {type: 'not-found'};
export type InvalidFieldsError = {type: 'invalid-fields', errors: {name: string, message: string}[]};
export type MissingFieldsError = {type: 'missing-fields', errors: {name: string, message: string}[]};
export type NameInUseError = {type: 'name-in-use', errors: {name: string, message: string}[]};
export type EmailInUseError = {type: 'email-in-use', message: string};
export type UnknownError = {type: 'unknown'};
export const ApiErrors = {
    connectionError: {type: 'connection'} as ConnectionError,
    noTokenError: {type: 'no-token'} as NoTokenError,
    notFoundError: {type: 'not-found'} as NotFoundError,
    unknownError: {type: 'unknown'} as UnknownError,
}

export type ApiError =
    | ConnectionError
    | NoTokenError
    | NotFoundError
    | InvalidFieldsError
    | MissingFieldsError
    | NameInUseError
    | EmailInUseError
    | UnknownError

export type ApiRequest<Result> = {
    path: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    query?: {[K: string]: Optional<string | string[]>},
    body?: object,
    deserializer(response: Response): Promise<Result>
}

export class ApiService {

    private base: string
    private storage: StorageService;

    constructor(storageService: StorageService, base: string = process.env.REACT_APP_API_BASE || "") {
        this.base = base;
        this.storage = storageService;
    }

    async request<Result>(request: ApiRequest<Result>): Promise<Result | { type: 'failure', error: ConnectionError}> {
        const query = request.query ? qs.stringify(commafy(pickBy(request.query))) : '';
        const url = new URL(`${request.path}?${query}`, this.base);
        const headers: {[K: string]: string} = {
            'Content-Type': 'application/json'
        };

        const token = this.storage.getToken();
        if(token) {
            headers['Authorization'] = `Token ${token}`;
        }
        try {
            const body= request.body ? JSON.stringify(request.body) : undefined;
            const result = await fetch(url.href, {
                method: request.method,
                body,
                headers
            });

            return request.deserializer(result);
        }
        catch {
            return {type: 'failure', error: ApiErrors.connectionError};
        }
    }
}
