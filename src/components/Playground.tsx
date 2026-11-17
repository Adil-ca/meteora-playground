'use client';
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  FlaskConical,
  Gamepad2,
  MousePointer2,
  Orbit,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Brand } from './Brand';
import { BinArt } from './BinArt';
import { Disclaimer } from './Disclaimer';
import { BinRunner } from './game/BinRunner';
import { RangeLab } from './lab/RangeLab';
import { Explorer } from './explorer/Explorer';
export type View = 'home' | 'game' | 'lab' | 'explorer';
const links: { view: View; title: string }[] = [
  { view: 'home', title: 'Overview' },
  { view: 'game', title: 'Bin Runner' },
  { view: 'lab', title: 'Range Lab' },
  { view: 'explorer', title: 'Explorer' },
];
export function Playground() {
  const [view, setView] = useState<View>('home');
  useEffect(() => {
    const sync = () => {
      const next = location.hash.slice(1);
      setView(['game', 'lab', 'explorer'].includes(next) ? (next as View) : 'home');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  function navigate(next: View) {
    setView(next);
    location.hash = next;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand-button"
            onClick={() => navigate('home')}
            aria-label="Meteora Playground home"
          >
            <Brand />
          </button>
          <nav aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.view}
                href={`#${link.view}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.view);
                }}
                className={view === link.view ? 'active' : ''}
                aria-current={view === link.view ? 'page' : undefined}
              >
                {link.title}
              </a>
            ))}
          </nav>
          <a
            className="official-link"
            href="https://app.meteora.ag/"
            target="_blank"
            rel="noreferrer"
          >
            Visit Meteora <ArrowUpRight size={15} />
          </a>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {view === 'home' && <Home navigate={navigate} />}
        <div hidden={view !== 'game'}>
          <BinRunner visible={view === 'game'} />
        </div>
        <div hidden={view !== 'lab'}>
          <RangeLab visible={view === 'lab'} />
        </div>
        {view === 'explorer' && <Explorer />}
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Brand small />
          <p>
            A little less reading.
            <br />A lot more understanding.
          </p>
          <a href="https://docs.meteora.ag/" target="_blank" rel="noreferrer">
            Official documentation <ArrowUpRight size={15} />
          </a>
        </div>
        <Disclaimer />
        <div className="footer-bottom">
          <span>Independent by design. Made for the curious.</span>
          <span>
            METEORA PLAYGROUND <span className="footer-plus">✳</span> 2026
          </span>
        </div>
      </footer>
    </>
  );
}
function Home({ navigate }: { navigate: (v: View) => void }) {
  return (
    <div className="home">
      <section className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> THE HANDS-ON SIDE OF DEFI
          </div>
          <h1>
            Liquidity.
            <br />
            Meet <span>play.</span>
            <svg className="title-star" viewBox="0 0 60 60" aria-hidden="true">
              <path
                d="M30 0v60M0 30h60M9 9l42 42M9 51L51 9"
                stroke="currentColor"
                strokeWidth="7"
              />
            </svg>
          </h1>
          <p className="hero-tagline">
            Understand liquidity. Play the market.
            <br />
            Explore Meteora.
          </p>
          <p className="hero-description">
            Turn “how does this work?” into “one more round.”
            <br className="desktop-break" /> Three interactive experiences. No real funds.
          </p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => navigate('game')}>
              <Gamepad2 size={19} /> Play Now <ArrowUpRight size={18} />
            </button>
            <button
              className="text-button"
              onClick={() =>
                document
                  .getElementById('experiences')
                  ?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'instant'
                      : 'smooth',
                  })
              }
            >
              Explore the playground <ArrowDown size={16} />
            </button>
          </div>
          <div className="hero-notes">
            <span>
              <ShieldCheck size={14} /> No wallet needed
            </span>
            <span>
              <MousePointer2 size={14} /> Learn by doing
            </span>
            <span>100% simulated</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="art-heading">
            <span className="mono">THE LIQUIDITY PLAYGROUND</span>
            <span className="art-code">FIG. 001</span>
          </div>
          <BinArt />
          <div className="art-caption">
            <span>
              <i className="legend-square coral" /> A little strategy goes a long way.
            </span>
            <span className="mono">15 BINS / YOUR MOVE</span>
          </div>
          <div className="floating-note">
            <span className="note-cross">+</span>
            <span>
              Put your liquidity
              <br />
              <strong>where the action is.</strong>
            </span>
            <svg viewBox="0 0 46 46" aria-hidden="true">
              <path d="M5 7h33v33M38 7L6 39" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </section>
      <div className="ticker-strip">
        <div>
          <span>
            <span className="cross">✳</span> LESS THEORY, MORE PLAY
          </span>
          <span>PLACE. ADAPT. REPEAT.</span>
          <span>
            <span className="cross">✳</span> CURIOSITY IS YOUR EDGE
          </span>
          <span>NO TOKENS REQUIRED.</span>
        </div>
      </div>
      <section className="experiences section-shell" id="experiences">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CHOOSE YOUR NEXT MOVE</div>
            <h2>
              One playground.
              <br />
              Three ways in.
            </h2>
          </div>
          <p>
            Start with a game. Stay for the lightbulb moment.
            <br />
            There’s no wrong place to begin.
          </p>
        </div>
        <div className="experience-grid">
          <button className="experience-card game-card" onClick={() => navigate('game')}>
            <div className="card-top">
              <span className="mono">01 / PLAY</span>
              <span className="tag coral-tag">THE MAIN EVENT</span>
            </div>
            <div className="card-illustration arcade-illustration">
              <div className="arcade-line" />
              {[25, 42, 66, 86, 64, 44, 28].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} className={i === 3 ? 'lit' : ''} />
              ))}
              <span className="pixel-runner">+</span>
            </div>
            <div className="card-title">
              <h3>BIN RUNNER</h3>
              <span className="circle-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <p>
              The market moves. Can you keep up?
              <br />
              Place your liquidity. Chase the high score.
            </p>
            <div className="card-bottom">
              <span>
                <Gamepad2 size={14} /> Arcade strategy
              </span>
              <span>60 sec / round</span>
            </div>
          </button>
          <button className="experience-card lab-card" onClick={() => navigate('lab')}>
            <div className="card-top">
              <span className="mono">02 / EXPERIMENT</span>
              <FlaskConical size={18} />
            </div>
            <div className="card-illustration lab-illustration">
              <div className="range-bracket">YOUR RANGE</div>
              {[15, 20, 30, 45, 70, 90, 70, 45, 30, 20, 15].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
              <i />
            </div>
            <div className="card-title">
              <h3>Range Lab</h3>
              <span className="circle-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <p>
              Narrow or wide? Spread or concentrate?
              <br />
              Move the sliders. See the trade-offs.
            </p>
            <div className="card-bottom">
              <span>
                <AudioLines size={14} /> Interactive simulator
              </span>
              <span>Your pace</span>
            </div>
          </button>
          <button className="experience-card explorer-card" onClick={() => navigate('explorer')}>
            <div className="card-top">
              <span className="mono">03 / DISCOVER</span>
              <Orbit size={18} />
            </div>
            <div className="card-illustration explorer-illustration">
              <span>DLMM</span>
              <span>
                DAMM<span className="v2">v2</span>
              </span>
              <span>DBC</span>
              <svg viewBox="0 0 260 120" aria-hidden="true">
                <path d="M50 60h160M130 20v80" stroke="currentColor" strokeDasharray="3 6" />
              </svg>
            </div>
            <div className="card-title">
              <h3>Meteora Explorer</h3>
              <span className="circle-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <p>
              Three products. Different possibilities.
              <br />
              Find your starting point in the ecosystem.
            </p>
            <div className="card-bottom">
              <span>
                <Orbit size={14} /> Guided discovery
              </span>
              <span>Beginner friendly</span>
            </div>
          </button>
        </div>
      </section>
      <section className="about section-shell">
        <div className="about-mark">
          <Sparkles size={36} />
        </div>
        <div>
          <div className="eyebrow">COMPLICATED CONCEPTS. SIMPLE AHA MOMENTS.</div>
          <h2>
            You don’t need to be an LP
            <br />
            to think like one.
          </h2>
        </div>
        <div>
          <p>
            Liquidity is easier to understand when you can move it around. This independent
            playground turns Meteora’s building blocks into small, hands-on experiments.
          </p>
          <a href="https://docs.meteora.ag/" target="_blank" rel="noreferrer" className="text-link">
            Curiosity, backed by the docs <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
