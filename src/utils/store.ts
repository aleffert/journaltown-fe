import { Action, Dispatch } from 'redux';
import { Pluck } from './types';

export function bindDispatch<A extends Action, T extends object>(actions: T) {
    return function(dispatch: Dispatch<Pluck<A, 'type'>>): T {
        const result: any = {};
        for(const key of Object.keys(actions)) {
            const action = (actions as any)[key];
            result[key] = (...args: any[]) => dispatch(action.apply(null, args));
        }
        return result;
    }
}