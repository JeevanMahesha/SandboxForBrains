import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucideMapPin,
  lucideMoreVertical,
  lucidePencil,
  lucideStar,
  lucideTrash2,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNumberedPagination } from '@spartan-ng/helm/pagination';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

const STATUS_BORDER_MAP: Partial<Record<string, string>> = {
  NEW: 'border-l-sky-400',
  REJECTED: 'border-l-rose-400',
  CONTACTED: 'border-l-indigo-400',
  MEETING_SCHEDULED: 'border-l-lime-400',
  ACCEPTED: 'border-l-emerald-400',
  ON_HOLD: 'border-l-amber-400',
  PROFILE_SHARED: 'border-l-fuchsia-400',
  SHARE_BY_RM: 'border-l-orange-400',
  NEED_TO_CONTACT: 'border-l-slate-400',
};

@Component({
  selector: 'app-profiles-list-mobile-view',
  imports: [
    NgClass,
    TitleCasePipe,
    HlmButton,
    HlmBadge,
    HlmSkeleton,
    HlmNumberedPagination,
    ...HlmIconImports,
    ...HlmDropdownMenuImports,
  ],
  templateUrl: './profiles-list-mobile-view.html',
  providers: [
    provideIcons({
      lucideStar,
      lucideMapPin,
      lucideCopy,
      lucidePencil,
      lucideTrash2,
      lucideMoreVertical,
    }),
  ],
})
export class ProfilesListMobileView {
  private profileService = inject(ProfilesService);
  readonly profileData = input.required<ProfileDetail[]>();
  readonly isLoading = input.required<boolean>();
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly pagedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.profileData().slice(start, start + this.pageSize());
  });

  userActionEvent(userActionType: ToolbarAction, profileId: ProfileDetail['id']): void {
    this.profileService.userActionEvent(
      userActionType,
      profileId != null ? String(profileId) : null,
    );
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }

  statusBorderClass(profile: ProfileDetail): string {
    return STATUS_BORDER_MAP[profile.profileStatusId ?? ''] ?? 'border-l-border';
  }
}
