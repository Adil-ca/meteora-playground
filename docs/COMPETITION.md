# MeteoraMY Best Post Competition #1 — submission kit

Prepared for manual review. Nothing has been posted. Rules below are supplied by the project owner, not independently verified: 13–27 November 2026, closes 23:59 MYT (UTC+8), maximum three entries, each at most 280 characters, tag @meteora_my and include #MeteoraMYContest. The closing instant is 21:29 IST on 27 November 2026. Recheck the organizer's current announcement before publishing.

Character weighting and the 23-character URL rule were checked against [X's official counting documentation](https://docs.x.com/fundamentals/counting-characters).

These drafts are ASCII. Counts include every space, punctuation mark, account tag and hashtag, exclude surrounding Markdown formatting, and are enforced by `tests/content.test.ts`. The authoritative copy is `competition-posts.json`. Each has room for one appended URL: X ordinarily weights a URL as 23 characters; a preceding space would add 24. Recheck X's composer after adding the approved public demo URL. Do not post localhost links.

## Entry 1 — BIN RUNNER (234 characters)

Can you keep liquidity where the action is? I built BIN RUNNER: a 60-second, DLMM-inspired strategy game. Place chips, follow the price, beat your own score. Game points only, no real funds. Try the demo. @meteora_my #MeteoraMYContest

- Hook: a challenge the viewer can immediately understand.
- Interaction: play a round and share a personal score; avoid presenting the score as fees.
- Media: 20–25-second video, seed 20261117, Rookie. Show chip placement, a burst, repositioning and an actual result. If jumping ahead, label the edit “later in the round.”
- Storyboard: 0–3s title “Can you cover the next move?”; 3–7s place chips near bin 8; 7–12s start and follow the active marker; 12–17s reclaim and move a chip; 17–22s actual round result; 22–25s “Your move. Educational simulation.”
- Screenshots: `output/playwright/desktop-game.png` plus a real completed-round result captured during recording. Do not invent a leaderboard score.
- Thumbnail: tightly cropped bin board, coral active marker, title “15 BINS. YOUR MOVE.”; small “DLMM-inspired game” caption.
- **Recommended pinned entry:** this one. It offers the clearest immediate action and the strongest reason to share.

## Entry 2 — Range Lab (232 characters)

Narrow range or wide range? Move the price and see the difference. My Range Lab lets you reshape virtual liquidity and compare coverage across DLMM-inspired bins. No APY guesses, just hands-on learning. @meteora_my #MeteoraMYContest

- Hook: a concrete choice with a visible consequence.
- Interaction: try Narrow, drag price out of range, then select Wide at the same budget.
- Storyboard: 0–3s “Same budget. Different range.”; 3–7s choose Narrow and point at taller bars; 7–11s move price outside; 11–15s choose Wide and show coverage; 15–20s compare cards; 20–23s “Coverage is not a return forecast.”
- Screenshots: `output/playwright/desktop-range-lab.png` and `output/playwright/mobile-lab.png`.
- Thumbnail: a two-panel narrow/wide chart with equal “1,000 virtual units” labels and “WHERE WOULD YOU PLACE IT?”

## Entry 3 — Meteora Explorer (240 characters)

DLMM, DAMM v2, DBC... where do you start? I built Meteora Explorer to make the differences click. Pick what you're curious about, explore the visuals, then follow the official docs. Your first DeFi rabbit hole. @meteora_my #MeteoraMYContest

- Hook: recognizes the beginner's acronym overload.
- Interaction: choose a curiosity and follow the corresponding official docs.
- Storyboard: 0–3s “Three names. Three different jobs.”; 3–7s DLMM bins; 7–11s DAMM v2 constant-product diagram; 11–15s DBC curve-to-pool diagram; 15–20s choose a quiz answer; 20–23s show the documentation link and “Start with curiosity.”
- Screenshots: `output/playwright/desktop-explorer.png` and `output/playwright/mobile-explorer.png`.
- Thumbnail: three original product diagrams labeled “PLACE / CONFIGURE / LAUNCH”; no invented official product logos.

## Manual publication checklist

1. Review sources and claims; confirm the organizer's eligibility and originality rules.
2. Approve deployment separately, then append the public HTTPS demo URL to each draft. Expected counts with a single URL and one space: 258, 256 and 264 under X's usual URL weighting. The base drafts remain below 280 without relying on that behavior.
3. Attach the original recording and add concise alt text to still screenshots.
4. Check the live composer count, tag and hashtag. Keep a maximum of three entries.
5. Publish manually. No bots, engagement pods, fabricated scores or yield claims.

Suggested screenshot alt text: “Meteora Playground educational interface showing virtual liquidity across price bins; a coral marker indicates the simulated active price.” Adapt it to the actual image.
