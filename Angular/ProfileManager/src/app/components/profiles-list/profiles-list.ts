import { ChangeDetectionStrategy, Component, inject, input, Resource, signal } from '@angular/core';
import { ProfileDetail } from '../../models/profile';
import { ToolbarAction } from '../../models/toolbar.model';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../profile/profile';
import { StarMatch } from '../star-match/star-match';
import { Toolbar } from '../toolbar/toolbar';
import { ZodiacSigns } from '../zodiac-signs/zodiac-signs';
import { ProfilesListDesktopView } from './profiles-list-desktop-view/profiles-list-desktop-view';
import { ProfilesListMobileView } from './profiles-list-mobile-view/profiles-list-mobile-view';

@Component({
  selector: 'app-profiles-list',
  imports: [
    Toolbar,
    ProfilesListDesktopView,
    Profile,
    ProfilesListMobileView,
    ZodiacSigns,
    StarMatch,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilesList {
  actionType = input<ToolbarAction>();
  openDrawer = input<boolean>();
  selectedProfileId = input<string>();
  profiles: Resource<ProfileDetail[]>;
  toggleStarMatch = signal<MouseEvent | null>(null);
  toggleZodiacSigns = signal<MouseEvent | null>(null);
  private readonly profileService = inject(ProfilesService);

  constructor() {
    this.profiles = this.profileService.profiles;
  }
}
