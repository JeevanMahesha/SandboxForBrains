import { Service, WritableSignal, inject, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import ConfirmDialog, { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';
import {
  DocumentData,
  DocumentSnapshot,
  OrderByDirection,
  Query,
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
import { PROFILE_STATUS, PROFILE_STATUS_COLORS_MAP } from '../constant/common.const';
import { FIRESTORE } from '../firebase/provide-firebase';
import { Comment, ProfileDetail } from '../models/profile.model';
import { SortOption, ToolbarAction, UserActions } from '../models/toolbar.model';
import { AuthService } from './auth.service';

@Service()
export class ProfilesService {
  private authService = inject(AuthService);

  profiles = resource<ProfileDetail[], SortOption | undefined>({
    defaultValue: [],
    // Gate the query on auth: this service can be instantiated before login, so without
    // this guard the Firestore query would fire before login and fail with a permission
    // error, then never re-run. Returning
    // `undefined` keeps the resource idle until the user is authenticated, at which point
    // the param flips and the loader runs automatically (covers both fresh login and reload).
    params: () => (this.authService.isAuthenticated() ? this.filterOptions() : undefined),
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

  public readonly filterOptions: WritableSignal<SortOption> = signal({
    viewOrderCheck: false,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  });

  private readonly dialogService = inject(HlmDialogService);

  /** Opens a confirmation dialog and deletes the profile when the user confirms. */
  deleteProfile(id: string): void {
    const dialogRef = this.dialogService.open(ConfirmDialog, {
      context: {
        title: 'Confirm Delete',
        description: 'Do you want to delete this record?',
        confirmLabel: 'Delete',
        destructive: true,
      } satisfies ConfirmDialogContext,
      contentClass: 'sm:max-w-md',
    });

    dialogRef.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.removeProfile(id);
      }
    });
  }

  private removeProfile(id: string): void {
    const docRef = doc(this.firestore, 'profiles', id);
    deleteDoc(docRef)
      .then(() => {
        toast.success('Profile deleted successfully');
        this.profiles.reload();
      })
      .catch(() => {
        toast.error('Failed to delete profile');
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
    searchTerm: string,
    profileStatusFilter: keyof typeof PROFILE_STATUS | null = null,
    starMatchScoreFilter: number | null = null,
    sortField = 'createdAt',
  ): Promise<ProfileDetail[]> {
    const sortDirectionStr = sortDirection ? 'asc' : ('desc' as OrderByDirection);
    const trimmedSearch = (searchTerm ?? '').trim();

    // Shared filters applied to every query (status, star, sort).
    const withCommonFilters = (base: Query<DocumentData>): Query<DocumentData> => {
      let q = base;
      if (profileStatusFilter) {
        q = query(q, where('profileStatusId', '==', profileStatusFilter));
      }
      if (starMatchScoreFilter !== null && starMatchScoreFilter !== undefined) {
        q = query(q, where('starMatchScore', '==', starMatchScoreFilter));
      }
      // Apply sorting - must come after where clauses
      return query(q, orderBy(sortField, sortDirectionStr));
    };

    let profiles: ProfileDetail[];

    if (trimmedSearch !== '') {
      // A single search box matches either the matrimony ID or the mobile number.
      // Firestore can't OR across two fields in one query, so run both and merge.
      const [byMatrimonyId, byMobileNumber] = await Promise.all([
        getDocs(withCommonFilters(query(this.profilesCollection, where('matrimonyId', '==', trimmedSearch)))),
        getDocs(withCommonFilters(query(this.profilesCollection, where('mobileNumber', '==', trimmedSearch)))),
      ]);

      const byId = new Map<string, ProfileDetail>();
      for (const snapshot of [byMatrimonyId, byMobileNumber]) {
        for (const doc of snapshot.docs) {
          byId.set(doc.id, this.mapDocToProfile(doc));
        }
      }
      profiles = [...byId.values()];
    } else {
      const snapshot = await getDocs(withCommonFilters(query(this.profilesCollection)));
      profiles = snapshot.docs.map((doc) => this.mapDocToProfile(doc));
    }

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

  userActionEvent(userActionType: ToolbarAction, profileId: string | null): void {
    const userAction: UserActions = {
      actionType: userActionType,
      selectedProfileId: profileId,
      openDrawer: true,
    };
    if (userActionType === 'delete') {
      this.deleteProfile(profileId!);
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
        toast.success(`${label} copied to clipboard!`);
      },
      () => {
        toast.error(`Failed to copy ${label.toLowerCase()}`);
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
