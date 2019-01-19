import { Optional } from './optional';

type DefaultError = string;

export type Result<V, E = DefaultError> =
    {type: 'success', value: V} |
    {type: 'failure', error: E};

export type AsyncResult<V, E = DefaultError> = Optional<{type: 'loading'} | Result<V, E>>

export type Async<T> = T | Optional<{type: 'loading'} | T>