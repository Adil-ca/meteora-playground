import { DIFFICULTIES, type Difficulty } from './game';
export interface HighScore {
  id: string;
  score: number;
  coverage: number;
  difficulty: Difficulty;
  seed: number;
  date: string;
}
export const SCORE_KEY = 'meteora-playground.scores.v1';
export function parseScores(raw: string | null): HighScore[] {
  try {
    const data: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (x): x is HighScore =>
          x &&
          typeof x.id === 'string' &&
          Number.isFinite(x.score) &&
          x.score >= 0 &&
          Number.isFinite(x.coverage) &&
          x.coverage >= 0 &&
          x.coverage <= 100 &&
          Object.hasOwn(DIFFICULTIES, x.difficulty) &&
          Number.isFinite(x.seed) &&
          typeof x.date === 'string',
      )
      .slice(0, 30);
  } catch {
    return [];
  }
}
export function saveScore(entry: HighScore): HighScore[] {
  const old = parseScores(localStorage.getItem(SCORE_KEY));
  const scores = [...old.filter((x) => x.id !== entry.id), entry].sort((a, b) => b.score - a.score);
  const filtered = Object.keys(DIFFICULTIES).flatMap((d) =>
    scores.filter((x) => x.difficulty === d).slice(0, 5),
  );
  localStorage.setItem(SCORE_KEY, JSON.stringify(filtered));
  return filtered;
}
