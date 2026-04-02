import { Component, computed, inject, output } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
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

export interface SortOption {
  viewOrderCheck: boolean;
  searchQuery: string;
  profileStatus: keyof typeof PROFILE_STATUS | null;
  starMatchScore: number | null;
}

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
})
export class Toolbar {
  private readonly profileService = inject(ProfilesService);
  private readonly authService = inject(AuthService);
  profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  items: MenuItem[] = [
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

  scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  filterForm = form(this.profileService.filterOptions);
  openStarMatch = output<MouseEvent>();
  openZodiacSign = output<MouseEvent>();

  filterHasValue = computed(() => {
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
