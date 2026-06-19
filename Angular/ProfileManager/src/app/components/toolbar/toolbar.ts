import { Component, computed, inject, signal } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideFilterX,
  lucideLogOut,
  lucideMonitor,
  lucideMoon,
  lucideSearch,
  lucideSparkles,
  lucideStar,
  lucideSun,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { MATCHING_STARS, PROFILE_STATUS } from '../../constant/common.const';
import { AuthService } from '../../services/auth.service';
import { ProfilesService } from '../../services/profiles.service';
import { ThemeService } from '../../services/theme.service';
import { StarMatch } from '../star-match/star-match';
import { ZodiacSigns } from '../zodiac-signs/zodiac-signs';

@Component({
  selector: 'app-toolbar',
  imports: [
    FormField,
    HlmButton,
    HlmInput,
    ...HlmSelectImports,
    ...HlmSwitchImports,
    ...HlmDropdownMenuImports,
    ...HlmIconImports,
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
    }),
  ],
})
export class Toolbar {
  private readonly profileService = inject(ProfilesService);
  private readonly authService = inject(AuthService);
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
  readonly profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  readonly scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  readonly filterForm = form(this.profileService.filterOptions, (formControl) => {
    debounce(formControl.searchQuery, 800);
  });
  readonly toggleStarMatch = signal<boolean>(false);
  readonly toggleZodiacSigns = signal<boolean>(false);

  readonly filterHasValue = computed(() => {
    const { viewOrderCheck, searchQuery, profileStatus, starMatchScore } =
      this.profileService.filterOptions();
    const searchTrimmed = (searchQuery ?? '').trim();
    return (
      viewOrderCheck !== false ||
      searchTrimmed !== '' ||
      profileStatus != null ||
      starMatchScore != null
    );
  });

  openStarMatchPopover() {
    this.toggleStarMatch.set(true);
  }

  openZodiacSignPopover() {
    this.toggleZodiacSigns.set(true);
  }

  addNewProfileAction() {
    this.profileService.userActionEvent('create', null);
  }

  async logout() {
    await this.authService
      .logout()
      .then(() => {
        toast.success('Logged out successfully');
        this.profileService.router.navigate(['/login']);
      })
      .catch((error) => {
        toast.error('Failed to log out');
        console.error('Error logging out:', error);
      });
  }

  clearForm() {
    this.filterForm().reset({
      viewOrderCheck: false,
      searchQuery: '',
      profileStatus: null,
      starMatchScore: null,
    });
  }
}
