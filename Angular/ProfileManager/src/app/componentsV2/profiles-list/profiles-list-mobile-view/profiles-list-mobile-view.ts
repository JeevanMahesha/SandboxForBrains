import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { Profile } from '../../../models/profile';

@Component({
  selector: 'app-profiles-list-mobile-view',
  imports: [SkeletonModule, DataViewModule, CommonModule, TagModule, ButtonModule],
  templateUrl: './profiles-list-mobile-view.html',
  styleUrl: './profiles-list-mobile-view.css',
})
export class ProfilesListMobileView {
  profileData = input.required<Profile[]>();
  isLoading = input.required<boolean>();
}
