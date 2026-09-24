import { formatDate } from '@angular/common';
import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DISPLAY_DATE_FORMAT } from '../constant/common.const';

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Recent dates are shown relative to now ("just now", "5 minutes ago", "3 hours ago").
 * Anything a day or older falls back to the plain date so it matches other dates on screen.
 * Pure, so the label reflects the moment the view rendered rather than ticking live.
 */
@Pipe({ name: 'timeAgo', standalone: true, pure: true })
export class TimeAgoPipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID);
  private readonly formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  transform(value: Date | null | undefined, dateFormat: string = DISPLAY_DATE_FORMAT): string {
    if (!value) return '';
    const diffSeconds = Math.round((value.getTime() - Date.now()) / 1000);
    const elapsed = Math.abs(diffSeconds);
    if (elapsed >= DAY) return formatDate(value, dateFormat, this.locale);
    // Truncate so 59m59s reads "59 minutes ago" and 23h59m reads "23 hours ago".
    if (elapsed >= HOUR) return this.formatter.format(Math.trunc(diffSeconds / HOUR), 'hour');
    if (elapsed >= MINUTE) return this.formatter.format(Math.trunc(diffSeconds / MINUTE), 'minute');
    return 'just now';
  }
}
