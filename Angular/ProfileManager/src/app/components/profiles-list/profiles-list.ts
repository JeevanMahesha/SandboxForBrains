import {
  Component,
  inject,
  Signal,
  signal,
  computed,
  ViewChild,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { Profile, ProfileColumn } from '../../models/profile';
import { PROFILE_STATUS, PROFILE_STATUS_COLORS } from '../../constant/common';
import { ProfilesService } from '../../services/profiles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, tap } from 'rxjs';

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
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
})
export class ProfilesList {
  private readonly profilesService = inject(ProfilesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allProfiles = signal<Profile[]>([]);
  isLoading = signal<boolean>(false);

  // Pagination
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  pageSizeOptions = [5, 10, 25, 50, 100];

  // Computed paginated profiles
  profiles = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.allProfiles().slice(start, end);
  });

  displayedColumns: ProfileColumn[] = [
    'sNo',
    'name',
    'zodiacSign',
    'city',
    'profileStatusId',
    'starMatchScore',
    'actions',
  ];

  constructor() {
    this.reloadProfiles();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

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
      this.profilesService.deleteProfile(profile.id.toString()).subscribe({
        next: () => {
          this.snackBar.open('Profile deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.reloadProfiles();
        },
        error: (error) => {
          console.error('Error deleting profile:', error);
          this.snackBar.open('Error deleting profile', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }

  addProfile(): void {
    this.router.navigate(['/add-profile']);
  }

  getStatusClass(status: keyof typeof PROFILE_STATUS): string {
    return PROFILE_STATUS_COLORS[status];
  }

  getSerialNumber(index: number): number {
    return this.pageIndex() * this.pageSize() + index + 1;
  }

  private reloadProfiles(): void {
    this.isLoading.set(true);
    this.profilesService
      .getProfiles()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((profiles) => {
        this.allProfiles.set(profiles);
        this.pageIndex.set(0); // Reset to first page when reloading
      });
  }
}
