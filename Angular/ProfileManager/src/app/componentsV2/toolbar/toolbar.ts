import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { MATCHING_STARS, PROFILE_STATUS } from '../../constant/common';
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
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    FormField,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  private readonly profileService = inject(ProfilesService);

  profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  filterForm = form(this.profileService.filterOptions);
  openStarMatch = output<MouseEvent>();

  openStarMatchPopover(event: MouseEvent) {
    this.openStarMatch.emit(event);
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
