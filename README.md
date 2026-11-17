# Meteora Playground

**Understand liquidity. Play the market. Explore Meteora.**

An independent, responsive educational arcade built with Next.js and TypeScript. Play a seeded 60-second liquidity game, experiment with allocation ranges, and discover Meteora's three requested products. No wallet, API key, backend or real transaction is needed.

## Run locally

Requires Node.js 20.9 or newer (validated with Node 24.15.0) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 . The development server binds to loopback. If that port is occupied, stop your own previous server or choose a different port.

To run the exported production application:

```sh
npm run build
npm start
```

`out/` contains the deployable static site. `npm start` serves that directory with clipboard integration disabled for reliable Windows startup. No environment variables are required locally. Optional `NEXT_PUBLIC_SITE_URL` sets the absolute social-preview URL at build time; set it to your final HTTPS origin before publishing.

## Experiences

### BIN RUNNER — `/#game`

Allocate chips across 15 bins and cover a moving simulated price. A 60-second round passes through sideways, trending and volatile conditions. Rookie, Strategist and Expert use different chip budgets and miss penalties. Tap or click to add a chip; a full three-chip bin cycles to empty. The Remove tool reclaims one chip. Keyboard users can Tab to bins, move with arrow keys and allocate with Enter/Space.

Covered activity scores `(10 + 5 × active chips) × activity + 2 × min(previous streak, 10)`. Uncovered activity subtracts 8/12/18 points by difficulty, with a floor of zero. Activity bursts double the base term. These rules are original game mechanics, not Meteora fees. A fixed seed reproduces the price path. Reallocation is free and immediate; this is explicitly a simplification.

The tutorial opens on the first visit. Sound starts muted and is independently controlled. Pause freezes time and allocation. Leaving the game or hiding the browser tab pauses the round. Reset returns the same challenge to its empty ready state. Each difficulty retains five personal scores in browser local storage. Scores are local and editable, not a verified global ranking. Copy score prepares text for manual sharing; it never posts automatically.

### Range Lab — `/#lab`

Adjust inclusive range bounds, budget, distribution shape and current price. Narrow/Medium/Wide comparisons always use the same current budget and shape. Spot, Curve and Bid-Ask illustrations explain coverage versus concentration. Animation is opt-in and pauses when leaving the view or hiding the tab. All allocation figures are normalized virtual units; no returns or historical performance are computed.

### Meteora Explorer — `/#explorer`

Product tabs explain DLMM, DAMM v2 and DBC, with original diagrams, verified documentation links and official app/launch-guide exits. A three-choice interest quiz suggests what to learn next, not what to invest in.

## Architecture

```text
src/app/                    App Router entry, metadata, loading UI, CSS tokens/layouts
src/components/Playground   Navigation, landing page, persistent experience mounting
src/components/game/       Game UI, accessible bin board, chart and native-dialog tutorial
src/components/lab/        Range simulator and comparison UI
src/components/explorer/   Product content, diagrams and discovery quiz
src/lib/game.ts            Pure reducer and lifecycle; no browser dependencies
src/lib/market.ts          Seeded random walk, regimes and illustrative bin pricing
src/lib/scoring.ts         Isolated game points formula
src/lib/range.ts           Normalized liquidity distribution math
src/lib/storage.ts         Validation, bounded score persistence
public/assets/             Original vector and raster social artwork
tests/                     Unit/state/content tests and Chrome browser tests
docs/                      Sources, product decisions, credits, competition and delivery notes
output/playwright/         Real browser screenshots for review and demo preparation
```

React drives interaction state. SVG and CSS provide diagrams and transitions without an animation-library runtime. Fonts ship locally through Geist. Interval effects have cleanup, hidden views do not continue simulating, and Web Audio nodes disconnect after playback. The native dialog supplies modal focus containment and Escape handling. Reduced motion disables transitions. No analytics, tracking, service worker, wallet SDK or financial API is installed.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

The browser suite uses installed Google Chrome (`channel: 'chrome'`) and starts the production preview if needed. It uses Playwright's clock for deterministic full-round testing. Install Chrome if unavailable, or change the test channel and install the matching Playwright browser. Screenshots are written to `output/playwright/`; failure traces go to ignored `test-results/`. Full results and limits: [docs/TESTING.md](docs/TESTING.md).

## Research and handoff

- [Research and official sources](docs/RESEARCH.md)
- [Product design and simulation boundaries](docs/PRODUCT_NOTES.md)
- [Asset credits](docs/ASSET_CREDITS.md)
- [Three checked competition posts and storyboards](docs/COMPETITION.md)
- [Demo recording guide](docs/DEMO_GUIDE.md)
- [Deployment steps](docs/DEPLOYMENT.md)

Meteora product claims were checked against official documentation and SDK READMEs on 17 November 2026. Competition rules were supplied by the project owner. Nothing has been published to X or deployed publicly.

## Educational boundaries

This is a community project, not an official or endorsed Meteora application. Price, activity, budgets and scores are illustrative. The simulation omits real token inventory changes, liquidity consumption, transaction costs, impermanent loss and protocol fee math. Wider coverage does not guarantee profit or eliminate risk. The production UI explains these boundaries and links to primary sources.
