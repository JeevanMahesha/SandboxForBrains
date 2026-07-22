import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Resource } from '@angular/core';
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

  constructor() {
    this.profiles = this.profileService.profiles;
  }

  onPageChange(page: number): void {
    this.profileService.pageState.update((s) => ({ ...s, pageIndex: page - 1 }));
  }

  onPageSizeChange(size: number): void {
    this.profileService.pageState.update(() => ({ pageIndex: 0, pageSize: size }));
  }
}
