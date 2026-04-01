import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProfileDetail } from '../../../models/profile';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-desktop-view',
  imports: [TableModule, ButtonModule],
  templateUrl: './profiles-list-desktop-view.html',
  styleUrl: './profiles-list-desktop-view.css',
})
export class ProfilesListDesktopView {
  profileData = input.required<ProfileDetail[]>();
  isLoading = input.required<boolean>();

  private profileService = inject(ProfilesService);

  userActionEvent(userActionType: ToolbarAction, profileId: string, event?: Event): void {
    this.profileService.userActionEvent(userActionType, profileId, event);
  }
}
