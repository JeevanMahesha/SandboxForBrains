import { Injectable, WritableSignal, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DocumentSnapshot,
  OrderByDirection,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, from, map, of, tap } from 'rxjs';
import { SortOption } from '../componentsV2/toolbar/toolbar';
import { PROFILE_STATUS } from '../constant/common';
import { FIRESTORE } from '../firebase/provide-firebase';
import { Comment, ProfileDetail } from '../models/profile';
import { ToolbarAction, UserActions } from '../models/toolbar.model';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  profiles = resource({
    params: () => ({
      sortDirection: this.filterOptions().viewOrderCheck,
      matrimonyId: this.filterOptions().searchQuery,
      profileStatusFilter: this.filterOptions().profileStatus,
      starMatchScoreFilter: this.filterOptions().starMatchScore,
    }),
    loader: ({ params }) =>
      this.getFilteredProfilesV2(
        params.sortDirection,
        params.matrimonyId,
        params.profileStatusFilter,
        params.starMatchScoreFilter,
      ).then((profiles) => {
        return profiles.map((profile) => ({
          ...profile,
          profileStatus: PROFILE_STATUS[profile.profileStatusId as keyof typeof PROFILE_STATUS],
        }));
      }),
    defaultValue: [],
  });
  private firestore = inject(FIRESTORE);
  private profilesCollection = collection(this.firestore, 'profiles');
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  public readonly filterOptions: WritableSignal<SortOption> = signal({
    viewOrderCheck: false,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  });

  /**
   * Add a new profile to Firestore
   */
  addProfile(profileData: Partial<ProfileDetail>): Observable<string> {
    const now = Timestamp.now();
    const profileToAdd = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };

    return from(addDoc(this.profilesCollection, profileToAdd)).pipe(map((docRef) => docRef.id));
  }

  /**
   * Get filtered profiles from Firestore with sorting and filtering from backend
   */
  getFilteredProfiles(
    sortField = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    filters?: {
      profileStatus?: keyof typeof PROFILE_STATUS | null;
      starMatchScore?: number | null;
    },
  ): Observable<ProfileDetail[]> {
    let q = query(this.profilesCollection);

    // Apply filters using where clauses
    if (filters?.profileStatus) {
      q = query(q, where('profileStatusId', '==', filters.profileStatus));
    }

    if (filters?.starMatchScore !== null && filters?.starMatchScore !== undefined) {
      q = query(q, where('starMatchScore', '==', filters.starMatchScore));
    }

    // Apply sorting - must come after where clauses
    q = query(q, orderBy(sortField, sortDirection));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const profiles = snapshot.docs.map((doc) => this.mapDocToProfile(doc));

        // Sort profiles: rejected profiles appear at the end
        return profiles.sort((a, b) => {
          const aIsRejected = a.profileStatusId === 'REJECTED';
          const bIsRejected = b.profileStatusId === 'REJECTED';

          // If both are rejected or both are not rejected, maintain original order
          if (aIsRejected === bIsRejected) {
            return 0;
          }

          // Rejected profiles go to the end
          return aIsRejected ? 1 : -1;
        });
      }),
      tap((profiles) => console.log(profiles)),
    );
  }

  /**
   * Get a single profile by ID
   */
  getProfileById(id: string): Observable<ProfileDetail | null> {
    const docRef = doc(this.firestore, 'profiles', id);

    return from(getDoc(docRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return this.mapDocToProfile(docSnap);
        }
        return null;
      }),
    );
  }

  getProfilesByMatrimonyId(matrimonyId: string | null): Observable<ProfileDetail[]> {
    if (!matrimonyId || matrimonyId.trim() === '') {
      return of([]);
    }
    const q = query(this.profilesCollection, where('matrimonyId', '==', matrimonyId.trim()));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => this.mapDocToProfile(doc));
      }),
    );
  }

  /**
   * Update an existing profile
   */
  updateProfile(id: string, profileData: Partial<ProfileDetail>): Observable<void> {
    const docRef = doc(this.firestore, 'profiles', id);
    const updateData = {
      ...profileData,
      updatedAt: Timestamp.now(),
    };

    return from(updateDoc(docRef, updateData));
  }

  /**
   * Delete a profile
   */
  deleteProfile(id: string, event: Event): void {
    console.log('deleteProfile', id);

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      closable: false,

      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
        const docRef = doc(this.firestore, 'profiles', id);
        deleteDoc(docRef)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Profile deleted successfully',
            });
            this.profiles.reload();
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete profile',
            });
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  private mapDocToProfile(doc: QueryDocumentSnapshot | DocumentSnapshot): ProfileDetail {
    const data = doc.data();
    // Convert comment timestamps from Firestore Timestamps to Date objects
    const comments: Comment[] = (data?.['comments'] || []).map(
      (comment: { value?: string; createDateAndTime?: { toDate: () => Date } } | string) => {
        // Handle both old string format and new object format for backwards compatibility
        if (typeof comment === 'string') {
          return {
            value: comment,
            createDateAndTime: new Date(),
          };
        }
        return {
          value: comment.value || '',
          createDateAndTime: comment.createDateAndTime?.toDate?.() || new Date(),
        };
      },
    );

    return {
      id: doc.id,
      ...data,
      comments,
      // Convert Firestore Timestamps to Date objects
      createdAt: data?.['createdAt']?.toDate() || new Date(),
      updatedAt: data?.['updatedAt']?.toDate() || new Date(),
    } as unknown as ProfileDetail;
  }

  // V2 methods can be added here as needed

  async getFilteredProfilesV2(
    sortDirection: boolean,
    matrimonyId: string,
    profileStatusFilter: keyof typeof PROFILE_STATUS | null = null,
    starMatchScoreFilter: number | null = null,
    sortField = 'createdAt',
  ): Promise<ProfileDetail[]> {
    let q = query(this.profilesCollection);

    if (matrimonyId && matrimonyId.trim() !== '') {
      q = query(this.profilesCollection, where('matrimonyId', '==', matrimonyId.trim()));
    }

    // Apply filters using where clauses
    if (profileStatusFilter) {
      q = query(q, where('profileStatusId', '==', profileStatusFilter));
    }

    if (starMatchScoreFilter !== null && starMatchScoreFilter !== undefined) {
      q = query(q, where('starMatchScore', '==', starMatchScoreFilter));
    }

    const sortDirectionStr = sortDirection ? 'asc' : ('desc' as OrderByDirection);

    // Apply sorting - must come after where clauses
    q = query(q, orderBy(sortField, sortDirectionStr));

    const snapshot = await getDocs(q);
    const profiles = snapshot.docs.map((doc) => this.mapDocToProfile(doc));
    return profiles.sort((a, b) => {
      const aIsRejected = a.profileStatusId === 'REJECTED';
      const bIsRejected = b.profileStatusId === 'REJECTED';

      // If both are rejected or both are not rejected, maintain original order
      if (aIsRejected === bIsRejected) {
        return 0;
      }

      // Rejected profiles go to the end
      return aIsRejected ? 1 : -1;
    });
  }

  async addProfileV2(profileData: Partial<ProfileDetail>) {
    const now = Timestamp.now();
    const profileToAdd = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };

    return addDoc(this.profilesCollection, profileToAdd);
  }

  async getProfileByIdV2(id: string): Promise<ProfileDetail | null> {
    const docRef = doc(this.firestore, 'profiles', id);

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return this.mapDocToProfile(docSnap);
    }
    return null;
  }

  userActionEvent(userActionType: ToolbarAction, profileId: string | null, event?: Event): void {
    const userAction: UserActions = {
      actionType: userActionType,
      selectedProfileId: profileId,
      openDrawer: true,
    };
    if (userActionType === 'delete') {
      this.deleteProfile(profileId!, event!);
      return;
    }
    this.router.navigate([], {
      queryParams: { ...userAction },
    });
  }
}
