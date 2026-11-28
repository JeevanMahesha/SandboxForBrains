import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

/**
 * Production bundle budgets (angular.json). Node only, so it lives in the `rules` project next to
 * the other build/deploy-configuration tests. It asserts the budgets stay tight enough to catch a
 * regression: the old 1 MB warn / 2 MB error would let the initial bundle triple unnoticed.
 */

interface Budget {
  type: string;
  name?: string;
  baseline?: string;
  maximumWarning?: string;
  maximumError?: string;
}

const root = resolve(__dirname, '..', '..');
const angularJson = JSON.parse(readFileSync(resolve(root, 'angular.json'), 'utf8')) as {
  projects: Record<
    string,
    { architect: { build: { configurations: Record<string, { budgets?: Budget[] }> } } }
  >;
};
const budgets = angularJson.projects['ProfileManager'].architect.build.configurations['production']
  .budgets as Budget[];

/** Angular budget sizes: bytes, `123b`, `123kb`, `123mb` (kb = 1024 bytes). */
const toBytes = (value: string | undefined): number => {
  const match = /^(\d+(?:\.\d+)?)\s*(b|kb|mb)?$/i.exec(value ?? '');
  if (!match) {
    throw new Error(`Not an absolute size: ${value}`);
  }
  const unit = (match[2] ?? 'b').toLowerCase();
  return Number(match[1]) * { b: 1, kb: 1024, mb: 1024 * 1024 }[unit]!;
};

const budgetFor = (type: string, name?: string) =>
  budgets.find((budget) => budget.type === type && budget.name === name);

test.describe('production bundle budgets', () => {
  test('the initial bundle error threshold is well under the old 2 MB', () => {
    const initial = budgetFor('initial');
    expect(initial, 'an initial budget').toBeDefined();
    // The measured initial total is about 630 kB; leave headroom, but a 1 MB error means a
    // regression that grows the bundle by more than half still fails the build.
    expect(toBytes(initial!.maximumError)).toBeLessThanOrEqual(1024 * 1024);
  });

  test('every budget warns before it errors', () => {
    for (const budget of budgets) {
      const label = `${budget.type}${budget.name ? ` ${budget.name}` : ''}`;
      expect(toBytes(budget.maximumWarning), `${label} warning`).toBeLessThan(
        toBytes(budget.maximumError),
      );
    }
  });

  test('the initial warning sits below the old 1 MB so growth shows up early', () => {
    expect(toBytes(budgetFor('initial')!.maximumWarning)).toBeLessThan(1024 * 1024);
  });

  test('each lazy route chunk and any single script has its own budget', () => {
    expect(budgetFor('anyScript'), 'an anyScript budget').toBeDefined();
    for (const name of [
      'profiles-list',
      'profiles-list-desktop-view',
      'profiles-list-mobile-view',
      'profile',
      'profile-wizard',
      'login',
    ]) {
      expect(budgetFor('bundle', name), `a bundle budget for ${name}`).toBeDefined();
    }
  });

  test('component stylesheets keep a budget', () => {
    expect(budgetFor('anyComponentStyle'), 'an anyComponentStyle budget').toBeDefined();
  });
});
