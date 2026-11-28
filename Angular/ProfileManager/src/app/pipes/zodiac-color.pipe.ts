import { Pipe, PipeTransform } from '@angular/core';
import { ZodiacKey } from '../constant/common.const';

// A light and a dark shade per sign, each at least 3:1 against the card in its theme (WCAG 1.4.11).
// Full class names so Tailwind can see them.
const ZODIAC_COLORS: Record<ZodiacKey, string> = {
  aries: 'text-red-500 dark:text-red-400',
  taurus: 'text-emerald-600 dark:text-emerald-400',
  gemini: 'text-yellow-700 dark:text-yellow-400',
  cancer: 'text-slate-500 dark:text-slate-400',
  leo: 'text-amber-700 dark:text-amber-400',
  virgo: 'text-lime-700 dark:text-lime-400',
  libra: 'text-pink-600 dark:text-pink-400',
  scorpio: 'text-red-800 dark:text-red-500',
  sagittarius: 'text-purple-500 dark:text-purple-400',
  capricorn: 'text-stone-600 dark:text-stone-400',
  aquarius: 'text-cyan-600 dark:text-cyan-400',
  pisces: 'text-teal-600 dark:text-teal-400',
};

@Pipe({ name: 'zodiacColor', standalone: true, pure: true })
export class ZodiacColorPipe implements PipeTransform {
  transform(zodiacSign: ZodiacKey | null): string {
    return zodiacSign ? (ZODIAC_COLORS[zodiacSign] ?? '') : '';
  }
}
