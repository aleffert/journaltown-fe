import { Optional } from './optional';

type DefaultError = string;

export type Result<V, E = DefaultError> =
    {type: 'success', value: V} |
    {type: 'failure', error: E};

export type Async<T> = Optional<{type: 'loading'} | T>

export type AsyncResult<V, E = DefaultError> = Async<Result<V, E>>

export function resultIsLoading<V, E>(result: AsyncResult<V, E>): boolean | undefined {
    return result && result.type == 'loading' || undefined;
}