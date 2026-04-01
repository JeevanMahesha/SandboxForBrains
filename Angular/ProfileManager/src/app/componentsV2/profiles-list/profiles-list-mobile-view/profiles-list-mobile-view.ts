import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ProfileDetail } from '../../../models/profile';
import { ToolbarAction } from '../../../models/toolbar.model';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profiles-list-mobile-view',
  imports: [SkeletonModule, DataViewModule, CommonModule, TagModule, ButtonModule],
  templateUrl: './profiles-list-mobile-view.html',
  styleUrl: './profiles-list-mobile-view.css',
})
export class ProfilesListMobileView {
  profileData = input.required<ProfileDetail[]>();
  isLoading = input.required<boolean>();
  private profileService = inject(ProfilesService);

  userActionEvent(userActionType: ToolbarAction, profileId: string): void {
    this.profileService.userActionEvent(userActionType, profileId);
  }
}
