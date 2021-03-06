import { Action, Dispatch, bindActionCreators } from 'redux';
import { push, replace } from 'connected-react-router';


// Given an object whose values are action creators
// return an object with the same keys whose values
// are functions that take the argument to the action creator
// and call dispatch on the result of calling that action creator with those arguments
export function bindDispatch<A extends Action, T extends object>(actions: T) {
    return function(dispatch: Dispatch<A['type']>): {actions: T} {
        const result: any = {};
        for(const group of Object.keys(actions)) {
            result[group] = bindActionCreators((actions as any)[group], dispatch);
        }
        return {actions: result};
    }
}

export const historyActions = {
    push,
    replace,
}
