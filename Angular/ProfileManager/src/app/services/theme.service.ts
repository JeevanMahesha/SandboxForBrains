import { computed, effect, Service, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

@Service()
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  /** Tracks the OS-level color scheme so `system` mode follows the device. */
  private readonly systemPrefersDark = signal(this.media.matches);

  /** The user's explicit choice; defaults to following the device theme. */
  readonly preference = signal<ThemePreference>(this.readStoredPreference());

  /** The effective theme actually applied to the document. */
  readonly isDark = computed(() =>
    this.preference() === 'system' ? this.systemPrefersDark() : this.preference() === 'dark',
  );

  constructor() {
    this.media.addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));

    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDark());
    });

    effect(() => {
      const preference = this.preference();
      if (preference === 'system') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, preference);
      }
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
  }

  /** Cycle through system → light → dark → system. */
  cyclePreference(): void {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(this.preference()) + 1) % order.length];
    this.preference.set(next);
  }

  private readStoredPreference(): ThemePreference {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  }
}
