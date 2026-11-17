# Validation report

Validated on 17 November 2026, Windows, Node.js 24.15.0, npm 11.12.1, Next.js 16.4.6, React 19.3.1, TypeScript 6.0.3 and Playwright 1.65.1 using installed Google Chrome. Exact dependencies are locked in `package-lock.json`.

## Automated checks

| Check | Result | Evidence |
|---|---|---|
| TypeScript | Pass | `npm run typecheck`; also executed by production build |
| ESLint | Pass | `npm run lint` |
| Unit/state/content tests | 16 passing | `npm test` |
| Production build | Pass | `npm run build`; static `/` and not-found export in `out/` |
| Chrome interaction tests | 9 passing | `npm run test:e2e`; tests in `tests/browser/playground.spec.ts` |
| Dependency audit at installation | 0 reported vulnerabilities | npm install audit output; point-in-time observation |

## Covered behavior

- Cannot start without allocation; chip budget is conserved at every difficulty.
- Three-chip cycling, reclaiming chips, invalid indices and empty removals.
- Pause freezes market, allocation, score, timer and random seed; resume continues.
- Deterministic market paths, bounded prices over 100 seeds, all three regimes.
- Points formula, depth and burst multipliers, streak cap, misses and zero score floor.
- Exact 60-tick termination; reset preserves seed/difficulty and clears round state.
- A full browser round using Playwright's virtual clock, plus a separate real-clock countdown check.
- Local high-score write, reload, display and clear; corrupted records rejected.
- Completed-score clipboard copy verified; keyboard skip link preserves the selected experience.
- Storage-disabled fallback still permits tutorial and play.
- Tutorial progression, keyboard allocation and arrow focus, sound toggle.
- Navigation away pauses the game; coming back requires explicit resume.
- Range endpoints, allocation conservation, shape symmetry, current-price coverage.
- Lab presets, sliders, bounds clamping, budget changes, shape choice, animation and pause.
- Explorer product tabs, arrow navigation, official documentation links and quiz results.
- Console/page-error observation during navigation and real-clock gameplay: none observed.
- Bundled font applied; original SVG artwork and PNG social image available.
- Mobile touch allocation, remove, start and pause, reduced-motion setting and landscape layout.
- No horizontal overflow at 320, 390, 768, 844, 1024 and 1440 viewport widths in tested views.

## Visual review and fixes

Actual production screenshots are retained in `output/playwright/`. Reviewed the landing page, game, lab and responsive layouts. Fixed font-variable inheritance, an SVG/section class collision, narrow-screen title overflow, hidden skip-link screenshot leakage, and default button backgrounds. Narrow/Medium/Wide comparison bars share a scale, so equal budgets visibly demonstrate concentration. Mobile active rounds use a more compact console.

The tutorial's initial appearance is asynchronous after hydration. The browser helper explicitly waits for it rather than racing its mount. The Windows static preview disables clipboard integration because that integration stalled the initial preview process. Neither workaround weakens the application assertions.

## Scope and honest limitations

- Browser tests use Chrome, including mobile/touch emulation. No physical iPhone/Android device, Safari or Firefox run is claimed.
- Sound control and Web Audio initialization were exercised; human listening quality and every audio-device/browser policy were not independently assessed.
- Browser tests exercise the static production export, not a public host. Public HTTPS, CDN headers, social-card crawlers and final URL metadata require deployment verification.
- Primary external URLs were researched/opened, and link destinations checked in the app. A client's dynamic rendering or a future external-site change is outside this local test.
- Automated coverage is not a formal accessibility certification or smart-contract audit. This application contains no financial execution path.
- Contest rules were supplied by the owner. Character counts are tested; organizer eligibility is not asserted.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Install Google Chrome if unavailable. Playwright starts the local production server unless one already responds at `http://127.0.0.1:3000`. The test server is shut down by Playwright when it owns it. Any separate manual preview can be stopped with Ctrl+C. Tests create only local scores in isolated browser contexts and do not submit transactions or publish content.
