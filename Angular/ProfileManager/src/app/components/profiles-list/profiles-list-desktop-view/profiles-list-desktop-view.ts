import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-desktop-view',
  imports: [TableModule, ButtonModule, TagModule, TitleCasePipe],
  templateUrl: './profiles-list-desktop-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilesListDesktopView {
  readonly profileData = input.required<ProfileDetail[]>();
  readonly isLoading = input.required<boolean>();
  private profileService = inject(ProfilesService);

  userActionEvent(userActionType: ToolbarAction, profileId: string, event?: Event): void {
    this.profileService.userActionEvent(userActionType, profileId, event);
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }
}
