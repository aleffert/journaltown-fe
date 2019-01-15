import { Action, Dispatch } from 'redux';
import { push, replace, CallHistoryMethodAction } from 'connected-react-router';
import { LocationDescriptorObject } from 'history';


// Given an object whose values are action creators
// return an object with the same keys whose values
// are functions that take the argument to the action creator
// and call dispatch on the result of calling that action creator with those arguments
export function bindDispatch<A extends Action, T extends object>(actions: T) {
    return function(dispatch: Dispatch<A['type']>): {actions: T} {
        const result: any = {};
        for(const key of Object.keys(actions)) {
            const action = (actions as any)[key];
            result[key] = (...args: any[]) => dispatch(action.apply(null, args));
        }
        return {actions: result};
    }
}

type RouteLocation = LocationDescriptorObject

export function historyActions<A extends Action, T>(map: (dispatch: Dispatch<A['type']>) => T) {
    return function(dispatch: Dispatch<A['type']>) {
        return {...map(dispatch),
            history: {
                push: (location: RouteLocation) => dispatch(push(location)),
                replace: (location: RouteLocation) => dispatch(replace(location))
            }
        };
    }
}
