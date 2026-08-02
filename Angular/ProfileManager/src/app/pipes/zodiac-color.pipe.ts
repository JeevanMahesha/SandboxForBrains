import { Pipe, PipeTransform } from '@angular/core';
import { ZodiacKey } from '../constant/common.const';

const ZODIAC_COLORS: Record<ZodiacKey, string> = {
  aries: 'text-red-500',
  taurus: 'text-emerald-500',
  gemini: 'text-yellow-500',
  cancer: 'text-slate-400',
  leo: 'text-amber-500',
  virgo: 'text-lime-600',
  libra: 'text-pink-400',
  scorpio: 'text-red-800',
  sagittarius: 'text-purple-500',
  capricorn: 'text-stone-600',
  aquarius: 'text-cyan-500',
  pisces: 'text-teal-500',
};

@Pipe({ name: 'zodiacColor', standalone: true, pure: true })
export class ZodiacColorPipe implements PipeTransform {
  transform(zodiacSign: ZodiacKey | null): string {
    return zodiacSign ? (ZODIAC_COLORS[zodiacSign] ?? '') : '';
  }
}
