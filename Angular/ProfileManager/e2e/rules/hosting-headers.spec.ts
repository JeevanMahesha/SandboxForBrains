import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';

/**
 * Hosting security headers (firebase.json). Node only, so it lives in the `rules` project next
 * to the other deploy-configuration tests: there is no Hosting emulator in the e2e setup, so this
 * asserts the config the deploy will send.
 */

interface HeaderRule {
  source?: string;
  regex?: string;
  headers: { key: string; value: string }[];
}

const root = resolve(__dirname, '..', '..');
const firebaseJson = JSON.parse(readFileSync(resolve(root, 'firebase.json'), 'utf8')) as {
  hosting: { headers?: HeaderRule[] };
};
const rules = firebaseJson.hosting.headers ?? [];

/** Every header a rule sets, keyed by (lower-cased) header name. */
const headersOf = (rule: HeaderRule) =>
  Object.fromEntries(rule.headers.map(({ key, value }) => [key.toLowerCase(), value]));

/** Headers of the rule(s) that apply to every path (`**`). */
const everyPage = Object.assign(
  {},
  ...rules.filter((rule) => rule.source === '**').map((rule) => headersOf(rule)),
) as Record<string, string>;

/** Parses a CSP into directive name -> list of source expressions. */
const parseCsp = (policy: string) =>
  new Map(
    policy
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [name, ...sources] = part.split(/\s+/);
        return [name, sources] as const;
      }),
  );

test.describe('hosting security headers', () => {
  test('enforces frame-ancestors none, with X-Frame-Options for old browsers', () => {
    const enforced = parseCsp(everyPage['content-security-policy'] ?? '');
    expect(enforced.get('frame-ancestors')).toEqual(["'none'"]);
    // Only the clickjacking directive is enforced: the full policy is report-only for now.
    expect([...enforced.keys()]).toEqual(['frame-ancestors']);
    expect(everyPage['x-frame-options']).toBe('DENY');
  });

  test('ships the full CSP as report-only', () => {
    const policy = parseCsp(everyPage['content-security-policy-report-only'] ?? '');
    expect(policy.get('default-src')).toEqual(["'self'"]);
    expect(policy.get('object-src')).toEqual(["'none'"]);
    expect(policy.get('base-uri')).toEqual(["'self'"]);
    expect(policy.get('form-action')).toEqual(["'self'"]);
    const connect = policy.get('connect-src') ?? [];
    expect(connect).toContain('https://*.googleapis.com');
    expect(connect).toContain('wss://*.googleapis.com');
    // No third-party fonts any more (PERF-5): the policy must not re-open the Google font hosts.
    expect(policy.get('font-src')).toEqual(["'self'", 'data:']);
    expect(policy.get('style-src')).toEqual(["'self'", "'unsafe-inline'"]);
    // frame-ancestors is ignored (and warned about) in a report-only policy, so it is not repeated.
    expect(policy.has('frame-ancestors')).toBe(false);
  });

  test('sets nosniff, referrer, permissions and HSTS headers', () => {
    expect(everyPage['x-content-type-options']).toBe('nosniff');
    expect(everyPage['referrer-policy']).toBe('strict-origin-when-cross-origin');
    for (const feature of ['camera', 'microphone', 'geolocation']) {
      expect(everyPage['permissions-policy']).toContain(`${feature}=()`);
    }
    expect(everyPage['strict-transport-security']).toMatch(/max-age=31536000/);
    // Subdomain/preload commitments are a deliberate, separate decision.
    expect(everyPage['strict-transport-security']).not.toMatch(/includeSubDomains|preload/i);
  });

  test('caches hashed assets for a year and never caches the app shell', () => {
    const hashed = rules.find((rule) => rule.regex && /\.\(?js/.test(rule.regex));
    expect(hashed, 'a rule for hashed js/css/font assets').toBeDefined();
    expect(headersOf(hashed!)['cache-control']).toBe('public, max-age=31536000, immutable');
    // The pattern matches Angular's hashed names, not the unhashed theme-init.js.
    const pattern = new RegExp(hashed!.regex!);
    for (const name of ['/main-ABCPCOY4.js', '/chunk-9W-Mc5xu.js', '/styles-YE6YV2KN.css']) {
      expect(pattern.test(name), name).toBe(true);
    }
    for (const name of ['/theme-init.js', '/index.html', '/login', '/favicon.ico']) {
      expect(pattern.test(name), name).toBe(false);
    }

    const noCache = rules.filter((rule) => headersOf(rule)['cache-control'] === 'no-cache');
    const sources = noCache.map((rule) => rule.source);
    expect(sources).toContain('/theme-init.js');
    // Deep links (/login, /profiles/new) are rewritten to index.html, so a rule for index.html
    // alone would not cover them: it must match every path that is not a static asset.
    expect(sources.some((source) => source?.startsWith('!'))).toBe(true);
  });

  test('index.html has no inline script that the CSP would block', () => {
    const html = readFileSync(resolve(root, 'src', 'index.html'), 'utf8');
    const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
    expect(inline).toHaveLength(0);
    expect(html).toContain('<script src="theme-init.js">');
    expect(existsSync(resolve(root, 'public', 'theme-init.js'))).toBe(true);
  });

  test('every inline script in the built index.html is covered by a CSP hash', () => {
    const built = resolve(root, 'dist', 'ProfileManager', 'browser', 'index.html');
    test.skip(!existsSync(built), 'run `pnpm build` first to check the built index.html');
    const scriptSrc =
      parseCsp(everyPage['content-security-policy-report-only'] ?? '').get('script-src') ?? [];
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    const html = readFileSync(built, 'utf8');
    for (const [, body] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
      const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
      expect(scriptSrc, `inline script ${body.slice(0, 40)}…`).toContain(hash);
    }
  });
});
