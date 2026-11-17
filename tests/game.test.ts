import test from 'node:test';
import assert from 'node:assert/strict';
import {
  gameReducer,
  initialGame,
  remainingChips,
  DIFFICULTIES,
  type Difficulty,
} from '../src/lib/game';
import { marketStep, regimeAt, binPrice } from '../src/lib/market';
import { scoreTick } from '../src/lib/scoring';
import { parseScores } from '../src/lib/storage';

test('cannot start without allocation and invalid transitions do nothing', () => {
  const s = initialGame();
  assert.equal(gameReducer(s, { type: 'start' }), s);
  for (const type of ['tick', 'pause', 'resume'] as const)
    assert.equal(gameReducer(s, { type }), s);
});
test('chip budget is conserved for each difficulty; full bins cycle to empty', () => {
  for (const difficulty of Object.keys(DIFFICULTIES) as Difficulty[]) {
    let s = initialGame(difficulty);
    for (let i = 0; i < 15; i++) s = gameReducer(s, { type: 'allocate', index: i });
    assert.equal(remainingChips(s), 0);
    assert.equal(
      s.bins.reduce((a, b) => a + b, 0),
      DIFFICULTIES[difficulty].budget,
    );
    s = gameReducer(s, { type: 'allocate', index: 0, remove: true });
    assert.equal(remainingChips(s), 1);
    s = gameReducer(s, { type: 'allocate', index: 14 });
    assert.equal(remainingChips(s), 0);
  }
  let s = initialGame();
  for (let i = 0; i < 3; i++) s = gameReducer(s, { type: 'allocate', index: 7 });
  assert.equal(s.bins[7], 3);
  s = gameReducer(s, { type: 'allocate', index: 7 });
  assert.equal(s.bins[7], 0);
  assert.equal(remainingChips(s), 12);
});
test('invalid bin indices are rejected, removing empty bins does not mint chips', () => {
  const s = initialGame();
  for (const index of [-1, 15, 1.2, NaN])
    assert.equal(gameReducer(s, { type: 'allocate', index }), s);
  assert.equal(remainingChips(gameReducer(s, { type: 'allocate', index: 2, remove: true })), 12);
});
test('pause freezes time, allocation, score and seed; resume continues', () => {
  let s = gameReducer(initialGame(), { type: 'allocate', index: 7 });
  s = gameReducer(s, { type: 'start' });
  s = gameReducer(s, { type: 'tick' });
  s = gameReducer(s, { type: 'pause' });
  assert.equal(gameReducer(s, { type: 'tick' }), s);
  assert.equal(gameReducer(s, { type: 'allocate', index: 1 }), s);
  assert.equal(gameReducer(s, { type: 'difficulty', difficulty: 'Expert' }), s);
  const resumed = gameReducer(gameReducer(s, { type: 'resume' }), { type: 'tick' });
  assert.equal(resumed.tick, s.tick + 1);
});
test('scoring covers depth, activity, streak cap and difficulty penalty', () => {
  assert.equal(scoreTick(1, 1, 0, 8), 15);
  assert.equal(scoreTick(3, 2, 4, 8), 58);
  assert.equal(scoreTick(2, 1, 100, 8), 40);
  assert.equal(scoreTick(0, 2, 9, 18), -18);
});
test('score cannot become negative, misses reset streak', () => {
  let s = gameReducer(gameReducer(initialGame(), { type: 'allocate', index: 0 }), {
    type: 'start',
  });
  s = { ...s, streak: 5 };
  s = gameReducer(s, { type: 'tick' });
  assert.equal(s.score, 0);
  assert.equal(s.streak, 0);
  assert.equal(s.lastDelta, -8);
});
test('full 60-tick round terminates; reset clears all round state and preserves seed/difficulty', () => {
  let s = initialGame('Expert', 42);
  s = gameReducer(s, { type: 'allocate', index: 7 });
  s = gameReducer(s, { type: 'start' });
  for (let i = 0; i < 60; i++) s = gameReducer(s, { type: 'tick' });
  assert.equal(s.phase, 'over');
  assert.equal(s.tick, 60);
  assert.equal(gameReducer(s, { type: 'tick' }), s);
  assert.equal(gameReducer(s, { type: 'allocate', index: 2 }), s);
  assert.deepEqual(gameReducer(s, { type: 'reset' }), initialGame('Expert', 42));
});
test('same seeded inputs reproduce the entire round', () => {
  const play = () => {
    let s = initialGame();
    for (let i = 3; i < 12; i++) s = gameReducer(s, { type: 'allocate', index: i });
    s = gameReducer(s, { type: 'start' });
    for (let i = 0; i < 60; i++) s = gameReducer(s, { type: 'tick' });
    return s;
  };
  assert.deepEqual(play(), play());
  assert.ok(play().score > 0);
  assert.ok(play().covered > 0);
});
test('market stays bounded across seeds and all regimes', () => {
  for (let seed = 0; seed < 100; seed++) {
    let price = 7;
    let s = seed;
    for (let t = 0; t < 120; t++) {
      const m = marketStep(price, t, s);
      assert.ok(Number.isInteger(m.price) && m.price >= 0 && m.price < 15);
      assert.ok([1, 2].includes(m.activity));
      price = m.price;
      s = m.seed;
    }
  }
  assert.equal(regimeAt(0), 'Sideways');
  assert.equal(regimeAt(19), 'Sideways');
  assert.equal(regimeAt(20), 'Trending');
  assert.equal(regimeAt(40), 'Volatile');
});
test('illustrative ladder uses geometric spacing', () => {
  assert.equal(binPrice(7), '100.00');
  assert.equal(binPrice(8), '101.00');
  assert.equal(binPrice(6), '99.01');
});
test('storage rejects corrupted, malicious and invalid score records', () => {
  assert.deepEqual(parseScores('bad json'), []);
  assert.deepEqual(parseScores('{}'), []);
  assert.deepEqual(parseScores('[{"score":-1}]'), []);
  const record = {
    id: 'a',
    score: 123,
    coverage: 55,
    difficulty: 'Rookie',
    seed: 42,
    date: '2026-11-17',
  };
  assert.deepEqual(parseScores(JSON.stringify([record])), [record]);
  assert.deepEqual(parseScores(JSON.stringify([{ ...record, difficulty: '__proto__' }])), []);
});
