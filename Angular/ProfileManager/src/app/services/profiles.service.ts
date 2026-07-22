import { Service, WritableSignal, inject, resource, signal, untracked, effect } from '@angular/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import {
  DocumentData,
  DocumentSnapshot,
  OrderByDirection,
  Query,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  count,
  deleteDoc,
  doc,
  getAggregateFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import ConfirmDialog, { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';
import { PROFILE_STATUS, PROFILE_STATUS_COLORS_MAP } from '../constant/common.const';
import { FIRESTORE } from '../firebase/provide-firebase';
import { Comment, ProfileDetail } from '../models/profile.model';
import { SortOption, ToolbarAction } from '../models/toolbar.model';
import { AuthService } from './auth.service';

@Service()
export class ProfilesService {
  private authService = inject(AuthService);
  private firestore = inject(FIRESTORE);
  private readonly dialogService = inject(HlmDialogService);

  private profilesCollection = collection(this.firestore, 'profiles');

  public readonly filterOptions: WritableSignal<SortOption> = signal({
    viewOrderCheck: false,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  });

  readonly pageState = signal<{ pageIndex: number; pageSize: number }>({
    pageIndex: 0,
    pageSize: 10,
  });

  readonly totalCount = signal<number>(0);

  private cursorCache = new Map<number, QueryDocumentSnapshot | null>();
  private lastFilterKey = '';

  readonly drawerState = signal<{
    isOpen: BrnDialogState;
    actionType: ToolbarAction | null;
    selectedProfileId: string | null;
  }>({ isOpen: 'closed', actionType: null, selectedProfileId: null });

  constructor() {
    // Reset to page 0 whenever the non-pagination filter options change.
    effect(() => {
      this.filterOptions();
      untracked(() => this.pageState.update((s) => ({ ...s, pageIndex: 0 })));
    });
  }

  profiles = resource<ProfileDetail[], { filter: SortOption; page: { pageIndex: number; pageSize: number } } | undefined>({
    defaultValue: [],
    params: () =>
      this.authService.isAuthenticated()
        ? { filter: this.filterOptions(), page: this.pageState() }
        : undefined,
    loader: async ({ params }) => {
      const { filter, page } = params;
      const filterKey = this.buildFilterKey(filter);

      if (filterKey !== this.lastFilterKey) {
        this.cursorCache.clear();
        this.lastFilterKey = filterKey;
        this.totalCount.set(await this.getProfilesCount(filter));
      }

      const profiles = filter.searchQuery.trim() !== ''
        ? await this.getFilteredProfilesBySearch(filter)
        : await this.getProfilePage(filter, page.pageIndex, page.pageSize);

      return profiles.map((profile) => ({
        ...profile,
        profileStatus: PROFILE_STATUS[profile.profileStatusId as keyof typeof PROFILE_STATUS],
        profileStatusColor:
          PROFILE_STATUS_COLORS_MAP[
            profile.profileStatusId as keyof typeof PROFILE_STATUS_COLORS_MAP
          ],
      }));
    },
  });

  /** Stable string key representing only the filter fields (not pagination). */
  private buildFilterKey(filter: SortOption): string {
    return `${filter.viewOrderCheck}|${filter.searchQuery}|${filter.profileStatus}|${filter.starMatchScore}`;
  }

  /** Base query with all where/orderBy clauses applied — no limit or cursor. */
  private buildBaseQuery(
    filter: SortOption,
    sortField = 'createdAt',
  ): Query<DocumentData> {
    const sortDirectionStr: OrderByDirection = filter.viewOrderCheck ? 'asc' : 'desc';
    let q: Query<DocumentData> = query(this.profilesCollection);
    if (filter.profileStatus) {
      q = query(q, where('profileStatusId', '==', filter.profileStatus));
    }
    if (filter.starMatchScore !== null && filter.starMatchScore !== undefined) {
      q = query(q, where('starMatchScore', '==', filter.starMatchScore));
    }
    return query(q, orderBy(sortField, sortDirectionStr));
  }

  /** Total document count for the current filters — uses server-side aggregation (no document download). */
  private async getProfilesCount(filter: SortOption): Promise<number> {
    if (filter.searchQuery.trim() !== '') {
      // For search queries, count is the size of the merged result set.
      const results = await this.getFilteredProfilesBySearch(filter);
      return results.length;
    }
    const snapshot = await getAggregateFromServer(this.buildBaseQuery(filter), {
      total: count(),
    });
    return snapshot.data().total;
  }

  /**
   * Fetches one page of profiles using cursor-based pagination.
   * On cache miss for a non-first page, fetches all docs up to that page
   * and populates the cursor cache for all intermediate pages.
   */
  private async getProfilePage(
    filter: SortOption,
    pageIndex: number,
    pageSize: number,
  ): Promise<ProfileDetail[]> {
    const cursor = this.cursorCache.get(pageIndex);

    if (pageIndex > 0 && cursor === undefined) {
      // Cache miss — user jumped to an unvisited page.
      // Fetch all docs up to the target page and build the full cursor chain.
      return this.fetchAndCacheUpToPage(filter, pageIndex, pageSize);
    }

    const baseQuery = this.buildBaseQuery(filter);
    const pagedQuery = cursor
      ? query(baseQuery, startAfter(cursor), limit(pageSize))
      : query(baseQuery, limit(pageSize));

    const snapshot = await getDocs(pagedQuery);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
    if (lastDoc) {
      this.cursorCache.set(pageIndex + 1, lastDoc);
    }

    return this.sortWithRejectedLast(snapshot.docs.map((d) => this.mapDocToProfile(d)));
  }

  /**
   * Handles random page jumps by fetching all documents up to the target page
   * and caching cursors for every page along the way.
   */
  private async fetchAndCacheUpToPage(
    filter: SortOption,
    targetPageIndex: number,
    pageSize: number,
  ): Promise<ProfileDetail[]> {
    const totalToFetch = pageSize * (targetPageIndex + 1);
    const snapshot = await getDocs(query(this.buildBaseQuery(filter), limit(totalToFetch)));
    const docs = snapshot.docs;

    // Populate cursor cache for all pages we now have data for.
    for (let i = 0; i <= targetPageIndex; i++) {
      const lastDocOfPage = docs[Math.min((i + 1) * pageSize, docs.length) - 1];
      if (lastDocOfPage) {
        this.cursorCache.set(i + 1, lastDocOfPage);
      }
    }

    const pageStart = targetPageIndex * pageSize;
    return this.sortWithRejectedLast(
      docs.slice(pageStart, pageStart + pageSize).map((d) => this.mapDocToProfile(d)),
    );
  }

  /** Search by matrimonyId OR mobileNumber — Firestore requires two parallel queries for OR across fields. */
  private async getFilteredProfilesBySearch(filter: SortOption): Promise<ProfileDetail[]> {
    const trimmedSearch = filter.searchQuery.trim();
    const sortDirectionStr: OrderByDirection = filter.viewOrderCheck ? 'asc' : 'desc';
    const sortField = 'createdAt';

    const withCommonFilters = (base: Query<DocumentData>): Query<DocumentData> => {
      let q = base;
      if (filter.profileStatus) {
        q = query(q, where('profileStatusId', '==', filter.profileStatus));
      }
      if (filter.starMatchScore !== null && filter.starMatchScore !== undefined) {
        q = query(q, where('starMatchScore', '==', filter.starMatchScore));
      }
      return query(q, orderBy(sortField, sortDirectionStr));
    };

    const [byMatrimonyId, byMobileNumber] = await Promise.all([
      getDocs(withCommonFilters(query(this.profilesCollection, where('matrimonyId', '==', trimmedSearch)))),
      getDocs(withCommonFilters(query(this.profilesCollection, where('mobileNumber', '==', trimmedSearch)))),
    ]);

    const byId = new Map<string, ProfileDetail>();
    for (const snapshot of [byMatrimonyId, byMobileNumber]) {
      for (const d of snapshot.docs) {
        byId.set(d.id, this.mapDocToProfile(d));
      }
    }
    return this.sortWithRejectedLast([...byId.values()]);
  }

  /** Moves rejected profiles to the end while preserving relative order of others. */
  private sortWithRejectedLast(profiles: ProfileDetail[]): ProfileDetail[] {
    return profiles.sort((a, b) => {
      const aRejected = a.profileStatusId === 'REJECTED';
      const bRejected = b.profileStatusId === 'REJECTED';
      if (aRejected === bRejected) return 0;
      return aRejected ? 1 : -1;
    });
  }

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
    await updateDoc(docRef, { ...profileData, updatedAt: serverTimestamp() });
  }

  async addProfile(profileData: Partial<ProfileDetail>) {
    const profileToAdd = {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
    if (userActionType === 'delete') {
      this.deleteProfile(profileId!);
      return;
    }
    this.drawerState.set({
      isOpen: 'open',
      actionType: userActionType,
      selectedProfileId: profileId,
    });
  }

  closeDrawer(): void {
    this.drawerState.set({ isOpen: 'closed', actionType: null, selectedProfileId: null });
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
    const comments: Comment[] = (data?.['comments'] || []).map(
      (comment: { value?: string; createDateAndTime?: { toDate: () => Date } } | string) => {
        if (typeof comment === 'string') {
          return { value: comment, createDateAndTime: new Date() };
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
      createdAt: data?.['createdAt']?.toDate() || new Date(),
      updatedAt: data?.['updatedAt']?.toDate() || new Date(),
    } as unknown as ProfileDetail;
  }
}
