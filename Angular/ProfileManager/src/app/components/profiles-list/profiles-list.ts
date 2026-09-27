import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Resource } from '@angular/core';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
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
    HlmNumberedPagination,
    HlmSpinner,
    NgTemplateOutlet,
  ],
  templateUrl: './profiles-list.html',
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
