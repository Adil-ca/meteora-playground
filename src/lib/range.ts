export type Shape = 'Spot' | 'Curve' | 'Bid-Ask';
export function distribution(low: number, high: number, budget: number, shape: Shape, count = 21) {
  if (
    !Number.isInteger(low) ||
    !Number.isInteger(high) ||
    low < 0 ||
    high >= count ||
    low > high ||
    !Number.isFinite(budget) ||
    budget < 0
  )
    throw new Error('Invalid range');
  const mid = (low + high) / 2;
  const weights = Array.from({ length: count }, (_, i) => {
    if (i < low || i > high) return 0;
    const distance = Math.abs(i - mid);
    return shape === 'Spot'
      ? 1
      : shape === 'Curve'
        ? 1 + (high - low) / 2 - distance
        : 1 + distance;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (w / total) * budget);
}
