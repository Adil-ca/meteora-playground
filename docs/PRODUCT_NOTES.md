# Product and architecture decisions

## Experience plan

1. Home: oversized editorial title, original bin artwork, prominent Play Now, three experience cards.
2. BIN RUNNER: 60-second seeded challenge, 15 bins, 12/9/6 chips for Rookie/Strategist/Expert, maximum 3 per bin. Tap to cycle 0–3 chips; reclaim via the remove tool. Every second a price step produces activity. Score = (10 + 5 × active chips) × activity + 2 × min(previous streak, 10). Miss = −8/−12/−18, clamped to zero. Burst activity doubles base points. All values are game points.
3. Range Lab: 21 bins, geometric illustrative price ladder, uniform/center/edge allocation, inclusive adjustable bounds, virtual budget, animated or manual price. Compare three widths with the same budget. No P&L.
4. Explorer: three product explanations, original diagrams and interest-based discovery quiz. Official documentation and application exits.

## Engineering

Next.js App Router + TypeScript, static export, React client experiences, Lucide icons, CSS design tokens and transitions. No animation framework is needed for these small SVG/CSS transitions. Pure game market/scoring/state modules, a reducer UI, isolated lab math, guarded browser storage and Web Audio. Tests cover deterministic market behavior, state transitions, budget constraints, scoring and range calculations. Browser QA covers desktop/mobile and full round lifecycle.

## Interaction and accessibility

Native buttons support mouse, touch, Enter and Space. Bin grids additionally support arrow-key navigation. Visible focus, textual active/allocated states, pause controls, reduced-motion handling, auto-pause on hidden tab or leaving the game, independent opt-in sound. Mobile uses two rows of bin controls, larger touch targets and a compact game header. No wallet or external account.

## Assumptions

All development stays local until deployment approval. Scores are stored only on this browser and can be cleared. Leaderboards are per difficulty; they are not verified competitive records. A fixed seed permits replay of the same market. Each round cycles sideways, trending and volatile conditions in 20-second stages. No API keys are needed.
