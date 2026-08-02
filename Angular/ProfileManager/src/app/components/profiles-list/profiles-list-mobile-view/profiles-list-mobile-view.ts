import { TitleCasePipe } from '@angular/common';
import { ProfileCardClassPipe } from './profile-card-class.pipe';
import { Component, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideMapPin,
  lucideMessageCircle,
  lucideMoreVertical,
  lucidePencil,
  lucidePhone,
  lucideStar,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { MobileUrlPipe } from '../../../pipes/mobile-url.pipe';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-mobile-view',
  imports: [
    TitleCasePipe,
    ProfileCardClassPipe,
    MobileUrlPipe,
    HlmButton,
    HlmBadge,
    HlmSkeleton,
    ...HlmIconImports,
    ...HlmDropdownMenuImports,
  ],
  templateUrl: './profiles-list-mobile-view.html',
  providers: [
    provideIcons({
      lucideStar,
      lucideMapPin,
      lucideCopy,
      lucidePhone,
      lucideMessageCircle,
      lucidePencil,
      lucideTrash2,
      lucideMoreVertical,
    }),
  ],
})
export class ProfilesListMobileView {
  private profileService = inject(ProfilesService);
  readonly pagedData = input.required<ProfileDetail[]>();
  readonly isLoading = input.required<boolean>();

  userActionEvent(userActionType: ToolbarAction, profileId: ProfileDetail['id']): void {
    this.profileService.userActionEvent(
      userActionType,
      profileId != null ? String(profileId) : null,
    );
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }

}
