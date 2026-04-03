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
import { PROFILE_STATUS, PROFILE_STATUS_COLORS_MAP } from '../constant/common.const';
import { FIRESTORE } from '../firebase/provide-firebase';
import { Comment, ProfileDetail } from '../models/profile.model';
import { SortOption, ToolbarAction, UserActions } from '../models/toolbar.model';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  profiles = resource<ProfileDetail[], SortOption>({
    defaultValue: [],
    params: () => this.filterOptions(),
    loader: ({ params }) =>
      this.getFilteredProfiles(
        params.viewOrderCheck,
        params.searchQuery,
        params.profileStatus,
        params.starMatchScore,
      ).then((profiles) => {
        return profiles.map((profile) => ({
          ...profile,
          profileStatus: PROFILE_STATUS[profile.profileStatusId as keyof typeof PROFILE_STATUS],
          profileStatusColor:
            PROFILE_STATUS_COLORS_MAP[
              profile.profileStatusId as keyof typeof PROFILE_STATUS_COLORS_MAP
            ],
        }));
      }),
  });
  private firestore = inject(FIRESTORE);
  private profilesCollection = collection(this.firestore, 'profiles');
  public readonly router = inject(Router);
  public readonly messageService = inject(MessageService);
  public readonly confirmationService = inject(ConfirmationService);

  public readonly filterOptions: WritableSignal<SortOption> = signal({
    viewOrderCheck: false,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  });

  deleteProfile(id: string, event: Event): void {
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
        const docRef = doc(this.firestore, 'profiles', id);
        deleteDoc(docRef)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Profile deleted successfully',
              life: 2000,
            });
            this.profiles.reload();
          })
          .catch(() => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete profile',
              life: 3000,
            });
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 2000,
        });
      },
    });
  }

  async updateProfile(id: string, profileData: Partial<ProfileDetail>): Promise<void> {
    const docRef = doc(this.firestore, 'profiles', id);
    const updateData = {
      ...profileData,
      updatedAt: new Date(),
    };

    await updateDoc(docRef, updateData);
  }

  async getFilteredProfiles(
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

  async addProfile(profileData: Partial<ProfileDetail>) {
    const now = Timestamp.now();
    const profileToAdd = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };

    return addDoc(this.profilesCollection, profileToAdd);
  }

  async getProfileById(id: string): Promise<ProfileDetail | null> {
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

  copyToClipboard(value: string | null | undefined, label: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value).then(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${label} copied to clipboard!`,
          life: 2000,
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to copy ${label.toLowerCase()}`,
          life: 3000,
        });
      },
    );
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
}
