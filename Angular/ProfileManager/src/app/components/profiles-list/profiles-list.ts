import {
  Component,
  inject,
  signal,
  computed,
  effect,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { Profile, ProfileColumn } from '../../models/profile';
import { MATCHING_STARS, PROFILE_STATUS, PROFILE_STATUS_COLORS } from '../../constant/common';
import { ProfilesService } from '../../services/profiles.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { OrderByDirection } from '@angular/fire/firestore';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-profiles-list',
  imports: [
    NgClass,
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
    MatButtonToggleModule,
    KeyValuePipe,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilesList {
  private readonly profilesService = inject(ProfilesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  allProfiles = signal<Profile[]>([]);
  isLoading = signal<boolean>(false);

  // Pagination
  pageSize = signal<number>(10);
  pageIndex = signal<number>(0);
  pageSizeOptions = [5, 10, 25, 50, 100];

  // Sorting & Filtering
  sortDirection = signal<OrderByDirection>('desc');
  sortField = signal<string>('createdAt');
  selectedProfileStatus = signal<keyof typeof PROFILE_STATUS | null>(null);
  selectedStar = signal<number | null>(null);
  searchMatrimonyIdControl = new FormControl<string>('');

  sortOptions = signal<{ label: string; value: OrderByDirection }[]>([
    {
      label: 'Newest',
      value: 'desc',
    },
    {
      label: 'Oldest',
      value: 'asc',
    },
  ]);
  profileSortOption = PROFILE_STATUS;
  starSortOption = Array.from(new Set(Object.values(MATCHING_STARS))).sort((a, b) => b - a);

  // Computed paginated profiles (no filtering here, it's done on backend)
  profiles = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.allProfiles().slice(start, end);
  });

  // For pagination, use allProfiles length
  filteredProfiles = computed(() => this.allProfiles());

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
    // Setup debounced search using FormControl valueChanges
    this.searchMatrimonyIdControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading.set(true)),
        switchMap((searchValue) => {
          return this.profilesService.getProfilesByMatrimonyId(searchValue);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((profiles) => {
        this.allProfiles.set(profiles);
        this.pageIndex.set(0);
        this.isLoading.set(false);
      });

    effect(() => {
      this.selectedProfileStatus();
      this.selectedStar();
      this.sortDirection();
      this.sortField();
      this.reloadProfiles();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onView(profile: Profile): void {
    this.router.navigate(['/profile'], { queryParams: { id: profile.id, action: 'view' } });
  }

  onEdit(profile: Profile): void {
    this.router.navigate(['/profile'], { queryParams: { id: profile.id, action: 'edit' } });
  }

  onSortChange(event: MatButtonToggleChange): void {
    const direction = event.value as OrderByDirection;
    this.sortDirection.set(direction);
  }

  onStarSortChange(event: MatSelectChange): void {
    const starScore = event.value === undefined ? null : event.value;
    this.selectedStar.set(starScore);
    this.pageIndex.set(0); // Reset to first page when filtering
  }

  onProfileSortChange(event: MatSelectChange): void {
    const status = event.value === undefined ? null : event.value;
    this.selectedProfileStatus.set(status);
    this.pageIndex.set(0); // Reset to first page when filtering
  }

  onDelete(profile: Profile): void {
    if (confirm(`Are you sure you want to delete ${profile.name}'s profile?`)) {
      this.profilesService
        .deleteProfile(profile.id.toString())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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

  getStatusLabel(status: string | null): string {
    if (!status) return '';
    return this.profileSortOption[status as keyof typeof PROFILE_STATUS] || status;
  }

  getSerialNumber(index: number): number {
    return this.pageIndex() * this.pageSize() + index + 1;
  }

  clearFilters(): void {
    this.selectedProfileStatus.set(null);
    this.selectedStar.set(null);
    this.searchMatrimonyIdControl.setValue('');
    this.sortDirection.set('desc');
    this.sortField.set('createdAt');
    this.pageIndex.set(0);
  }

  reloadProfiles(): void {
    this.isLoading.set(true);

    const filters = {
      profileStatus: this.selectedProfileStatus(),
      starMatchScore: this.selectedStar(),
    };

    this.profilesService
      .getFilteredProfiles(this.sortField(), this.sortDirection(), filters)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((profiles) => {
        this.allProfiles.set(profiles);
        this.pageIndex.set(0); // Reset to first page when reloading
      });
  }
}
