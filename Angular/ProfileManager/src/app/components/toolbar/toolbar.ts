import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideFilterX,
  lucideLogOut,
  lucideSearch,
  lucideSparkles,
  lucideStar,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { MATCHING_STARS, PROFILE_STATUS } from '../../constant/common.const';
import { AuthService } from '../../services/auth.service';
import { ProfilesService } from '../../services/profiles.service';

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
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  private readonly profileService = inject(ProfilesService);
  private readonly authService = inject(AuthService);
  readonly profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  readonly scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  readonly filterForm = form(this.profileService.filterOptions, (formControl) => {
    debounce(formControl.searchQuery, 800);
  });
  readonly openStarMatch = output<void>();
  readonly openZodiacSign = output<void>();

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
    this.openStarMatch.emit();
  }

  openZodiacSignPopover() {
    this.openZodiacSign.emit();
  }

  addNewProfileAction() {
    this.profileService.userActionEvent('create', null);
  }

  async logout() {
    await this.authService
      .logout()
      .then(() => {
        this.profileService.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Logged out successfully',
        });
        this.profileService.router.navigate(['/login']);
      })
      .catch((error) => {
        this.profileService.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to log out',
        });
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
