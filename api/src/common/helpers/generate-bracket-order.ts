export default function generateBracketOrder(
  nearestPowerOfTwo: number,
): number[] {
  if (nearestPowerOfTwo === 1) {
    return [0];
  }

  const subOrder = generateBracketOrder(nearestPowerOfTwo / 2);

  const result: number[] = [];
  for (const matchIndex of subOrder) {
    result.push(matchIndex);
    result.push(nearestPowerOfTwo - 1 - matchIndex);
  }

  return result;
}
