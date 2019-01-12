import { Optional } from '../utils/optional';

const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

export class StorageService {

    setToken(token: string) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    getToken(): Optional<string> {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
}