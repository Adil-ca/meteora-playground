'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  Copy,
  Gamepad2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Minus,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  DIFFICULTIES,
  gameReducer,
  initialGame,
  remainingChips,
  ROUND_SECONDS,
  type Difficulty,
} from '@/lib/game';
import { binPrice } from '@/lib/market';
import { parseScores, saveScore, SCORE_KEY, type HighScore } from '@/lib/storage';
import { BinBoard } from './BinBoard';
import { MarketChart } from './MarketChart';
import { Tutorial } from './Tutorial';
import { Disclaimer } from '../Disclaimer';
export function BinRunner({ visible }: { visible: boolean }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => initialGame());
  const [tutorial, setTutorial] = useState(false);
  const [remove, setRemove] = useState(false);
  const [sound, setSound] = useState(false);
  const [scores, setScores] = useState<HighScore[]>([]);
  const [notice, setNotice] = useState('');
  const [copied, setCopied] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const saved = useRef(false);
  const roundId = useRef('');
  const startedTutorial = useRef(false);
  const playTone = useCallback(
    (frequency: number) => {
      if (!sound || !audio.current) return;
      const ctx = audio.current;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.12);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    },
    [sound],
  );
  useEffect(() => {
    // Browser storage must be read after hydration; the server renders an empty score list.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScores(parseScores(localStorage.getItem(SCORE_KEY)));
    } catch {
      setNotice('Storage is unavailable. Your round still works; scores stay in memory.');
    }
    return () => {
      void audio.current?.close();
    };
  }, []);
  useEffect(() => {
    if (visible && !startedTutorial.current) {
      startedTutorial.current = true;
      // The persisted tutorial preference is a browser-only external value.
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!localStorage.getItem('meteora-playground.tutorial')) setTutorial(true);
      } catch {
        setTutorial(true);
      }
    }
    if (!visible) dispatch({ type: 'pause' });
  }, [visible]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) dispatch({ type: 'pause' });
    };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  useEffect(() => {
    if (state.phase !== 'running' || !visible) return;
    const timer = window.setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timer);
  }, [state.phase, visible]);
  useEffect(() => {
    if (state.tick > 0) playTone(state.lastDelta > 0 ? 580 : 180);
  }, [state.tick, state.lastDelta, playTone]);
  useEffect(() => {
    if (state.phase !== 'over' || saved.current) return;
    saved.current = true;
    document.querySelector<HTMLElement>('.result-overlay')?.focus({ preventScroll: true });
    const entry: HighScore = {
      id: roundId.current,
      score: state.score,
      coverage: Math.round((state.covered / ROUND_SECONDS) * 100),
      difficulty: state.difficulty,
      seed: state.initialSeed,
      date: new Date().toISOString(),
    };
    try {
      setScores(saveScore(entry));
    } catch {
      setScores((old) => [...old, entry].sort((a, b) => b.score - a.score).slice(0, 15));
      setNotice('Score kept for this visit. Browser storage is unavailable.');
    }
  }, [state.phase, state.score, state.covered, state.difficulty, state.initialSeed]);
  function reset() {
    saved.current = false;
    setCopied(false);
    setRemove(false);
    setNotice('');
    dispatch({ type: 'reset' });
  }
  function start() {
    roundId.current = crypto.randomUUID();
    dispatch({ type: 'start' });
    setNotice('');
    if (window.innerWidth <= 600)
      requestAnimationFrame(() =>
        document
          .querySelector('.game-console')
          ?.scrollIntoView({ block: 'start', behavior: 'instant' }),
      );
  }
  function closeTutorial() {
    setTutorial(false);
    try {
      localStorage.setItem('meteora-playground.tutorial', 'seen');
    } catch {
      /* Optional persistence. */
    }
  }
  function allocate(index: number) {
    if (!remove && remainingChips(state) === 0 && state.bins[index] < 3) {
      setNotice('All chips deployed. Use Remove to reclaim a chip, then place it elsewhere.');
      return;
    }
    setNotice('');
    dispatch({ type: 'allocate', index, remove });
    playTone(remove ? 260 : 420);
  }
  async function toggleSound() {
    if (sound) {
      setSound(false);
      return;
    }
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      setSound(true);
    } catch {
      setNotice('Sound is unavailable in this browser. All visual controls still work.');
    }
  }
  async function share() {
    const text = `I scored ${state.score} game points in BIN RUNNER! ${state.difficulty} / seed ${state.initialSeed} / ${Math.round((state.covered / 60) * 100)}% coverage. Can you beat it? Educational simulation, not trading returns.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setNotice(text);
    }
  }
  const used = DIFFICULTIES[state.difficulty].budget - remainingChips(state);
  const ranked = scores
    .filter((s) => s.difficulty === state.difficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  return (
    <section
      className={`experience-page section-shell game-page is-${state.phase}`}
      aria-labelledby="game-title"
    >
      <div className="page-heading">
        <div>
          <div className="eyebrow coral-text">01 / THE MAIN EVENT</div>
          <h1 id="game-title">
            BIN RUNNER<span className="heading-cross">✳</span>
          </h1>
          <p>One market. Fifteen bins. Your move.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => {
            dispatch({ type: 'pause' });
            setTutorial(true);
          }}
        >
          <CircleHelp size={16} /> How to play
        </button>
      </div>
      <div className="game-layout">
        <div className="game-console">
          <div className="console-top">
            <span>
              <Gamepad2 size={16} /> LIQUIDITY ARCADE
            </span>
            <div>
              <span className={`status-dot ${state.phase === 'running' ? 'live' : ''}`} />
              {state.phase === 'running'
                ? 'ROUND LIVE'
                : state.phase === 'ready'
                  ? 'PREPARE YOUR POSITION'
                  : state.phase === 'over'
                    ? 'ROUND COMPLETE'
                    : 'PAUSED'}
              <button
                className="icon-button"
                onClick={toggleSound}
                aria-label={sound ? 'Mute sound' : 'Enable sound'}
                aria-pressed={sound}
              >
                {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
              </button>
            </div>
          </div>
          <div className="game-stats">
            <div>
              <span className="stat-label">GAME POINTS</span>
              <strong data-testid="score">{state.score.toLocaleString()}</strong>
              <span className={`score-delta ${state.lastDelta < 0 ? 'negative' : ''}`}>
                {state.tick
                  ? `${state.lastDelta > 0 ? '+' : ''}${state.lastDelta} last activity`
                  : 'Make your first move'}
              </span>
            </div>
            <div>
              <span className="stat-label">COVERAGE STREAK</span>
              <strong>
                {state.streak}
                <small> ticks</small>
              </strong>
              <span className="muted">Best this round: {state.bestStreak}</span>
            </div>
            <div className="timer-stat">
              <span className="stat-label">TIME REMAINING</span>
              <strong data-testid="timer" className={state.tick > 49 ? 'coral-text' : ''}>
                {Math.floor((60 - state.tick) / 60)
                  .toString()
                  .padStart(2, '0')}
                :{String((60 - state.tick) % 60).padStart(2, '0')}
              </strong>
              <span className="muted">60-second challenge</span>
            </div>
          </div>
          <div className="time-track">
            <span style={{ width: `${((60 - state.tick) / 60) * 100}%` }} />
          </div>
          <div className="market-info">
            <div>
              <span className="stat-label">SIMULATED PRICE</span>
              <strong>
                {binPrice(state.price)} <span>units</span>
              </strong>
            </div>
            <div className="market-badges">
              <span className="tag">{state.regime}</span>
              <span className={`tag ${state.activity === 2 ? 'coral-tag' : ''}`}>
                <Zap size={12} />
                {state.activity === 2 ? 'Activity burst ×2' : 'Normal activity'}
              </span>
            </div>
          </div>
          <div className="chart-wrap">
            <MarketChart history={state.history} />
            <span className="chart-label mono">ILLUSTRATIVE PRICE PATH</span>
          </div>
          <div className="board-header">
            <span className="mono">YOUR LIQUIDITY POSITION</span>
            <span className="board-legend">
              <span>
                <i className="legend-square coral" /> Active price
              </span>
              <span>
                <i className="legend-square purple" /> Your chips
              </span>
            </span>
          </div>
          <div className="board-wrap">
            <BinBoard state={state} remove={remove} onAllocate={allocate} />
            {state.phase === 'paused' && (
              <div className="board-overlay">
                <Pause size={25} />
                <h2>Take a breath.</h2>
                <p>Your clock and market are paused.</p>
                <button className="button primary" onClick={() => dispatch({ type: 'resume' })}>
                  <Play size={16} /> Resume round
                </button>
              </div>
            )}
            {state.phase === 'over' && (
              <div
                className="board-overlay result-overlay"
                role="region"
                aria-label="Round results"
                tabIndex={-1}
              >
                <Trophy size={27} />
                <span className="eyebrow">ROUND COMPLETE</span>
                <h2>
                  {state.score.toLocaleString()} <small>game points</small>
                </h2>
                <p>
                  {Math.round((state.covered / 60) * 100)}% coverage · {state.bestStreak}-tick best
                  streak
                </p>
                <div className="result-actions">
                  <button className="button primary" onClick={reset}>
                    <RotateCcw size={15} /> Play again
                  </button>
                  <button className="button secondary" onClick={share}>
                    {copied ? <Check size={15} /> : <Copy size={15} />}{' '}
                    {copied ? 'Copied!' : 'Copy score'}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="allocation-controls">
            <div>
              <span className="stat-label">CHIPS AVAILABLE</span>
              <strong data-testid="budget">
                {remainingChips(state)} <small>/ {DIFFICULTIES[state.difficulty].budget}</small>
              </strong>
            </div>
            <div className="chip-meter" aria-hidden="true">
              {Array.from({ length: DIFFICULTIES[state.difficulty].budget }, (_, i) => (
                <i key={i} className={i < used ? 'used' : ''} />
              ))}
            </div>
            <div className="segmented" aria-label="Allocation tool">
              <button
                aria-pressed={!remove}
                className={!remove ? 'selected' : ''}
                onClick={() => setRemove(false)}
              >
                <Plus size={14} /> Place
              </button>
              <button
                aria-pressed={remove}
                className={remove ? 'selected' : ''}
                onClick={() => setRemove(true)}
              >
                <Minus size={14} /> Remove
              </button>
            </div>
          </div>
          <div className="game-message" role="status">
            {notice ||
              (state.phase === 'ready'
                ? 'Tap a few bins near the coral marker, then start your round.'
                : state.phase === 'running'
                  ? state.bins[state.price] > 0
                    ? 'Covered! Your liquidity is where the activity is.'
                    : 'Outside your position. Reclaim and reposition your chips.'
                  : 'Same seed. Same market. A new strategy?')}
          </div>
          <div className="console-bottom">
            <div>
              {state.phase === 'ready' ? (
                <button className="button primary" onClick={start} disabled={used === 0}>
                  <Play size={16} /> Start round
                </button>
              ) : state.phase === 'running' ? (
                <button className="button secondary" onClick={() => dispatch({ type: 'pause' })}>
                  <Pause size={16} /> Pause
                </button>
              ) : state.phase === 'paused' ? (
                <button className="button primary" onClick={() => dispatch({ type: 'resume' })}>
                  <Play size={16} /> Resume
                </button>
              ) : (
                <button className="button primary" onClick={reset}>
                  <RotateCcw size={16} /> New round
                </button>
              )}
              <button
                className="icon-button"
                aria-label={state.phase === 'ready' ? 'Clear allocation' : 'Restart round'}
                title={state.phase === 'ready' ? 'Clear allocation' : 'Restart round'}
                onClick={() => (state.phase === 'ready' ? dispatch({ type: 'clear' }) : reset())}
              >
                <RotateCcw size={17} />
              </button>
            </div>
            <span className="mono keyboard-hint">TAB TO SELECT · ENTER TO PLACE</span>
          </div>
        </div>
        <aside className="game-sidebar">
          <div className="side-panel">
            <div className="eyebrow">SET YOUR CHALLENGE</div>
            <h3>A little pressure?</h3>
            <div className="difficulty-options">
              {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d, i) => (
                <button
                  key={d}
                  disabled={state.phase !== 'ready'}
                  aria-pressed={state.difficulty === d}
                  className={state.difficulty === d ? 'selected' : ''}
                  onClick={() => dispatch({ type: 'difficulty', difficulty: d })}
                >
                  <span>
                    {d}
                    <small>
                      {DIFFICULTIES[d].budget} chips · −{DIFFICULTIES[d].penalty} on a miss
                    </small>
                  </span>
                  <span className="difficulty-bars">{'▮'.repeat(i + 1)}</span>
                </button>
              ))}
            </div>
            <label className="seed-label" htmlFor="seed">
              REPLAY SEED{' '}
              <input
                id="seed"
                type="number"
                min="0"
                max="4294967295"
                value={state.initialSeed}
                disabled={state.phase !== 'ready'}
                onChange={(e) => dispatch({ type: 'seed', seed: Number(e.target.value) })}
              />
            </label>
            <p className="micro">Same seed + difficulty = the same market challenge.</p>
          </div>
          <div className="side-panel scoring-panel">
            <div className="eyebrow">MAKE EVERY CHIP COUNT</div>
            <h3>The score, explained.</h3>
            <p>
              <span className="scoring-symbol">+</span> Cover the active bin when activity arrives.
            </p>
            <div className="formula mono">
              (10 + 5 × chips) × activity
              <br />+ 2 × streak <span>(up to 10)</span>
            </div>
            <p>
              <span className="scoring-symbol negative">−</span> Miss the active bin:{' '}
              {DIFFICULTIES[state.difficulty].penalty} points.
            </p>
            <p className="micro">
              Streak uses prior covered ticks. Scores never go below zero. Bursts double base
              points. These are game rules, not Meteora fee calculations.
            </p>
          </div>
          <div className="side-panel leaderboard">
            <div className="leaderboard-title">
              <h3>
                <Trophy size={17} /> Personal bests
              </h3>
              <span className="tag">{state.difficulty}</span>
            </div>
            {ranked.length ? (
              <ol>
                {ranked.map((s, i) => (
                  <li key={s.id}>
                    <span className="rank mono">0{i + 1}</span>
                    <div>
                      <strong>
                        {s.score.toLocaleString()} <small>pts</small>
                      </strong>
                      <span>
                        {s.coverage}% coverage · seed {s.seed}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="empty-score">
                <Trophy size={25} />
                <p>Your first score belongs here.</p>
                <span>Finish a round to set the bar.</span>
              </div>
            )}
            <div className="leaderboard-footer">
              <span>Saved on this browser only</span>
              {scores.length > 0 && (
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem(SCORE_KEY);
                    } catch {}
                    setScores([]);
                  }}
                >
                  Clear scores
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
      <div className="game-learning">
        <div>
          <span className="eyebrow">THE REAL-WORLD CONNECTION</span>
          <p>
            In DLMM, liquidity sits in discrete price bins. Only one bin is active at a time. Here,
            you practice the idea of coverage; actual swaps change token inventory and use protocol
            fee rules.
          </p>
        </div>
        <a
          href="https://docs.meteora.ag/core-products/dlmm/what-is-dlmm"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Understand DLMM <ArrowUpRight size={16} />
        </a>
      </div>
      <Disclaimer compact />
      <Tutorial open={tutorial && visible} onClose={closeTutorial} />
    </section>
  );
}
