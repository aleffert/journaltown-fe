import * as qs from 'query-string';
import { StorageService } from './storage-service';

declare global {
    interface EnvironmentVariables {
        REACT_APP_API_BASE: string
    }
}

export type ConnectionError = {'type': 'connection'};
export type NoTokenError = {'type': 'no-token'};
const ApiErrors = {
    connectionError: {'type': 'connection'} as ConnectionError,
    noTokenError: {'type': 'no-token'} as NoTokenError
}

export type ApiError<T = {}> = ConnectionError | T;

export type ApiRequest<Result> = {
    path: string,
    method: 'GET' | 'POST',
    query?: {[K: string]: string},
    body?: object,
    deserializer(response: Response): Promise<Result>
}

export class ApiService {

    private base: string
    private storage: StorageService;

    constructor(storageService: StorageService, base: string = process.env.REACT_APP_API_BASE) {
        this.base = base;
        this.storage = storageService;
    }

    async request<Result>(request: ApiRequest<Result>): Promise<Result | { type: 'failure', error: ConnectionError}> {
        debugger;
        const query = request.query ? qs.stringify(request.query) : '';
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
                credentials: 'include',
                body,
                headers
            });

            return request.deserializer(result);
        }
        catch {
            return {type: 'failure', error: {type: 'connection'}};
        }
    }
}
