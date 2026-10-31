import { Pipe, PipeTransform } from '@angular/core';
import { ZODIAC_LIST, ZodiacKey } from '../constant/common.const';

/** Zodiac as shown across the app: Tanglish name first, English in brackets ("Mesham (Aries)"). */
@Pipe({ name: 'zodiacLabel', standalone: true, pure: true })
export class ZodiacLabelPipe implements PipeTransform {
  transform(zodiacSign: ZodiacKey | null | undefined): string {
    const zodiac = zodiacSign ? ZODIAC_LIST[zodiacSign] : undefined;
    return zodiac ? `${zodiac.tanglish} (${zodiac.english})` : '';
  }
}
