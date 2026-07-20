import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Resource, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { ProfileDetail } from '../../models/profile.model';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../profile/profile';
import { Toolbar } from '../toolbar/toolbar';
import { ProfilesListDesktopView } from './profiles-list-desktop-view/profiles-list-desktop-view';
import { ProfilesListMobileView } from './profiles-list-mobile-view/profiles-list-mobile-view';

@Component({
  selector: 'app-profiles-list',
  imports: [
    Toolbar,
    ProfilesListDesktopView,
    Profile,
    ProfilesListMobileView,
    HlmButton,
    HlmNumberedPagination,
    HlmSpinner,
    NgTemplateOutlet,
    ...HlmIconImports,
  ],
  templateUrl: './profiles-list.html',
  providers: [provideIcons({ lucidePlus })],
})
export default class ProfilesList {
  readonly profileService = inject(ProfilesService);
  readonly profiles: Resource<ProfileDetail[]>;
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly pagedData = computed(() => {
    const data = this.profiles.value() ?? [];
    const start = (this.currentPage() - 1) * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  constructor() {
    this.profiles = this.profileService.profiles;
  }
}
