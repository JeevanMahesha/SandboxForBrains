import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, Resource } from '@angular/core';
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
    HlmSpinner,
    NgTemplateOutlet,
  ],
  templateUrl: './profiles-list.html',
})
export default class ProfilesList {
  readonly profiles: Resource<ProfileDetail[]>;
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);
  readonly profileService = inject(ProfilesService);

  constructor() {
    this.profiles = this.profileService.profiles;
  }
}
