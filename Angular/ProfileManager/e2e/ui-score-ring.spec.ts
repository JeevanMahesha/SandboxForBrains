import { inflateSync } from 'node:zlib';
import type { Locator } from '@playwright/test';
import { makeProfile, seedProfiles } from './support/emulator';
import { expect, profileRows, test } from './support/fixtures';

/** Decodes an 8-bit, non-interlaced RGB/RGBA PNG (what Playwright screenshots are). */
function decodePng(png: Buffer) {
  const width = png.readUInt32BE(16);
  const channels = png[25] === 6 ? 4 : 3;
  const chunks: Buffer[] = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    if (png.toString('ascii', offset + 4, offset + 8) === 'IDAT') {
      chunks.push(png.subarray(offset + 8, offset + 8 + length));
    }
    offset += 12 + length;
  }
  const raw = inflateSync(Buffer.concat(chunks));
  const stride = width * channels;
  const height = raw.length / (stride + 1);
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    for (let i = 0; i < stride; i++) {
      const x = raw[y * (stride + 1) + 1 + i];
      const left = i >= channels ? pixels[y * stride + i - channels] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + i] : 0;
      const upLeft = y > 0 && i >= channels ? pixels[(y - 1) * stride + i - channels] : 0;
      let value = x;
      if (filter === 1) value = x + left;
      else if (filter === 2) value = x + up;
      else if (filter === 3) value = x + ((left + up) >> 1);
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value = x + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft);
      }
      pixels[y * stride + i] = value & 255;
    }
  }
  return (px: number, py: number) => {
    const o = Math.round(py) * stride + Math.round(px) * channels;
    return [pixels[o], pixels[o + 1], pixels[o + 2]];
  };
}

/** Largest per-channel difference (0-255) between two colours. */
const distance = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));

/**
 * Colour inside the ring's hole (left of the digit) versus the card just outside the ring, both
 * read from a real screenshot of the card.
 */
async function holeVersusSurround(card: Locator, ring: Locator) {
  const cardBox = (await card.boundingBox())!;
  const ringBox = (await ring.boundingBox())!;
  const pixelAt = decodePng(await card.screenshot());
  const centreY = ringBox.y + ringBox.height / 2 - cardBox.y;
  const hole = pixelAt(ringBox.x + ringBox.width * 0.28 - cardBox.x, centreY);
  const surround = pixelAt(ringBox.x - 6 - cardBox.x, centreY);
  return { hole, surround, delta: distance(hole, surround) };
}

for (const scheme of ['light', 'dark'] as const) {
  test(`score ring hole matches the card surface (${scheme})`, async ({ page, loginAsAdmin }) => {
    await seedProfiles([makeProfile(0, { starMatchScore: 8 })]);
    await page.emulateMedia({ colorScheme: scheme });
    await loginAsAdmin();

    const card = profileRows(page).first();
    const ring = card.getByRole('img', { name: 'Star match score 8 of 10' });
    await expect(ring).toBeVisible();

    const { hole, surround, delta } = await holeVersusSurround(card, ring);
    console.log(`MEASURE ${scheme}: hole=${hole} surround=${surround} delta=${delta}`);
    // The hole shows the card itself, so only anti-aliasing noise may remain.
    expect(delta, `hole ${hole} vs card ${surround}`).toBeLessThanOrEqual(3);
  });
}

test('ring thickness grows with the ring size', async ({ page, loginAsAdmin }) => {
  await seedProfiles([makeProfile(0, { starMatchScore: 8 })]);
  await loginAsAdmin();

  // The list card ring is 44px; the profile drawer's score ring is 56px.
  const cardRing = profileRows(page).first().getByRole('img', { name: 'Star match score 8 of 10' });
  await expect(cardRing).toBeVisible();
  const bandOf = (ring: Locator) =>
    ring.evaluate((element) => {
      const band = element.firstElementChild as HTMLElement;
      const mask = getComputedStyle(band).maskImage || getComputedStyle(band).webkitMaskImage;
      // radial-gradient(circle closest-side, transparent calc(100% - Npx - …), #000 …)
      return { mask, size: element.getBoundingClientRect().width };
    });
  const small = await bandOf(cardRing);

  await profileRows(page)
    .first()
    .getByRole('button', { name: /^View / })
    .click();
  const drawerRing = page
    .getByRole('dialog')
    .getByRole('img', { name: 'Star match score 8 of 10' });
  await expect(drawerRing).toBeVisible();
  const large = await bandOf(drawerRing);

  // The hole is cut with a radial mask: transparent up to (radius - thickness), opaque after.
  const thickness = (mask: string) => {
    const match = /calc\(100% - ([\d.]+)px/.exec(mask);
    expect(match, `ring band mask: ${mask}`).not.toBeNull();
    return Number(match![1]);
  };
  expect(large.size).toBeGreaterThan(small.size);
  expect(thickness(large.mask)).toBeGreaterThan(thickness(small.mask));
});
