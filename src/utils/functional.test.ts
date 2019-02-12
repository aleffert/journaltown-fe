import { isSorted, safeGet, commafy } from './functional';
import { Optional } from './optional';

describe('functional utils', () => {
    describe('isSorted', () => {
        it('should return true if the list is empty', () => {
            expect(isSorted([])).toBe(true);
        });
        it('should return true if the list has one element', () => {
            expect(isSorted(['a'])).toBe(true);
        });
        it('should return true if the list is sorted', () => {
            expect(isSorted(['a', 'b', 'c'])).toBe(true);
        });
        it('should return false if the list is not sorted', () => {
            expect(isSorted([2, 1])).toBe(false);
        });
    })

    describe('safeGet', () => {
        it('should return undefined if passed undefined', () => {
            const result = safeGet(undefined as Optional<{foo: string}>, 'foo');
            expect(result).toBeUndefined();
        });
        it('should return undefined if passed null', () => {
            const result = safeGet(null as Optional<{foo: string}>, 'foo');
            expect(result).toBeUndefined();
        });
        it('should return a value if passed a real object', () => {
            const result = safeGet({foo: 'bar'} as Optional<{foo: string}>, 'foo');
            expect(result).toBe('bar');
        });
    });

    describe('commafy', () => {
        it('should pass through non array values', () => {
            const result = commafy({foo: 'bar'});
            expect(result).toEqual({foo: 'bar'});
        });
        it('should commafy array values', () => {
            const result = commafy({foo: ['bar', 'baz']});
            expect(result).toEqual({foo: 'bar,baz'});
        });
        it('should return all values', () => {
            const result = commafy({foo: ['bar', 'baz'], quux: 'something'});
            expect(result).toEqual({foo: 'bar,baz', quux: 'something'});
        });
    });
});