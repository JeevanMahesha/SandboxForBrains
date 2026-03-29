import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { PROFILE_STATUS } from '../../constant/common';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../profile/profile';
import { Toolbar } from '../toolbar/toolbar';

@Component({
  selector: 'app-profiles-list',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    ToggleButtonModule,
    FormsModule,
    SelectModule,
    TableModule,
    Profile,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    Toolbar,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilesList {
  private readonly profileService = inject(ProfilesService);

  profiles = resource({
    params: () => ({
      sortDirection: this.profileService.filterOptions().viewOrderCheck,
      matrimonyId: this.profileService.filterOptions().searchQuery,
      profileStatusFilter: this.profileService.filterOptions().profileStatus,
      starMatchScoreFilter: this.profileService.filterOptions().starMatchScore,
    }),
    loader: ({ params }) =>
      this.profileService
        .getFilteredProfilesV2(
          params.sortDirection,
          params.matrimonyId,
          params.profileStatusFilter,
          params.starMatchScoreFilter,
        )
        .then((profiles) => {
          return profiles.map((profile) => ({
            ...profile,
            profileStatus: PROFILE_STATUS[profile.profileStatusId as keyof typeof PROFILE_STATUS],
          }));
        }),
    defaultValue: [],
  });
}
