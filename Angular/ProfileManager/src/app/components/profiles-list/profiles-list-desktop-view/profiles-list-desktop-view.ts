import { Component, computed, inject, input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEye, lucideSquarePen, lucideStar, lucideTrash2 } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-desktop-view',
  imports: [
    HlmButton,
    HlmBadge,
    HlmSkeleton,
    HlmNumberedPagination,
    ...HlmTableImports,
    ...HlmIconImports,
  ],
  templateUrl: './profiles-list-desktop-view.html',
  providers: [provideIcons({ lucideCopy, lucideSquarePen, lucideTrash2, lucideEye, lucideStar })],
})
export class ProfilesListDesktopView {
  readonly profileData = input.required<ProfileDetail[]>();
  readonly isLoading = input.required<boolean>();

  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly skeletonRows = Array.from({ length: 8 });
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
