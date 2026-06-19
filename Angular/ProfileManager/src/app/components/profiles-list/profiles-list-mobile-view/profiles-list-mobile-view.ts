import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideEye,
  lucideMapPin,
  lucideSquarePen,
  lucideStar,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-mobile-view',
  imports: [
    TitleCasePipe,
    HlmButton,
    HlmBadge,
    HlmSkeleton,
    HlmNumberedPagination,
    ...HlmIconImports,
  ],
  templateUrl: './profiles-list-mobile-view.html',
  providers: [
    provideIcons({
      lucideStar,
      lucideMapPin,
      lucideCopy,
      lucideSquarePen,
      lucideTrash2,
      lucideEye,
    }),
  ],
})
export class ProfilesListMobileView {
  readonly profileData = input.required<ProfileDetail[]>();
  readonly isLoading = input.required<boolean>();

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly pagedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.profileData().slice(start, start + this.pageSize());
  });

  private profileService = inject(ProfilesService);

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
