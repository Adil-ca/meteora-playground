# Demo recording guide

Use a local production build (`npm run build`, then `npm start`) or the approved deployment. Set the browser to 1440×1000 at 100% zoom for landscape capture; use 390×844 for a mobile walkthrough. The screenshots in `output/playwright/` are actual Chrome captures, not design mockups.

## Record cleanly

1. Close unrelated browser tabs and notifications. Keep private account information out of the frame.
2. Use the browser's local site data controls if a completely new tutorial/leaderboard state is wanted, or use the in-app Clear scores button. Do not clear unrelated browser data.
3. Begin muted for silent social playback. Enable sound only if your recorder captures system audio and you want the original synthesized cues.
4. Use Windows Snipping Tool screen recording or another recorder you already trust. Capture the app content; no wallet or real market screen is needed.
5. Follow each storyboard in `COMPETITION.md`. Keep cuts readable. Do not speed up a round without marking it as sped up; do not fabricate a result.
6. Export a readable MP4, ideally H.264, with the interface text large enough to read on a phone. Keep the educational-simulation label visible in a caption or end frame.

## Reproducible BIN RUNNER sequence

Choose Rookie and seed 20261117. Add one chip each to bins 5–10, leaving six chips to adapt during the run. Start, observe the sideways stage, then use Remove/Place as the market begins trending. The last 20 ticks are volatile. Record the actual final score and optionally use Copy score. The seed fixes the market path; timing of your allocations still affects results.

Pause is available anytime. Leaving the game view or hiding the browser tab also pauses; keep the app foregrounded while recording. Starting a mobile round scrolls to the compact console. Restart clears all allocation and results but retains difficulty and seed.

## Reproducible Range Lab sequence

Reset, retain 1,000 virtual units and Spot. Choose Narrow (bins 9–13). Move the price to bin 21: the position is out of range. Choose Wide (bins 1–21): the active price becomes covered and average allocation per bin decreases. Try Curve and Bid-Ask to show center and edge weighting. Mention that exact SDK amounts and returns are not modeled.

## Reproducible Explorer sequence

Show each tab, then choose “Token launch mechanisms” in the quiz. Point out the curve-to-pool visual and official documentation link. Explain that the quiz picks a learning topic, not an investment.

## Supplied visual assets

- `public/assets/social-card.png`: original 1200×630 raster social preview.
- `public/assets/social-card.svg`: editable original vector.
- `output/playwright/desktop-home.png`: full landing page.
- `output/playwright/desktop-game.png`: game during a tested round.
- `output/playwright/desktop-range-lab.png`: live simulator configuration.
- `output/playwright/desktop-explorer.png`: product discovery.
- `output/playwright/mobile-*.png`: mobile layouts.

No final edited demo video is claimed: this delivery includes storyboards, source assets, screenshots and recording instructions as requested.
