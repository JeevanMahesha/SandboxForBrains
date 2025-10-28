import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { ProfileService } from '../../services/profile';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profiles-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
})
export class ProfilesList {
  profileService = inject(ProfileService);
  searchTerm = signal('');
  displayedColumns: string[] = [
    'name',
    'caste',
    'city',
    'profileStatus',
    'star',
    'starMatchScore',
    'actions',
  ];

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.profileService.filterProfiles(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.profileService.clearSearch();
  }

  onView(profile: Profile): void {
    console.log('View profile:', profile);
  }

  onEdit(profile: Profile): void {
    console.log('Edit profile:', profile);
  }

  onDelete(profile: Profile): void {
    if (confirm(`Are you sure you want to delete ${profile.name}'s profile?`)) {
      this.profileService.deleteProfile(profile.id);
    }
  }

  addProfile(): void {
    console.log('Add new profile');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'New':
        return 'bg-teal-100 text-teal-800';
      case 'Rejected':
        return 'bg-gray-100 text-gray-800';
      case 'Unknown':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
