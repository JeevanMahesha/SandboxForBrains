import { Service, signal } from '@angular/core';

/** Matches Tailwind's `md` breakpoint: screens below 768px are treated as mobile. */
const MOBILE_QUERY = '(max-width: 767.98px)';

@Service()
export class ViewportService {
  private readonly media = window.matchMedia(MOBILE_QUERY);

  /** True when the viewport is narrower than the `md` breakpoint. */
  readonly isMobile = signal(this.media.matches);

  constructor() {
    this.media.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }
}
