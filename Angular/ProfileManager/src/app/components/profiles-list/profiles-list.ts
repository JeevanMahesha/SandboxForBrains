import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Resource } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
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
    HlmButton,
    HlmSkeleton,
    NgTemplateOutlet,
  ],
  templateUrl: './profiles-list.html',
})
export default class ProfilesList {
  readonly profileService = inject(ProfilesService);
  readonly profiles: Resource<ProfileDetail[]>;
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);

  /** value() throws while the resource is in the error state, so guard it. */
  readonly rows = computed(() => (this.profiles.hasValue() ? this.profiles.value() : []));

  readonly errorMessage = computed(() => {
    const error = this.profiles.error();
    return error instanceof Error ? error.message : '';
  });

  /**
   * What a screen reader hears after each load ("12 profiles"). Empty while loading or failed, so a
   * stale count is never read out. Also empty for zero results: the empty state is already a
   * status region and says so, and announcing it here too would read it twice.
   */
  readonly resultAnnouncement = computed(() => {
    const total = this.profileService.totalCount();
    if (this.profiles.isLoading() || this.profiles.error() || total === 0) {
      return '';
    }
    return `${total} ${total === 1 ? 'profile' : 'profiles'}`;
  });

  constructor() {
    this.profiles = this.profileService.profiles;
  }

  retry(): void {
    this.profileService.refreshProfiles();
  }

  onPageChange(page: number): void {
    this.profileService.pageState.update((s) => ({ ...s, pageIndex: page - 1 }));
  }

  onPageSizeChange(size: number): void {
    this.profileService.pageState.update(() => ({ pageIndex: 0, pageSize: size }));
  }
}
