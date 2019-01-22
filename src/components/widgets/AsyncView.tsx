import React from 'react';

import { Result, Async } from '../../utils';
import { InitialLoader } from '../user/InitialLoader';
import { ApiErrorView } from './ErrorView';
import { ApiError } from '../../services';

type AsyncViewProps<T> = {
    result: Async<Result<T, ApiError>>,
    children: (value: T) => JSX.Element
};

export function AsyncView<T>(props: AsyncViewProps<T>): JSX.Element {
    if(!props.result) {
        return <InitialLoader/>
    }
    switch(props.result.type) {
        case 'loading':
            return <InitialLoader/>;
        case 'failure':
            return <ApiErrorView error={props.result.error}/>;
        case 'success':
            return props.children(props.result.value);
    }
}