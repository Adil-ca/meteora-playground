'use client';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Layers,
  Orbit,
  Rocket,
} from 'lucide-react';
import { Disclaimer } from '../Disclaimer';
type ProductId = 'dlmm' | 'damm' | 'dbc';
const products = {
  dlmm: {
    name: 'DLMM',
    full: 'Dynamic Liquidity Market Maker',
    category: 'PRECISION, ONE BIN AT A TIME',
    description: 'Put liquidity at specific prices.',
    explanation:
      'Liquidity sits in discrete price bins. Swaps use the active bin’s fixed price, then move to another bin as available liquidity is consumed.',
    features: [
      'Choose a range and liquidity shape',
      'One active price bin at a time',
      'Volatility-responsive dynamic fees',
    ],
    detail:
      'Spot spreads liquidity across a range, Curve emphasizes the middle, and Bid-Ask emphasizes its edges. Swaps within a bin have a fixed price; a swap spanning bins can still experience price impact.',
    docs: 'https://docs.meteora.ag/core-products/dlmm/what-is-dlmm',
    app: 'https://app.meteora.ag/',
    appLabel: 'Explore official pools',
    question: 'Concentrated liquidity',
    answer:
      'Start with DLMM. Its discrete bins make it a useful place to explore where liquidity is placed and what happens when price leaves a position.',
    icon: Layers,
  },
  damm: {
    name: 'DAMM v2',
    full: 'Dynamic Automated Market Maker',
    category: 'CONFIGURABLE POOL DESIGN',
    description: 'Configure how a pool works.',
    explanation:
      'A constant-product AMM with shared liquidity, configurable pool settings and NFT-based positions. Pools can use a fixed concentrated range or full-range compounding.',
    features: [
      'Configurable fees and launch settings',
      'Position NFTs represent LP ownership',
      'Liquidity locks and reward options',
    ],
    detail:
      'Unlike DLMM’s individually allocated bins, DAMM v2 uses a constant-product pool model. Pool configuration determines range and fee behavior; concentrated and compounding modes have different constraints.',
    docs: 'https://docs.meteora.ag/core-products/damm-v2/what-is-damm-v2',
    app: 'https://app.meteora.ag/create',
    appLabel: 'Explore pool creation',
    question: 'Liquidity pool configurations',
    answer:
      'Explore DAMM v2. Learn how constant-product pools combine range choices, fee configuration and position ownership.',
    icon: Orbit,
  },
  dbc: {
    name: 'DBC',
    full: 'Dynamic Bonding Curve',
    category: 'FROM PRICE DISCOVERY TO POOL',
    description: 'Understand a token’s launch journey.',
    explanation:
      'Trading starts in a virtual pool against a configurable bonding curve. Reaching the quote-reserve threshold completes the curve and enables migration into DAMM liquidity.',
    features: [
      'Configurable price discovery',
      'Up to 16 curve segments',
      'New launches migrate to DAMM v2',
    ],
    detail:
      'Curve completion and migration are separate stages. Accumulated quote assets and a configured token amount seed the graduated pool. Legacy pools configured for DAMM v1 retain their older path.',
    docs: 'https://docs.meteora.ag/core-products/dbc/what-is-dbc',
    app: 'https://launch.meteora.ag/',
    appLabel: 'Explore the launch guide',
    question: 'Token launch mechanisms',
    answer:
      'Start with Dynamic Bonding Curve. Follow the path from configurable price discovery to the migration threshold and a graduated DAMM pool.',
    icon: Rocket,
  },
};
function ProductDiagram({ id }: { id: ProductId }) {
  if (id === 'dlmm')
    return (
      <div className="product-diagram">
        <div className="diagram-bins">
          {[20, 35, 55, 85, 100, 85, 55, 35, 20].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className={i === 4 ? 'active' : ''} />
          ))}
        </div>
        <div className="diagram-labels">
          <span>DISCRETE BINS</span>
          <span className="coral-text">↑ ACTIVE PRICE</span>
        </div>
      </div>
    );
  if (id === 'damm')
    return (
      <div className="product-diagram">
        <svg viewBox="0 0 300 150" role="img" aria-label="Conceptual constant-product curve">
          <path d="M35 10v115h245" fill="none" stroke="#65616b" />
          <path d="M48 12C58 85 96 107 276 115" fill="none" stroke="#b8a6ef" strokeWidth="4" />
          <circle cx="114" cy="94" r="7" fill="#b8a6ef" />
          <text x="185" y="50" fill="#b8a6ef" fontSize="19" fontFamily="monospace">
            x · y = k
          </text>
        </svg>
        <div className="diagram-labels">
          <span>CONSTANT-PRODUCT CORE</span>
          <span>CONCEPTUAL CURVE</span>
        </div>
      </div>
    );
  return (
    <div className="product-diagram">
      <svg
        viewBox="0 0 300 150"
        role="img"
        aria-label="Conceptual launch progression from curve to migration threshold"
      >
        <path d="M25 125H280M25 10V125" fill="none" stroke="#65616b" />
        <path
          d="M30 116C110 114 130 87 166 70S210 35 235 13"
          fill="none"
          stroke="#a9dbc5"
          strokeWidth="4"
        />
        <path d="M235 10v115" stroke="#a9dbc5" strokeDasharray="4 5" />
        <circle cx="235" cy="13" r="5" fill="#a9dbc5" />
        <text x="40" y="40" fill="#a9dbc5" fontSize="12" fontFamily="monospace">
          CURVE → POOL
        </text>
      </svg>
      <div className="diagram-labels">
        <span>PRICE DISCOVERY</span>
        <span>QUOTE THRESHOLD ↑</span>
      </div>
    </div>
  );
}
export function Explorer() {
  const [selected, setSelected] = useState<ProductId>('dlmm');
  const [answer, setAnswer] = useState<ProductId | null>(null);
  const product = products[selected];
  const Icon = product.icon;
  return (
    <section
      className="experience-page section-shell explorer-page"
      aria-labelledby="explorer-title"
    >
      <div className="page-heading">
        <div>
          <div className="eyebrow mint-text">03 / CONNECT THE DOTS</div>
          <h1 id="explorer-title">
            Meteora Explorer<span className="heading-cross mint-text">✳</span>
          </h1>
          <p>Three building blocks. A clearer picture.</p>
        </div>
        <span className="tag">
          <Compass size={14} /> YOUR ECOSYSTEM FIELD GUIDE
        </span>
      </div>
      <div className="explorer-tabs" role="tablist" aria-label="Meteora products">
        {(Object.keys(products) as ProductId[]).map((id, i) => {
          const I = products[id].icon;
          return (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={selected === id}
              aria-controls="product-panel"
              tabIndex={selected === id ? 0 : -1}
              onClick={() => setSelected(id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const ids = Object.keys(products) as ProductId[];
                  const next = ids[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
                  setSelected(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
              className={selected === id ? 'selected' : ''}
            >
              <I size={22} />
              <span>
                {products[id].name}
                <small>{products[id].full}</small>
              </span>
              <ArrowUpRight size={18} />
            </button>
          );
        })}
      </div>
      <article
        className={`product-panel ${selected}`}
        id="product-panel"
        role="tabpanel"
        aria-labelledby={`tab-${selected}`}
      >
        <div className="product-copy">
          <div className="eyebrow">{product.category}</div>
          <h2>{product.description}</h2>
          <p className="product-lead">{product.explanation}</p>
          <ul>
            {product.features.map((f) => (
              <li key={f}>
                <Check size={17} />
                {f}
              </li>
            ))}
          </ul>
          <div className="product-links">
            <a className="button primary" href={product.docs} target="_blank" rel="noreferrer">
              <BookOpen size={16} /> Read the docs <ArrowUpRight size={16} />
            </a>
            <a className="text-link" href={product.app} target="_blank" rel="noreferrer">
              {product.appLabel} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="product-visual">
          <div className="product-icon">
            <Icon size={28} />
            <span className="mono">{product.name}</span>
          </div>
          <ProductDiagram id={selected} />
          <div className="product-detail">
            <span className="eyebrow">A LITTLE MORE CONTEXT</span>
            <p>{product.detail}</p>
          </div>
        </div>
      </article>
      <section className="discovery-quiz">
        <div>
          <div className="eyebrow">FIND YOUR FIRST RABBIT HOLE</div>
          <h2>
            What makes
            <br />
            you curious?
          </h2>
          <p>No right answer. Just a place to start.</p>
        </div>
        <div className="quiz-options">
          {(Object.keys(products) as ProductId[]).map((id) => (
            <button
              key={id}
              aria-pressed={answer === id}
              className={answer === id ? 'selected' : ''}
              onClick={() => {
                setAnswer(id);
                setSelected(id);
              }}
            >
              <span>{products[id].question}</span>
              {answer === id ? <Check size={18} /> : <ArrowRight size={18} />}
            </button>
          ))}
        </div>
        <div className="quiz-result" aria-live="polite">
          {answer ? (
            <>
              <span className="eyebrow">YOUR LEARNING PATH</span>
              <h3>{products[answer].name}</h3>
              <p>{products[answer].answer}</p>
              <a
                className="text-link"
                href={products[answer].docs}
                target="_blank"
                rel="noreferrer"
              >
                Continue exploring <ArrowUpRight size={16} />
              </a>
            </>
          ) : (
            <>
              <Compass size={28} />
              <h3>Follow your curiosity.</h3>
              <p>
                Choose an interest to reveal a product and a starting point in the official docs.
              </p>
            </>
          )}
          <span className="micro">Educational guidance, not an investment recommendation.</span>
        </div>
      </section>
      <Disclaimer />
    </section>
  );
}
