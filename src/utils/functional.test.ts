import { isSorted } from './functional';

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
});