import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
const artifacts = 'output/playwright';
test.beforeAll(() => {
  fs.mkdirSync(artifacts, { recursive: true });
});
async function openGame(page: Page) {
  await page.goto('/#game');
  const dialog = page.getByRole('dialog');
  await expect(page.getByRole('heading', { name: 'BIN RUNNER' })).toBeVisible();
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Close tutorial' }).click();
}
async function noOverflow(page: Page) {
  const state = await page.evaluate(() => ({
    width: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 8)
      .map((el) => el.className),
  }));
  expect(state.scroll, JSON.stringify(state)).toBeLessThanOrEqual(page.viewportSize()!.width);
}

test('desktop landing, navigation, artwork and no runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Liquidity. Meet play.' })).toBeVisible();
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).fontFamily)).toContain(
    'Geist',
  );
  await page.screenshot({ path: `${artifacts}/desktop-home.png`, fullPage: true });
  await noOverflow(page);
  for (const link of ['Range Lab', 'Explorer', 'Overview']) {
    await page.getByRole('navigation').getByRole('link', { name: link, exact: true }).click();
    await noOverflow(page);
  }
  await page.getByRole('button', { name: 'Play Now' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Place your chips.' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Let’s play' }).click();
  expect(errors).toEqual([]);
  const images = await page
    .locator('img')
    .evaluateAll((imgs) =>
      imgs.every(
        (i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0,
      ),
    );
  expect(images).toBeTruthy();
  const links = await page
    .locator('a[href^="https://"]')
    .evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(links.every((l) => new URL(l).hostname.endsWith('meteora.ag'))).toBeTruthy();
});

test('game complete lifecycle, scoring, sound, pause, replay and score persistence', async ({
  page,
}) => {
  await openGame(page);
  await page.clock.install();
  const game = page.locator('.game-page');
  await expect(game.getByRole('button', { name: 'Start round' })).toBeDisabled();
  for (let n = 5; n <= 10; n++)
    await game.getByRole('button', { name: new RegExp(`^Bin ${n},`) }).click();
  await expect(game.getByTestId('budget')).toHaveText('6 / 12');
  await game.getByRole('button', { name: 'Enable sound' }).click();
  await expect(game.getByRole('button', { name: 'Mute sound' })).toBeVisible();
  await game.getByRole('button', { name: 'Mute sound' }).click();
  await game.getByRole('button', { name: 'Start round' }).click();
  await page.clock.runFor(5000);
  expect(Number(await game.getByTestId('score').innerText())).toBeGreaterThan(0);
  await game.getByRole('button', { name: 'Pause', exact: true }).click();
  const time = await game.getByTestId('timer').innerText();
  await page.clock.runFor(5000);
  await expect(game.getByTestId('timer')).toHaveText(time);
  await expect(game.getByRole('button', { name: /^Bin 8,/ })).toBeDisabled();
  await game.getByRole('button', { name: 'Resume round', exact: true }).click();
  await page.clock.runFor(1000);
  await page.screenshot({ path: `${artifacts}/desktop-game.png`, fullPage: true });
  await page.getByRole('navigation').getByRole('link', { name: 'Range Lab', exact: true }).click();
  await page.clock.runFor(2000);
  await page.getByRole('navigation').getByRole('link', { name: 'Bin Runner', exact: true }).click();
  await expect(game.getByRole('heading', { name: 'Take a breath.' })).toBeVisible();
  await game.getByRole('button', { name: 'Resume round', exact: true }).click();
  await page.clock.runFor(54000);
  await expect(game.getByRole('region', { name: 'Round results' })).toBeVisible();
  await expect(game.getByTestId('timer')).toHaveText('00:00');
  const score = Number((await game.getByTestId('score').innerText()).replaceAll(',', ''));
  expect(score).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('meteora-playground.scores.v1') || '[]').length,
    ),
  ).toBe(1);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await game.getByRole('button', { name: 'Copy score', exact: true }).click();
  await expect(game.getByRole('button', { name: 'Copied!', exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('game points');
  await game.getByRole('button', { name: 'Play again' }).click();
  await expect(game.getByTestId('score')).toHaveText('0');
  await expect(game.getByTestId('budget')).toHaveText('12 / 12');
  await page.reload();
  await expect(game.locator('.leaderboard li')).toHaveCount(1);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await game.getByRole('button', { name: 'Clear scores' }).click();
  await expect(game.getByText('Your first score belongs here.')).toBeVisible();
});

test('game allocation cycles, keyboard input, difficulty and restart', async ({ page }) => {
  await openGame(page);
  const game = page.locator('.game-page');
  await game.getByRole('button', { name: /Expert/ }).click();
  await expect(game.getByTestId('budget')).toHaveText('6 / 6');
  const bin = game.getByRole('button', { name: /^Bin 8,/ });
  await bin.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await expect(bin).toHaveAccessibleName(/3 chips/);
  await page.keyboard.press('Enter');
  await expect(bin).toHaveAccessibleName(/0 chips/);
  await page.keyboard.press('ArrowRight');
  await expect(game.getByRole('button', { name: /^Bin 9,/ })).toBeFocused();
  await page.keyboard.press('Enter');
  await game.getByRole('button', { name: 'Start round' }).click();
  await game.getByRole('button', { name: 'Restart round' }).click();
  await expect(game.getByTestId('timer')).toHaveText('01:00');
  await expect(game.getByTestId('budget')).toHaveText('6 / 6');
  await expect(game.getByRole('button', { name: 'Start round' })).toBeDisabled();
});

test('range controls, presets, allocation shapes, animation and comparison', async ({ page }) => {
  await page.goto('/#lab');
  const lab = page.locator('.lab-page');
  await expect(lab.getByRole('heading', { name: /Range Lab/ })).toBeVisible();
  await lab.getByRole('button', { name: 'Narrow', exact: true }).click();
  await lab.locator('#lab-price').fill('20');
  await expect(lab.locator('.coverage-badge')).toHaveText('○ Out of range');
  await lab.getByRole('button', { name: 'Wide', exact: true }).click();
  await expect(lab.locator('.coverage-badge')).toHaveText('● In range');
  await lab.locator('#distribution').selectOption('Curve');
  await lab.locator('#virtual-budget').fill('1700');
  await expect(lab.getByText(/of your 1,700 virtual units/)).toBeVisible();
  await lab.locator('#low-bin').fill('18');
  await lab.locator('#high-bin').fill('5');
  await expect(lab.locator('#high-bin')).toHaveValue('18');
  await lab.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.clock.install();
  await lab.getByRole('button', { name: 'Animate', exact: true }).click();
  await page.clock.runFor(1400);
  await expect(lab.locator('#lab-price')).not.toHaveValue('10');
  await lab.getByRole('button', { name: 'Pause', exact: true }).click();
  const price = await lab.locator('#lab-price').inputValue();
  await page.clock.runFor(1400);
  await expect(lab.locator('#lab-price')).toHaveValue(price);
  await page.screenshot({ path: `${artifacts}/desktop-range-lab.png`, fullPage: true });
  await noOverflow(page);
});

test('all Explorer tabs, keyboard navigation and learning quiz', async ({ page }) => {
  await page.goto('/#explorer');
  await page.getByRole('link', { name: 'Skip to content' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await expect(page).toHaveURL(/#explorer$/);
  await page.getByRole('tab', { name: /DAMM v2/ }).click();
  await expect(page.getByRole('heading', { name: 'Configure how a pool works.' })).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(
    page.getByRole('heading', { name: 'Understand a token’s launch journey.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Read the docs/ })).toHaveAttribute(
    'href',
    'https://docs.meteora.ag/core-products/dbc/what-is-dbc',
  );
  await page.getByRole('button', { name: 'Concentrated liquidity', exact: true }).click();
  await expect(page.locator('.quiz-result')).toContainText('Start with DLMM.');
  await expect(page.getByRole('tab', { name: /^DLMM/ })).toHaveAttribute('aria-selected', 'true');
  await page.screenshot({ path: `${artifacts}/desktop-explorer.png`, fullPage: true });
});

test('mobile touch controls, responsive views and landscape', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  await noOverflow(page);
  await page.screenshot({ path: `${artifacts}/mobile-home.png`, fullPage: true });
  await page.getByRole('button', { name: 'Play Now' }).tap();
  await page.getByRole('button', { name: 'Close tutorial' }).tap();
  const game = page.locator('.game-page');
  await game.getByRole('button', { name: /^Bin 8,/ }).tap();
  await expect(game.getByTestId('budget')).toHaveText('11 / 12');
  await game.getByRole('button', { name: 'Remove', exact: true }).tap();
  await game.getByRole('button', { name: /^Bin 8,/ }).tap();
  await expect(game.getByTestId('budget')).toHaveText('12 / 12');
  await game.getByRole('button', { name: 'Place', exact: true }).tap();
  await game.getByRole('button', { name: /^Bin 8,/ }).tap();
  await game.getByRole('button', { name: 'Start round' }).tap();
  await game.getByRole('button', { name: 'Pause', exact: true }).tap();
  await noOverflow(page);
  await page.screenshot({ path: `${artifacts}/mobile-game.png`, fullPage: true });
  for (const view of ['Range Lab', 'Explorer']) {
    await page.getByRole('navigation').getByRole('link', { name: view, exact: true }).tap();
    await noOverflow(page);
    await page.screenshot({
      path: `${artifacts}/mobile-${view === 'Explorer' ? 'explorer' : 'lab'}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await noOverflow(page);
  await context.close();
});

test('320px and tablet layouts have no horizontal overflow', async ({ page }) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const hash of ['home', 'game', 'lab', 'explorer']) {
      await page.goto(`/#${hash}`);
      await expect(
        page.locator(
          hash === 'home'
            ? '.home'
            : hash === 'game'
              ? '.game-page'
              : hash === 'lab'
                ? '.lab-page'
                : '.explorer-page',
        ),
      ).toBeVisible();
      await noOverflow(page);
    }
  }
});

test('storage failure does not prevent tutorial or gameplay', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage disabled');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage disabled');
    };
  });
  await openGame(page);
  await page.getByRole('button', { name: /^Bin 8,/ }).click();
  await page.getByRole('button', { name: 'Start round' }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
});

test('real clock advances and all experience views load without console errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await openGame(page);
  await page.getByRole('button', { name: /^Bin 8,/ }).click();
  await page.getByRole('button', { name: 'Start round' }).click();
  await expect(page.getByTestId('timer')).not.toHaveText('01:00', { timeout: 4000 });
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  for (const name of ['Range Lab', 'Explorer', 'Overview'])
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
  expect(errors).toEqual([]);
});
