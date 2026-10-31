import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { debounce, Debouncer, form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideFilterX,
  lucideLogOut,
  lucideMonitor,
  lucideMoon,
  lucideSearch,
  lucideSlidersHorizontal,
  lucideSparkles,
  lucideStar,
  lucideSun,
  lucideUser,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { AuthService } from '../../services/auth.service';
import { ProfilesService } from '../../services/profiles.service';
import { ThemeService } from '../../services/theme.service';
import { StarMatch } from '../star-match/star-match';
import { ZodiacSigns } from '../zodiac-signs/zodiac-signs';
import FilterSelects from './filter-selects/filter-selects';
import StatusChips from './status-chips/status-chips';

const SEARCH_DEBOUNCE_MS = 350;

/** Waits 350 ms, but applies at once when the box was cleared. Enter/blur flush via `touched`. */
const searchDebouncer: Debouncer<string> = ({ state }, abortSignal) => {
  if (state.controlValue() === '') return;
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, SEARCH_DEBOUNCE_MS);
    abortSignal.addEventListener('abort', () => clearTimeout(timer), { once: true });
  });
};

@Component({
  selector: 'app-toolbar',
  imports: [
    FormField,
    BrnSheetContent,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmSpinner,
    ...HlmSelectImports,
    ...HlmDropdownMenuImports,
    ...HlmIconImports,
    ...HlmSheetImports,
    FilterSelects,
    StatusChips,
    StarMatch,
    ZodiacSigns,
  ],
  templateUrl: './toolbar.html',
  providers: [
    provideIcons({
      lucideSearch,
      lucideFilterX,
      lucideUserPlus,
      lucideChevronDown,
      lucideSparkles,
      lucideStar,
      lucideLogOut,
      lucideSun,
      lucideMoon,
      lucideMonitor,
      lucideSlidersHorizontal,
      lucideUser,
    }),
  ],
})
export class Toolbar {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  readonly themeIcon = computed(() => {
    switch (this.themeService.preference()) {
      case 'light':
        return 'lucideSun';
      case 'dark':
        return 'lucideMoon';
      default:
        return 'lucideMonitor';
    }
  });
  readonly sortOrderToLabel = (value: boolean): string => (value ? 'Newest First' : 'Oldest First');
  readonly filterForm = form(this.profileService.filterOptions, (formControl) => {
    debounce(formControl.searchQuery, searchDebouncer);
  });
  /** True while the profiles resource is loading because the search text changed. */
  private readonly searchChanged = signal(false);
  readonly searchLoading = computed(
    () => this.searchChanged() && this.profileService.profiles.isLoading(),
  );
  readonly toggleStarMatch = signal<BrnDialogState>('closed');
  readonly toggleZodiacSigns = signal<BrnDialogState>('closed');
  readonly filterSheetOpen = signal<BrnDialogState>('closed');

  readonly filterHasValue = this.profileService.filterHasValue;

  constructor() {
    const searchQuery = computed(() => this.profileService.filterOptions().searchQuery);
    let previous = untracked(searchQuery);
    effect(() => {
      const current = searchQuery();
      if (current !== previous) this.searchChanged.set(true);
      previous = current;
    });
    effect(() => {
      if (!this.profileService.profiles.isLoading()) this.searchChanged.set(false);
    });
  }

  /** Enter applies the typed search immediately instead of waiting for the debounce. */
  flushSearch() {
    this.filterForm.searchQuery().markAsTouched();
  }

  openStarMatchPopover() {
    this.toggleStarMatch.set('open');
  }

  openZodiacSignPopover() {
    this.toggleZodiacSigns.set('open');
  }

  addNewProfileAction() {
    void this.router.navigate(['/profiles/new']);
  }

  async logout() {
    await this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
        toast.success('Logged out successfully');
      })
      .catch((error) => {
        toast.error('Failed to log out');
        console.error('Error logging out:', error);
      });
  }

  clearForm() {
    this.filterForm().reset({ ...ProfilesService.DEFAULT_FILTER_OPTIONS });
  }
}
