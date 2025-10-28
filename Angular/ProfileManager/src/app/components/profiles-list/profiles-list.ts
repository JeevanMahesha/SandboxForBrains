import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { Profile, ProfileColumn } from '../../models/profile';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PROFILE_STATUS, PROFILE_STATUS_COLORS } from '../../constant/common';

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
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'profiles');
  profiles = toSignal(collectionData(this.itemCollection) as Observable<Profile[]>, {
    initialValue: [],
  });
  displayedColumns: ProfileColumn[] = [
    'name',
    'zodiacSign',
    'city',
    'profileStatusId',
    'starMatchScore',
    'actions',
  ];

  onSearchChange(value: string): void {
    console.log(value);
  }

  clearSearch(): void {
    console.log('Clear search');
  }

  onView(profile: Profile): void {
    console.log('View profile:', profile);
  }

  onEdit(profile: Profile): void {
    console.log('Edit profile:', profile);
  }

  onDelete(profile: Profile): void {
    if (confirm(`Are you sure you want to delete ${profile.name}'s profile?`)) {
      console.log('Delete profile:', profile);
    }
  }

  addProfile(): void {
    console.log('Add new profile');
  }

  getStatusClass(status: keyof typeof PROFILE_STATUS): string {
    return PROFILE_STATUS_COLORS[status];
  }
}
