import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { MATCHING_STARS, PROFILE_STATUS } from '../../constant/common.const';
import { AuthService } from '../../services/auth.service';
import { ProfilesService } from '../../services/profiles.service';

@Component({
  selector: 'app-toolbar',
  imports: [
    ToolbarModule,
    ToggleButtonModule,
    SelectModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    SplitButtonModule,
    FormField,
    InputTextModule,
  ],
  templateUrl: './toolbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toolbar {
  private readonly profileService = inject(ProfilesService);
  private readonly authService = inject(AuthService);
  readonly profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  readonly items: MenuItem[] = [
    {
      label: 'Zodiac Signs',
      icon: 'pi pi-sparkles',
      command: (event: MenuItemCommandEvent) =>
        this.openZodiacSignPopover(event.originalEvent as MouseEvent),
    },
    {
      label: 'Preferred Star',
      icon: 'pi pi-star-fill',
      command: (event: MenuItemCommandEvent) =>
        this.openStarMatchPopover(event.originalEvent as MouseEvent),
    },
    {
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      command: async () =>
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
          }),
    },
  ];

  readonly scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  readonly filterForm = form(this.profileService.filterOptions, (formControl) => {
    debounce(formControl.searchQuery, 800);
  });
  readonly openStarMatch = output<MouseEvent>();
  readonly openZodiacSign = output<MouseEvent>();

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

  openStarMatchPopover(event: MouseEvent) {
    this.openStarMatch.emit(event);
  }

  openZodiacSignPopover(event: MouseEvent) {
    this.openZodiacSign.emit(event);
  }

  addNewProfileAction() {
    this.profileService.userActionEvent('create', null);
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
