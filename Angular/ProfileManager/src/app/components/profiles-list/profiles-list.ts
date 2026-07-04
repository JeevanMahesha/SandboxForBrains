import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, Resource } from '@angular/core';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { ProfileDetail } from '../../models/profile.model';
import { ToolbarAction } from '../../models/toolbar.model';
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
  readonly actionType = input<ToolbarAction>();
  readonly openDrawer = input<boolean>();
  readonly selectedProfileId = input<string>();
  readonly profiles: Resource<ProfileDetail[]>;
  private readonly profileService = inject(ProfilesService);

  constructor() {
    this.profiles = this.profileService.profiles;
  }
}
