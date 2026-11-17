import test from 'node:test';
import assert from 'node:assert/strict';
import { distribution, type Shape } from '../src/lib/range';
test('all shapes conserve the virtual budget with inactive bins empty', () => {
  for (const shape of ['Spot', 'Curve', 'Bid-Ask'] as Shape[]) {
    const v = distribution(5, 15, 1000, shape);
    assert.ok(Math.abs(v.reduce((a, b) => a + b, 0) - 1000) < 1e-8);
    assert.equal(v[4], 0);
    assert.equal(v[16], 0);
    assert.ok(v[5] > 0);
    assert.ok(v[15] > 0);
  }
});
test('center and edge shapes have the expected symmetry', () => {
  const curve = distribution(5, 15, 1000, 'Curve');
  const edges = distribution(5, 15, 1000, 'Bid-Ask');
  assert.ok(curve[10] > curve[5]);
  assert.equal(curve[5], curve[15]);
  assert.ok(edges[5] > edges[10]);
  assert.equal(edges[5], edges[15]);
});
test('widening fixed budget lowers uniform per-bin allocation; endpoints included', () => {
  assert.equal(distribution(8, 12, 1000, 'Spot')[10], 200);
  assert.ok(distribution(0, 20, 1000, 'Spot')[10] < 200);
  assert.equal(distribution(10, 10, 1000, 'Curve')[10], 1000);
});
test('invalid bounds and budgets are rejected', () => {
  for (const args of [
    [-1, 2, 100],
    [10, 5, 100],
    [0, 21, 100],
    [0, 20, -1],
    [0, 20, NaN],
    [1.5, 20, 100],
  ])
    assert.throws(() => distribution(args[0], args[1], args[2], 'Spot'));
});
