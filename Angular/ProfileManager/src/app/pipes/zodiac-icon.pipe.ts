import { Pipe, PipeTransform } from '@angular/core';
import { ZodiacKey } from '../constant/common.const';

@Pipe({ name: 'zodiacIcon', standalone: true, pure: true })
export class ZodiacIconPipe implements PipeTransform {
  transform(zodiacSign: ZodiacKey | null): string {
    if (!zodiacSign) return 'lucideStar';
    return `lucideZodiac${zodiacSign.charAt(0).toUpperCase()}${zodiacSign.slice(1)}`;
  }
}
