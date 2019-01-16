import { bindDispatch } from "./store";

describe('bindDispatch', () => {
    it('wraps things in a key called actions', () => {
        const dispatch = jest.fn();
        expect(Object.keys(bindDispatch({user: {}, location: {}})(dispatch))).toEqual(['actions']);
    });
    it('returns a group for each input group', () => {
        const dispatch = jest.fn();
        expect(Object.keys(bindDispatch({user: {}, location: {}})(dispatch).actions)).toEqual(['user', 'location']);
    });
    it('returns a function for each member of a group', () => {
        const dispatch = jest.fn();

        expect(Object.keys(bindDispatch({user: {foo: jest.fn(), bar: jest.fn()}})(dispatch).actions.user)).toEqual(['foo', 'bar']);
    });
});