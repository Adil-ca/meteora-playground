export type Regime = 'Sideways' | 'Trending' | 'Volatile';
export function random(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}
export function regimeAt(tick: number): Regime {
  return tick < 20 ? 'Sideways' : tick < 40 ? 'Trending' : 'Volatile';
}
export function marketStep(price: number, tick: number, seed: number, count = 15) {
  const [r, nextSeed] = random(seed);
  const [activityRoll, finalSeed] = random(nextSeed);
  const regime = regimeAt(tick);
  let delta = r < 0.28 ? -1 : r > 0.72 ? 1 : 0;
  if (regime === 'Sideways' && Math.abs(price - (count - 1) / 2) > 3 && r < 0.65)
    delta = Math.sign((count - 1) / 2 - price);
  if (regime === 'Trending') delta = r < 0.18 ? -1 : r < 0.38 ? 0 : 1;
  if (regime === 'Volatile') delta = Math.floor(r * 7) - 3;
  // Reflect at the board edges instead of getting stuck at the end of a trend.
  let next = price + delta;
  if (next < 0) next = -next;
  if (next >= count) next = 2 * (count - 1) - next;
  return { price: next, seed: finalSeed, activity: activityRoll > 0.73 ? 2 : 1, regime };
}
export function binPrice(index: number, midpoint = 7): string {
  return (100 * Math.pow(1.01, index - midpoint)).toFixed(2);
}
