import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Profile } from '../../../models/profile';

@Component({
  selector: 'app-profiles-list-desktop-view',
  imports: [TableModule, ButtonModule],
  templateUrl: './profiles-list-desktop-view.html',
  styleUrl: './profiles-list-desktop-view.css',
})
export class ProfilesListDesktopView {
  profileData = input.required<Profile[]>();
  isLoading = input.required<boolean>();
}
