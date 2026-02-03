import generateBracketOrder from './generate-bracket-order';

describe('generateBracketOrder', () => {
  it('should return [0] for nearestPowerOfTwo = 1', () => {
    expect(generateBracketOrder(1)).toEqual([0]);
  });

  it('should return [0, 1] for nearestPowerOfTwo = 2', () => {
    expect(generateBracketOrder(2)).toEqual([0, 1]);
  });

  it('should return [0, 3, 1, 2] for nearestPowerOfTwo = 4', () => {
    expect(generateBracketOrder(4)).toEqual([0, 3, 1, 2]);
  });

  it('should return [0, 7, 3, 4, 1, 6, 2, 5] for nearestPowerOfTwo = 8', () => {
    expect(generateBracketOrder(8)).toEqual([0, 7, 3, 4, 1, 6, 2, 5]);
  });
});