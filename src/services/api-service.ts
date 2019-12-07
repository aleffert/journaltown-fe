import * as qs from 'query-string';
import { StorageService } from './storage-service';
import { Optional, commafy, makeFailure } from '../utils';
import { pickBy } from 'lodash';
import { ConnectionError, AppErrors } from '../utils/errors';

declare global {
    interface EnvironmentVariables {
        REACT_APP_API_BASE: string
    }
}


export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export type ApiRequest<Result> = {
    path: string,
    method: Method,
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
            return makeFailure(AppErrors.connectionError);
        }
    }
}
