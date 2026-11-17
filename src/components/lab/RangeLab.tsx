'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, FlaskConical, Pause, Play, RotateCcw } from 'lucide-react';
import { distribution, type Shape } from '@/lib/range';
import { binPrice } from '@/lib/market';
import { Disclaimer } from '../Disclaimer';
const presets = [
  { name: 'Narrow', low: 8, high: 12 },
  { name: 'Medium', low: 5, high: 15 },
  { name: 'Wide', low: 0, high: 20 },
];
export function RangeLab({ visible }: { visible: boolean }) {
  const [low, setLow] = useState(5);
  const [high, setHigh] = useState(15);
  const [budget, setBudget] = useState(1000);
  const [price, setPrice] = useState(10);
  const [shape, setShape] = useState<Shape>('Spot');
  const [playing, setPlaying] = useState(false);
  const values = useMemo(() => distribution(low, high, budget, shape), [low, high, budget, shape]);
  useEffect(() => {
    if (!playing || !visible) return;
    let direction = 1;
    const timer = setInterval(
      () =>
        setPrice((p) => {
          if (p >= 20) direction = -1;
          if (p <= 0) direction = 1;
          return p + direction;
        }),
      700,
    );
    return () => clearInterval(timer);
  }, [playing, visible]);
  // Navigating away is an explicit pause boundary; it must not resume on return.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!visible) setPlaying(false);
  }, [visible]);
  useEffect(() => {
    const pause = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  const active = values[price] > 0;
  const width = high - low + 1;
  const comparisonMax = Math.max(...distribution(8, 12, budget, shape));
  function reset() {
    setLow(5);
    setHigh(15);
    setBudget(1000);
    setPrice(10);
    setShape('Spot');
    setPlaying(false);
  }
  return (
    <section className="experience-page section-shell lab-page" aria-labelledby="lab-title">
      <div className="page-heading">
        <div>
          <div className="eyebrow purple-text">02 / FOLLOW YOUR CURIOSITY</div>
          <h1 id="lab-title">
            Range Lab<span className="heading-cross purple-text">✳</span>
          </h1>
          <p>Same liquidity. Different possibilities.</p>
        </div>
        <span className="tag">
          <FlaskConical size={14} /> ILLUSTRATIVE SIMULATION
        </span>
      </div>
      <div className="lab-layout">
        <div className="lab-workspace">
          <div className="console-top">
            <span>YOUR EXPERIMENT</span>
            <button className="text-button" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
          <div className="lab-summary">
            <div>
              <span className="stat-label">PRICE RANGE</span>
              <strong>
                {binPrice(low, 10)} <span>—</span> {binPrice(high, 10)}
              </strong>
            </div>
            <div>
              <span className="stat-label">COVERED BINS</span>
              <strong>
                {width} <small>/ 21</small>
              </strong>
            </div>
            <span className={`coverage-badge ${active ? 'in' : 'out'}`}>
              {active ? '● In range' : '○ Out of range'}
            </span>
          </div>
          <div
            className="lab-chart"
            role="img"
            aria-label={`${shape} distribution over ${width} bins. Current price ${binPrice(price, 10)} is ${active ? 'in' : 'out of'} range.`}
          >
            <div className="chart-grid" />
            <div className="lab-bars">
              {values.map((v, i) => (
                <div key={i} className={`lab-bar-column ${i === price ? 'price-active' : ''}`}>
                  <span className="lab-price-dot">{i === price ? '▼' : ''}</span>
                  <div
                    className={`lab-bar ${v ? 'selected-bar' : ''}`}
                    style={{ height: `${Math.max(3, (v / Math.max(...values)) * 85)}%` }}
                  >
                    <span>{v.toFixed(0)}</span>
                  </div>
                  <span className="lab-bin-number">{i + 1}</span>
                </div>
              ))}
            </div>
            <div
              className="range-highlight"
              style={{ left: `${(low / 21) * 100}%`, width: `${(width / 21) * 100}%` }}
            />
            <span className="chart-axis mono">
              VIRTUAL UNITS / BIN · SCALE 0–{Math.max(...values).toFixed(0)}
            </span>
          </div>
          <div className="lab-axis">
            <span>LOWER PRICE {binPrice(0, 10)}</span>
            <span>{binPrice(20, 10)} HIGHER PRICE</span>
          </div>
          <div className="lab-price-control">
            <label htmlFor="lab-price">
              <span className="stat-label">MOVE THE SIMULATED PRICE</span>
              <strong>
                {binPrice(price, 10)} <small>units · bin {price + 1}</small>
              </strong>
            </label>
            <input
              id="lab-price"
              type="range"
              min="0"
              max="20"
              value={price}
              onChange={(e) => {
                setPlaying(false);
                setPrice(+e.target.value);
              }}
            />
            <button className="button secondary" onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? 'Pause' : 'Animate'}
            </button>
          </div>
          <div className={`lab-insight ${active ? '' : 'out'}`} role="status">
            <span className="insight-mark">↳</span>
            <div>
              <strong>
                {active ? 'Your position covers this price.' : 'The market has left your range.'}
              </strong>
              <p>
                {active
                  ? `${values[price].toFixed(1)} of your ${budget.toLocaleString()} virtual units sit in the active bin. ${shape === 'Spot' ? 'A Spot shape spreads the budget evenly.' : shape === 'Curve' ? 'Your Curve shape emphasizes the center.' : 'Your Bid-Ask shape emphasizes the edges.'}`
                  : 'Your allocation is still placed, but none is in the active bin. Move the price back, or widen your range to cover it.'}
              </p>
            </div>
          </div>
        </div>
        <aside className="side-panel lab-controls">
          <div className="eyebrow">CHANGE ONE THING. SEE WHAT HAPPENS.</div>
          <h3>Shape your liquidity.</h3>
          <label className="control-label">RANGE PRESET</label>
          <div className="segmented preset-buttons">
            {presets.map((p) => (
              <button
                key={p.name}
                className={low === p.low && high === p.high ? 'selected' : ''}
                aria-pressed={low === p.low && high === p.high}
                onClick={() => {
                  setLow(p.low);
                  setHigh(p.high);
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <label className="range-label" htmlFor="low-bin">
            <span>Lower bin</span>
            <strong>{low + 1}</strong>
          </label>
          <input
            id="low-bin"
            type="range"
            min="0"
            max="20"
            value={low}
            onChange={(e) => setLow(Math.min(+e.target.value, high))}
          />
          <label className="range-label" htmlFor="high-bin">
            <span>Upper bin</span>
            <strong>{high + 1}</strong>
          </label>
          <input
            id="high-bin"
            type="range"
            min="0"
            max="20"
            value={high}
            onChange={(e) => setHigh(Math.max(+e.target.value, low))}
          />
          <div className="control-divider" />
          <label className="range-label" htmlFor="virtual-budget">
            <span>Virtual liquidity</span>
            <strong>{budget.toLocaleString()} units</strong>
          </label>
          <input
            id="virtual-budget"
            type="range"
            min="100"
            max="3000"
            step="100"
            value={budget}
            onChange={(e) => setBudget(+e.target.value)}
          />
          <label className="control-label" htmlFor="distribution">
            DISTRIBUTION SHAPE
          </label>
          <select
            id="distribution"
            value={shape}
            onChange={(e) => setShape(e.target.value as Shape)}
          >
            <option>Spot</option>
            <option>Curve</option>
            <option>Bid-Ask</option>
          </select>
          <p className="micro">
            Illustrative shapes inspired by DLMM strategies. Exact SDK weighting and token amounts
            are not reproduced.
          </p>
          <div className="lab-takeaway">
            <span className="eyebrow">TRY THIS</span>
            <p>
              Choose Narrow, then move the price beyond your range. Switch to Wide. What happens to
              the allocation per bin?
            </p>
          </div>
        </aside>
      </div>
      <section className="comparison">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE TRADE-OFF, SIDE BY SIDE</div>
            <h2>Coverage or concentration?</h2>
          </div>
          <p>
            Same {budget.toLocaleString()} virtual units. Same {shape} shape.
            <br />
            Different ranges, centered on bin 11.
          </p>
        </div>
        <div className="comparison-grid">
          {presets.map((p) => {
            const allocation = distribution(p.low, p.high, budget, shape);
            const count = p.high - p.low + 1;
            return (
              <article key={p.name} className="comparison-card">
                <div>
                  <h3>{p.name}</h3>
                  <span className="tag">{count} bins</span>
                </div>
                <div className="comparison-bars" aria-hidden="true">
                  {allocation.map((v, i) => (
                    <span
                      key={i}
                      style={{ height: `${Math.max(3, (v / comparisonMax) * 100)}%` }}
                    />
                  ))}
                </div>
                <dl>
                  <div>
                    <dt>Average per covered bin</dt>
                    <dd>{(budget / count).toFixed(1)} units</dd>
                  </div>
                  <div>
                    <dt>At current price</dt>
                    <dd className={allocation[price] > 0 ? 'mint-text' : 'coral-text'}>
                      {allocation[price] > 0 ? 'Covered' : 'Not covered'}
                    </dd>
                  </div>
                </dl>
                <button
                  className="text-link"
                  onClick={() => {
                    setLow(p.low);
                    setHigh(p.high);
                  }}
                >
                  Try this range <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
        <p className="micro">
          A wider range covers more possible prices with less average allocation per bin for a fixed
          budget. Coverage is not a prediction of fees, returns, or safety. Price movement can
          change token composition in a real position.
        </p>
      </section>
      <div className="game-learning">
        <p>
          In real DLMM pools, neighboring prices are spaced by a bin step. This lab uses a 1%
          illustrative step, normalized around 100 units.
        </p>
        <a
          href="https://docs.meteora.ag/core-products/dlmm/what-is-dlmm"
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Go deeper in the docs <ArrowUpRight size={16} />
        </a>
      </div>
      <Disclaimer compact />
    </section>
  );
}
