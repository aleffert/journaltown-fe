import { Optional } from './optional';

type DefaultError = string;

type SuccessResult<V> = {type: 'success', value: V};
type FailureResult<E> = {type: 'failure', error: E};

export type Result<V, E = DefaultError> = SuccessResult<V> | FailureResult<E>;

type LoadingResult = {type: 'loading'};
export type Async<T> = Optional<LoadingResult | T>

export type AsyncResult<V, E = DefaultError> = Async<Result<V, E>>

export function resultIsLoading<V, E>(result: AsyncResult<V, E>): boolean {
    return result && result.type == 'loading' || false;
}

export function resultIsFailure<V, E>(result: AsyncResult<V, E>): boolean {
    return result && result.type == 'failure' || false;
}

export function resultIsSuccess<V, E>(result: AsyncResult<V, E>): boolean {
    return result && result.type == 'success' || false;
}

export function isLoading<V, E>(result: AsyncResult<V, E>): result is LoadingResult {
    return result && result.type == 'loading' || false;
}

export function isSuccess<V, E>(result: AsyncResult<V, E>): result is SuccessResult<V> {
    return result && result.type == 'success' || false;
}

export function isFailure<V, E>(result: AsyncResult<V, E>): result is FailureResult<E> {
    return result && result.type == 'failure' || false;
}