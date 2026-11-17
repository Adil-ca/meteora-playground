import { marketStep, type Regime } from './market';
import { scoreTick } from './scoring';
export const BIN_COUNT = 15;
export const ROUND_SECONDS = 60;
export const DIFFICULTIES = {
  Rookie: { budget: 12, penalty: 8 },
  Strategist: { budget: 9, penalty: 12 },
  Expert: { budget: 6, penalty: 18 },
} as const;
export type Difficulty = keyof typeof DIFFICULTIES;
export type Phase = 'ready' | 'running' | 'paused' | 'over';
export interface GameState {
  phase: Phase;
  difficulty: Difficulty;
  bins: number[];
  price: number;
  tick: number;
  score: number;
  streak: number;
  bestStreak: number;
  covered: number;
  seed: number;
  initialSeed: number;
  regime: Regime;
  activity: number;
  lastDelta: number;
  history: number[];
}
export type Action =
  | { type: 'start' | 'pause' | 'resume' | 'tick' | 'clear' | 'reset' }
  | { type: 'allocate'; index: number; remove?: boolean }
  | { type: 'difficulty'; difficulty: Difficulty }
  | { type: 'seed'; seed: number };
export function initialGame(difficulty: Difficulty = 'Rookie', seed = 20261117): GameState {
  return {
    phase: 'ready',
    difficulty,
    bins: Array(BIN_COUNT).fill(0),
    price: 7,
    tick: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    covered: 0,
    seed,
    initialSeed: seed,
    regime: 'Sideways',
    activity: 1,
    lastDelta: 0,
    history: [7],
  };
}
export function remainingChips(state: GameState) {
  return DIFFICULTIES[state.difficulty].budget - state.bins.reduce((a, b) => a + b, 0);
}
export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'reset':
      return initialGame(state.difficulty, state.initialSeed);
    case 'difficulty':
      return state.phase === 'ready' ? initialGame(action.difficulty, state.initialSeed) : state;
    case 'seed':
      return state.phase === 'ready' ? initialGame(state.difficulty, action.seed >>> 0) : state;
    case 'start':
      return state.phase === 'ready' && state.bins.some(Boolean)
        ? { ...state, phase: 'running' }
        : state;
    case 'pause':
      return state.phase === 'running' ? { ...state, phase: 'paused' } : state;
    case 'resume':
      return state.phase === 'paused' ? { ...state, phase: 'running' } : state;
    case 'clear':
      return state.phase === 'ready' ? { ...state, bins: Array(BIN_COUNT).fill(0) } : state;
    case 'allocate': {
      if (
        !['ready', 'running'].includes(state.phase) ||
        !Number.isInteger(action.index) ||
        action.index < 0 ||
        action.index >= BIN_COUNT
      )
        return state;
      const bins = [...state.bins];
      if (action.remove) bins[action.index] = Math.max(0, bins[action.index] - 1);
      else if (bins[action.index] === 3) bins[action.index] = 0;
      else if (remainingChips(state) > 0) bins[action.index] += 1;
      else return state;
      return { ...state, bins };
    }
    case 'tick': {
      if (state.phase !== 'running') return state;
      const market = marketStep(state.price, state.tick, state.seed);
      const hit = state.bins[market.price] > 0;
      const delta = scoreTick(
        state.bins[market.price],
        market.activity,
        state.streak,
        DIFFICULTIES[state.difficulty].penalty,
      );
      const tick = state.tick + 1;
      const streak = hit ? state.streak + 1 : 0;
      return {
        ...state,
        ...market,
        tick,
        streak,
        bestStreak: Math.max(streak, state.bestStreak),
        score: Math.max(0, state.score + delta),
        lastDelta: delta,
        covered: state.covered + Number(hit),
        phase: tick >= ROUND_SECONDS ? 'over' : 'running',
        history: [...state.history.slice(-29), market.price],
      };
    }
  }
}
