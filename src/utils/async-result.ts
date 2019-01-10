type DefaultError = string;

export type Result<V, E = DefaultError> =
    {type: 'success', value: V} |
    {type: 'failure', error: E};

export type AsyncResult<V, E = DefaultError> = {type: 'loading'} | Result<V, E>