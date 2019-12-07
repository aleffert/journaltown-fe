import { Optional } from './optional';

type DefaultError = string;

type SuccessResult<V> = {type: 'success', value: V};
type FailureResult<E> = {type: 'failure', error: E};

export type Result<V, E = DefaultError> = SuccessResult<V> | FailureResult<E>;

type LoadingResult = {type: 'loading'};
export type Async<T> = Optional<LoadingResult | T>

export type AsyncResult<V, E = DefaultError> = Async<Result<V, E>>

export function makeSuccess<V>(value: V): SuccessResult<V> {
    return {type: 'success', value}
}

export function makeFailure<E>(error: E): FailureResult<E> {
    return {type: 'failure', error}
}

export function isLoading<V, E>(result: AsyncResult<V, E>): result is LoadingResult {
    return (result && result.type === 'loading') || false;
}

export function isSuccess<V, E>(result: AsyncResult<V, E>): result is SuccessResult<V> {
    return (result && result.type === 'success') || false;
}

export function isFailure<V, E>(result: AsyncResult<V, E>): result is FailureResult<E> {
    return (result && result.type === 'failure') || false;
}

export function resultMap<V, W, E>(result: AsyncResult<V, E>, f: (x: V) => W): AsyncResult<W, E> {
    if(isSuccess(result)) {
        return makeSuccess(f(result.value));
    }
    else {
        return result;
    }
}

export function resultJoin<V, W, E>(l: AsyncResult<V, E>, r: AsyncResult<W, E>): AsyncResult<[V, W], E> {
    if(l === undefined || r === undefined || l === null || r === null) {
        return undefined;
    }
    if(l.type === 'loading' || r.type === 'loading') {
        return {type: 'loading'};
    }
    switch(l.type) {
        case 'failure':
            return l;
        case 'success':
            switch(r.type) {
                case 'failure':
                    return r;
                case 'success':
                    return makeSuccess([l.value, r.value]);
            }
    }
}