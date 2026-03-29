import { Component, effect, output, signal, WritableSignal } from '@angular/core';
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
  filterOptions: WritableSignal<SortOption> = signal({
    viewOrderCheck: false,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  });

  profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  scoreMatchOptions = Array.from(new Set(Object.values(MATCHING_STARS))) as number[];
  filterForm = form(this.filterOptions);

  sortOptionsChanged = output<SortOption>();

  constructor() {
    effect(() => {
      this.sortOptionsChanged.emit(this.filterOptions());
    });
  }
}
