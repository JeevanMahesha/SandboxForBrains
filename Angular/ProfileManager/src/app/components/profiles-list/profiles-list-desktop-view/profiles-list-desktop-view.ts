import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideEye,
  lucideMessageCircle,
  lucidePhone,
  lucideSquarePen,
  lucideStar,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { MobileUrlPipe } from '../../../pipes/mobile-url.pipe';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-desktop-view',
  imports: [
    TitleCasePipe,
    MobileUrlPipe,
    HlmButton,
    HlmBadge,
    HlmSkeleton,
    ...HlmTableImports,
    ...HlmIconImports,
    ...HlmTooltipImports,
  ],
  templateUrl: './profiles-list-desktop-view.html',
  providers: [
    provideIcons({
      lucideCopy,
      lucidePhone,
      lucideMessageCircle,
      lucideSquarePen,
      lucideTrash2,
      lucideEye,
      lucideStar,
    }),
  ],
})
export class ProfilesListDesktopView {
  private profileService = inject(ProfilesService);
  readonly pagedData = input.required<ProfileDetail[]>();
  readonly totalItems = input.required<number>();
  readonly isLoading = input.required<boolean>();
  readonly skeletonRows = Array.from({ length: 8 });

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
