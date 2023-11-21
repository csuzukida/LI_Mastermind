import { getCorrectCounts } from '../src/client/utils/getCorrectCounts';

describe('getCorrectCounts', () => {
  describe('should work with no duplicates in answer', () => {
    const testArr = [0, 1, 3, 5];
    it('should return [0,0] when there are no matching numbers', () => {
      const result = getCorrectCounts(testArr, [2, 2, 4, 6]);
      expect(result).toEqual([0, 0]);
    });

    it('should return [1,0] where there is one matching number but not in the correct location', () => {
      const result = getCorrectCounts(testArr, [2, 2, 1, 6]);
      expect(result).toEqual([1, 0]);
    });

    it('should return [1,1] when there is one matching numbering in the correct locations', () => {
      const result = getCorrectCounts(testArr, [2, 1, 4, 6]);
      expect(result).toEqual([1, 1]);
    });

    it('should return [2,0] when there are two matching numbers but not in the correct locations', () => {
      const result = getCorrectCounts(testArr, [1, 6, 6, 3]);
      expect(result).toEqual([2, 0]);
    });

    it('should return [4,0] when there are four matching numbers but not in the correct locations', () => {
      const result = getCorrectCounts(testArr, [5, 3, 0, 1]);
      expect(result).toEqual([4, 0]);
    });

    it('should return [4,4] when all the numbers are correct and in the correct locations', () => {
      const result = getCorrectCounts(testArr, [0, 1, 3, 5]);
      expect(result).toEqual([4, 4]);
    });
  });

  describe('should work with duplicates in answer', () => {
    const testArr = [1, 1, 3, 3];

    it('should return [0,0] when there are no matching numbers', () => {
      const result = getCorrectCounts(testArr, [2, 2, 4, 6]);
      expect(result).toEqual([0, 0]);
    });

    it('should return [1,0] where there is one matching number but not in the correct location', () => {
      const result = getCorrectCounts(testArr, [2, 2, 1, 6]);
      expect(result).toEqual([1, 0]);
    });

    it('should return [1,1] when there is one matching numbering in the correct locations', () => {
      const result = getCorrectCounts(testArr, [2, 1, 4, 6]);
      expect(result).toEqual([1, 1]);
    });

    it('should return [2,0] when there are two matching numbers but not in the correct locations', () => {
      const result = getCorrectCounts(testArr, [3, 2, 1, 6]);
      expect(result).toEqual([2, 0]);
    });

    it('should return [4,0] when there are four matching numbers but not in the correct locations', () => {
      const result = getCorrectCounts(testArr, [3, 3, 1, 1]);
      expect(result).toEqual([4, 0]);
    });

    it('should return [4,4] when all the numbers are correct and in the correct locations', () => {
      const result = getCorrectCounts(testArr, [1, 1, 3, 3]);
      expect(result).toEqual([4, 4]);
    });

    it('should return [2, 2] with two correct numbers, but duplicates in the answer', () => {
      const result = getCorrectCounts(testArr, [1, 1, 1, 1]);
      expect(result).toEqual([2, 2]);
    });
  });
});
