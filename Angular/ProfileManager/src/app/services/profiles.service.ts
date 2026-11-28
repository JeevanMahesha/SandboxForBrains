import {
  Service,
  computed,
  WritableSignal,
  inject,
  resource,
  signal,
  untracked,
  effect,
  linkedSignal,
} from '@angular/core';
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
  arrayUnion,
  collection,
  count,
  deleteDoc,
  doc,
  getAggregate,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore/lite';
import ConfirmDialog, { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';
import { PROFILE_STATUS, PROFILE_STATUS_STYLES } from '../constant/common.const';
import { FIRESTORE } from '../firebase/provide-firebase';
import { Comment, ProfileDetail } from '../models/profile.model';
import { SortOption, ToolbarAction } from '../models/toolbar.model';
import { toCanonicalMobileNumber } from '../utils/mobile-number.util';
import { AuthService } from './auth.service';

/** The existing profile that already uses a Matrimony ID or mobile number. */
export interface DuplicateOwner {
  name: string;
  matrimonyId: string;
}

@Service()
export class ProfilesService {
  private authService = inject(AuthService);
  private firestore = inject(FIRESTORE);
  private readonly dialogService = inject(HlmDialogService);

  private profilesCollection = collection(this.firestore, 'profiles');

  /** The filter state with nothing narrowed: newest first, no search, status or star match. */
  static readonly DEFAULT_FILTER_OPTIONS: SortOption = {
    viewOrderCheck: true,
    searchQuery: '',
    profileStatus: null,
    starMatchScore: null,
  };

  public readonly filterOptions: WritableSignal<SortOption> = signal({
    ...ProfilesService.DEFAULT_FILTER_OPTIONS,
  });

  /** True when the sort order, search text, status or star match differ from the defaults. */
  readonly filterHasValue = computed(() => {
    const { viewOrderCheck, searchQuery, profileStatus, starMatchScore } = this.filterOptions();
    return (
      viewOrderCheck !== true ||
      (searchQuery ?? '').trim() !== '' ||
      profileStatus != null ||
      starMatchScore != null
    );
  });

  /** True when search text, status or star match narrow the list (sort order does not). */
  readonly isNarrowed = computed(() => {
    const { searchQuery, profileStatus, starMatchScore } = this.filterOptions();
    return (searchQuery ?? '').trim() !== '' || profileStatus != null || starMatchScore != null;
  });

  clearFilters(): void {
    this.filterOptions.set({ ...ProfilesService.DEFAULT_FILTER_OPTIONS });
  }

  /**
   * Back to the first page whenever the filters change. A linkedSignal makes that part of the same
   * update as the filter change, so the resource never sees (new filter, old page) and fires a
   * throwaway load in between. Still writable: the pager and refreshAfterDelete set it directly.
   */
  readonly pageState = linkedSignal<SortOption, { pageIndex: number; pageSize: number }>({
    source: this.filterOptions,
    computation: (_filter, previous) => ({
      pageIndex: 0,
      pageSize: previous?.value.pageSize ?? 12,
    }),
  });

  readonly totalCount = signal<number>(0);

  private cursorCache = new Map<number, QueryDocumentSnapshot | null>();
  private lastFilterKey = '';

  /** How long a confirmed delete stays undoable before the document is really deleted. */
  private static readonly DELETE_UNDO_MS = 6000;

  /**
   * Confirmed deletes still inside their undo window, keyed by profile id. `timer` is null once the
   * real delete has started (too late to undo). Their rows are hidden from every list result until
   * the entry is removed, whatever filter or page the user moves to meanwhile.
   */
  private readonly pendingDeletes = new Map<
    string,
    {
      timer: ReturnType<typeof setTimeout> | null;
      profile: ProfileDetail | undefined;
      /** The page the row was on, so the cursors after it can be dropped once it is really gone. */
      pageIndex: number;
    }
  >();

  /**
   * Set when a write may have changed which profiles match the active filters (or left the list
   * showing a profile that no longer matches). The next `refreshAfterWrite` then recounts and
   * drops the cursors; otherwise it only re-reads the current page.
   */
  private matchesMayBeStale = false;

  readonly drawerState = signal<{
    isOpen: BrnDialogState;
    actionType: ToolbarAction | null;
    selectedProfileId: string | null;
  }>({ isOpen: 'closed', actionType: null, selectedProfileId: null });

  constructor() {
    // This service outlives the session, so drop everything tied to the signed-in user (filters,
    // page, cursors, cached total, open drawer) as soon as they are signed out. Otherwise the
    // next login starts from the previous user's filters and a stale total.
    effect(() => {
      if (!this.authService.isAuthenticated()) {
        untracked(() => this.resetSessionState());
      }
    });
  }

  private resetSessionState(): void {
    // Pending deletes are dropped, not performed: signing out must never delete anything.
    this.pendingDeletes.forEach(({ timer }) => timer !== null && clearTimeout(timer));
    this.pendingDeletes.clear();
    this.clearFilters();
    this.pageState.set({ pageIndex: 0, pageSize: 12 });
    this.cursorCache.clear();
    this.lastFilterKey = '';
    this.totalCount.set(0);
    this.closeDrawer();
  }

  profiles = resource<
    ProfileDetail[],
    { filter: SortOption; page: { pageIndex: number; pageSize: number } } | undefined
  >({
    defaultValue: [],
    params: () =>
      this.authService.isAuthenticated()
        ? { filter: this.filterOptions(), page: this.pageState() }
        : undefined,
    loader: async ({ params, abortSignal }) => {
      const { filter, page } = params;
      const filterKey = this.buildFilterKey(filter);
      const filterChanged = filterKey !== this.lastFilterKey;

      // Work on private copies of the shared state. This load may be superseded (a newer filter or
      // page) while its requests are in flight; publishing straight into the service would let a
      // slow, stale response overwrite the newer one's total and page cursors.
      const cursors = filterChanged
        ? new Map<number, QueryDocumentSnapshot | null>()
        : new Map(this.cursorCache);
      // A fresh count still includes deletes that are pending (their documents exist until the
      // undo window ends); a reused total was already adjusted when the delete was confirmed.
      const pendingMatching = () => this.pendingDeletesMatching(filter);

      let total: number;
      let profiles: ProfileDetail[];
      if (filter.searchQuery.trim() !== '') {
        // A search returns every match at once, so its total is the size of that one result set
        // (counting it separately used to run the same two queries a second time).
        profiles = await this.getFilteredProfilesBySearch(filter);
        total = filterChanged
          ? Math.max(0, profiles.length - pendingMatching())
          : this.totalCount();
      } else {
        total = filterChanged
          ? Math.max(0, (await this.getProfilesCount(filter)) - pendingMatching())
          : this.totalCount();
        profiles = await this.getProfilePage(filter, page.pageIndex, page.pageSize, cursors);
      }

      // Published only for the current load and only after everything succeeded, so a failed
      // count or page is retried by the next load instead of leaving a stale total behind.
      if (!abortSignal.aborted) {
        this.cursorCache = cursors;
        this.totalCount.set(total);
        this.lastFilterKey = filterKey;
      }

      return profiles
        .filter((profile) => !this.pendingDeletes.has(String(profile.id)))
        .map((profile) => this.withStatusDisplay(profile));
    },
  });

  /** Adds the derived status label and badge colour used by the list views. */
  private withStatusDisplay(profile: ProfileDetail): ProfileDetail {
    return {
      ...profile,
      profileStatus: PROFILE_STATUS[profile.profileStatusId as keyof typeof PROFILE_STATUS],
      profileStatusColor:
        PROFILE_STATUS_STYLES[profile.profileStatusId as keyof typeof PROFILE_STATUS_STYLES]?.badge,
    };
  }

  /** Stable string key representing only the filter fields (not pagination). */
  private buildFilterKey(filter: SortOption): string {
    return `${filter.viewOrderCheck}|${filter.searchQuery}|${filter.profileStatus}|${filter.starMatchScore}`;
  }

  /** Base query with all where/orderBy clauses applied — no limit or cursor. */
  private buildBaseQuery(filter: SortOption, sortField = 'createdAt'): Query<DocumentData> {
    // viewOrderCheck is true for "Newest First" (descending) and false for "Oldest First"
    // (ascending) — see sortOrderToLabel in toolbar.ts.
    const sortDirectionStr: OrderByDirection = filter.viewOrderCheck ? 'desc' : 'asc';
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
    const snapshot = await getAggregate(this.buildBaseQuery(filter), {
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
    cursors: Map<number, QueryDocumentSnapshot | null>,
  ): Promise<ProfileDetail[]> {
    const cursor = cursors.get(pageIndex);

    if (pageIndex > 0 && cursor === undefined) {
      // Cache miss — user jumped to an unvisited page.
      // Fetch all docs up to the target page and build the full cursor chain.
      return this.fetchAndCacheUpToPage(filter, pageIndex, pageSize, cursors);
    }

    const baseQuery = this.buildBaseQuery(filter);
    const pagedQuery = cursor
      ? query(baseQuery, startAfter(cursor), limit(pageSize))
      : query(baseQuery, limit(pageSize));

    const snapshot = await getDocs(pagedQuery);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;
    if (lastDoc) {
      cursors.set(pageIndex + 1, lastDoc);
    }

    return this.sortWithRejectedLast(snapshot.docs.map((d) => this.mapDocToProfile(d)));
  }

  /**
   * Handles jumps to a page whose cursor is not known: reads from the nearest known cursor before
   * the target (or from the start when there is none) and caches the cursor of every page it
   * passes, so only the pages in between are downloaded.
   */
  private async fetchAndCacheUpToPage(
    filter: SortOption,
    targetPageIndex: number,
    pageSize: number,
    cursors: Map<number, QueryDocumentSnapshot | null>,
  ): Promise<ProfileDetail[]> {
    // The cursor stored for page i is the last document of page i - 1, so pages i, i + 1, ...
    // follow it.
    let firstPage = 0;
    let startCursor: QueryDocumentSnapshot | null = null;
    for (let i = targetPageIndex - 1; i > 0; i--) {
      const known = cursors.get(i);
      if (known) {
        firstPage = i;
        startCursor = known;
        break;
      }
    }

    const pagesToFetch = targetPageIndex - firstPage + 1;
    const baseQuery = this.buildBaseQuery(filter);
    const snapshot = await getDocs(
      startCursor
        ? query(baseQuery, startAfter(startCursor), limit(pageSize * pagesToFetch))
        : query(baseQuery, limit(pageSize * pagesToFetch)),
    );
    const docs = snapshot.docs;

    // Populate cursor cache for all pages we now have data for.
    for (let i = 0; i < pagesToFetch; i++) {
      const lastDocOfPage = docs[Math.min((i + 1) * pageSize, docs.length) - 1];
      if (lastDocOfPage) {
        cursors.set(firstPage + i + 1, lastDocOfPage);
      }
    }

    const pageStart = (targetPageIndex - firstPage) * pageSize;
    return this.sortWithRejectedLast(
      docs.slice(pageStart, pageStart + pageSize).map((d) => this.mapDocToProfile(d)),
    );
  }

  /** Search by matrimonyId OR mobileNumber — Firestore requires two parallel queries for OR across fields. */
  private async getFilteredProfilesBySearch(filter: SortOption): Promise<ProfileDetail[]> {
    const trimmedSearch = filter.searchQuery.trim();
    // viewOrderCheck is true for "Newest First" (descending) and false for "Oldest First"
    // (ascending) — see sortOrderToLabel in toolbar.ts.
    const sortDirectionStr: OrderByDirection = filter.viewOrderCheck ? 'desc' : 'asc';
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

    // Stored numbers are always canonical ("+91XXXXXXXXXX"), so a phone search is canonicalized
    // the same way; non-phone text falls through as-is so exact matching is unchanged.
    const mobileSearch = toCanonicalMobileNumber(trimmedSearch) ?? trimmedSearch;

    const [byMatrimonyId, byMobileNumber] = await Promise.all([
      getDocs(
        withCommonFilters(
          query(this.profilesCollection, where('matrimonyId', '==', trimmedSearch)),
        ),
      ),
      getDocs(
        withCommonFilters(
          query(this.profilesCollection, where('mobileNumber', '==', mobileSearch)),
        ),
      ),
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
    const target = this.profiles.hasValue()
      ? this.profiles.value().find((profile) => String(profile.id) === id)
      : undefined;
    const dialogRef = this.dialogService.open(ConfirmDialog, {
      context: {
        title: target ? `Delete ${target.name} (${target.matrimonyId})?` : 'Confirm Delete',
        description: target ? "This can't be undone." : 'Do you want to delete this record?',
        confirmLabel: 'Delete',
        destructive: true,
      } satisfies ConfirmDialogContext,
      contentClass: 'sm:max-w-md',
      // Cancel is right there (and Esc works); the corner X only collides with a long title.
      showCloseButton: false,
    });

    dialogRef.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.scheduleDelete(id, target);
      }
    });
  }

  /**
   * Re-runs the current query and recounts. Also drops the pagination cursors, which the loader
   * otherwise only does when the filters change. Use it when the list or its total may be wrong
   * (a failed load, a failed delete); writes that cannot change which profiles match use
   * `refreshAfterWrite` instead.
   */
  refreshProfiles(): void {
    this.lastFilterKey = '';
    this.matchesMayBeStale = false;
    this.profiles.reload();
  }

  /**
   * Refreshes the list after a save or a note. Re-reads the current page, but keeps the total and
   * the cursors unless the write may have changed which profiles match the filters (a status,
   * star match, ID or number edit under the filter that uses it): then it recounts like
   * `refreshProfiles`. A write never changes the sort field (`createdAt`), so the cursors stay
   * valid when it does not.
   */
  refreshAfterWrite(): void {
    if (this.matchesMayBeStale) {
      this.refreshProfiles();
    } else {
      this.profiles.reload();
    }
  }

  /** Forgets the cursors that start a page after `pageIndex`; those up to it are unaffected. */
  private dropCursorsAfter(pageIndex: number): void {
    for (const key of [...this.cursorCache.keys()]) {
      if (key > pageIndex) {
        this.cursorCache.delete(key);
      }
    }
  }

  /**
   * Shows the list from the top with no filters, e.g. right after a create, so the new profile
   * (newest first) is on screen whatever page or filter the user left the list on. Clearing the
   * filters publishes a new filter object, which also resets `pageState` to the first page and
   * re-runs the loader; the cleared key makes that run recount the total and drop old cursors.
   */
  showFirstPageUnfiltered(): void {
    this.lastFilterKey = '';
    this.clearFilters();
  }

  /**
   * After a delete, step back to the new last page when the deleted row was the only one on the
   * current last page, instead of reloading a page index that no longer exists (an empty page
   * that the pager then has to correct with a second load).
   */
  private refreshAfterDelete(deletedPageIndex: number): void {
    // The rows after the deleted one moved up, so the cursors that start a later page no longer
    // sit where they did; the ones up to its own page are before it and still valid. The total
    // already excludes this delete (adjusted when it was confirmed), so there is no recount.
    this.dropCursorsAfter(deletedPageIndex);
    if (!this.stepBackIfPastLastPage()) {
      this.profiles.reload();
    }
  }

  /** Moves to the last page that still exists after the total shrank; true if it moved. */
  private stepBackIfPastLastPage(): boolean {
    const { pageIndex, pageSize } = this.pageState();
    const lastPageIndex = Math.max(0, Math.ceil(this.totalCount() / pageSize) - 1);
    if (pageIndex <= lastPageIndex) {
      return false;
    }
    // Changing the page re-runs the loader, which reuses the adjusted total.
    this.pageState.update((state) => ({ ...state, pageIndex: lastPageIndex }));
    return true;
  }

  /**
   * Delayed delete: the row disappears at once and a toast offers Undo for DELETE_UNDO_MS; only
   * then is the document really deleted. Closing the tab or signing out inside the window simply
   * means it is not deleted (the safe direction).
   */
  private scheduleDelete(id: string, profile: ProfileDetail | undefined): void {
    if (this.pendingDeletes.has(id)) {
      return;
    }
    const timer = setTimeout(() => void this.finishDelete(id), ProfilesService.DELETE_UNDO_MS);
    this.pendingDeletes.set(id, { timer, profile, pageIndex: this.pageState().pageIndex });

    if (this.profiles.hasValue()) {
      this.profiles.value.update((rows) => rows.filter((row) => String(row.id) !== id));
    }
    this.totalCount.update((total) => Math.max(0, total - 1));
    this.stepBackIfPastLastPage();

    toast.success(
      profile ? `Deleted ${profile.name} (${profile.matrimonyId})` : 'Profile deleted',
      {
        duration: ProfilesService.DELETE_UNDO_MS,
        action: { label: 'Undo', onClick: () => this.undoDelete(id) },
      },
    );
  }

  private undoDelete(id: string): void {
    const pending = this.pendingDeletes.get(id);
    // Nothing to undo once the real delete has started (timer is null) or the session was reset.
    if (!pending || pending.timer === null) {
      return;
    }
    clearTimeout(pending.timer);
    this.pendingDeletes.delete(id);
    toast.success('Profile restored');
    // Nothing was deleted, so the cursors are intact. Give back the one the delete took off the
    // total when the profile belongs in the current list; without its data, recount to be safe.
    if (!pending.profile) {
      this.refreshProfiles();
      return;
    }
    if (this.matchesFilter(pending.profile, this.filterOptions())) {
      this.totalCount.update((total) => total + 1);
    }
    this.profiles.reload();
  }

  private async finishDelete(id: string): Promise<void> {
    const pending = this.pendingDeletes.get(id);
    if (!pending) {
      return;
    }
    this.pendingDeletes.set(id, { ...pending, timer: null });
    try {
      await deleteDoc(doc(this.firestore, 'profiles', id));
    } catch {
      this.pendingDeletes.delete(id);
      toast.error('Failed to delete profile');
      // The row comes back on the reload (and the total is recounted).
      this.refreshProfiles();
      return;
    }
    this.pendingDeletes.delete(id);
    this.refreshAfterDelete(pending.pageIndex);
  }

  /** How many pending deletes would appear in the list for this filter (they are still stored). */
  private pendingDeletesMatching(filter: SortOption): number {
    let matching = 0;
    for (const { profile } of this.pendingDeletes.values()) {
      if (profile && this.matchesFilter(profile, filter)) matching++;
    }
    return matching;
  }

  /** Whether a profile belongs in the list for this filter (status, star match and exact search). */
  private matchesFilter(profile: ProfileDetail, filter: SortOption): boolean {
    const search = filter.searchQuery.trim();
    const mobileSearch = toCanonicalMobileNumber(search) ?? search;
    const statusOk = !filter.profileStatus || profile.profileStatusId === filter.profileStatus;
    const starOk =
      filter.starMatchScore === null ||
      filter.starMatchScore === undefined ||
      profile.starMatchScore === filter.starMatchScore;
    const searchOk =
      search === '' || profile.matrimonyId === search || profile.mobileNumber === mobileSearch;
    return statusOk && starOk && searchOk;
  }

  async updateProfile(id: string, profileData: Partial<ProfileDetail>): Promise<void> {
    // The loaded profile also carries values that are not stored fields to write back: the
    // document id (derived), and createdAt/updatedAt (immutable creation time, server-set
    // update time). Sending them persisted a stray `id` and rewrote createdAt on every edit.
    const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...fields } = profileData;
    const previous = this.profiles.hasValue()
      ? this.profiles.value().find((row) => String(row.id) === id)
      : undefined;
    const docRef = doc(this.firestore, 'profiles', id);
    await updateDoc(docRef, { ...fields, updatedAt: serverTimestamp() });
    if (this.editMayChangeMatches(previous, fields)) {
      this.matchesMayBeStale = true;
    }
  }

  /**
   * Whether a write to these fields can add or remove the profile from the current list: only a
   * field that a filter in use matches on counts. A profile that is not in the loaded rows could
   * be anything, so that is treated as a possible change.
   */
  private editMayChangeMatches(
    previous: ProfileDetail | undefined,
    fields: Partial<ProfileDetail>,
  ): boolean {
    if (!previous) return true;
    const filter = this.filterOptions();
    const changed = (key: keyof ProfileDetail) => key in fields && fields[key] !== previous[key];
    return (
      (!!filter.profileStatus && changed('profileStatusId')) ||
      (filter.starMatchScore !== null &&
        filter.starMatchScore !== undefined &&
        changed('starMatchScore')) ||
      (filter.searchQuery.trim() !== '' && (changed('matrimonyId') || changed('mobileNumber')))
    );
  }

  /**
   * Changes only the status of a profile, optimistically: the matching row of the loaded list is
   * updated at once and restored if the write fails (the error is re-thrown for the caller).
   * The list is deliberately NOT reloaded, so the card keeps its place and any status filter
   * keeps showing it until the next reload or filter change. Undo is just another call with the
   * previous id (it bumps `updatedAt` again, as the app keeps no history).
   */
  async updateProfileStatus(id: string, statusId: keyof typeof PROFILE_STATUS): Promise<void> {
    const previous = this.profiles.hasValue()
      ? (this.profiles.value().find((p) => String(p.id) === id)?.profileStatusId ?? null)
      : null;
    this.setRowStatus(id, statusId);
    try {
      await this.updateProfile(id, { profileStatusId: statusId });
      // The list is not reloaded here, so under a status filter the card stays and the total is
      // off by one until something refreshes it; make that next refresh a recount.
      if (this.filterOptions().profileStatus) this.matchesMayBeStale = true;
    } catch (error) {
      if (previous) this.setRowStatus(id, previous);
      throw error;
    }
  }

  private setRowStatus(id: string, statusId: keyof typeof PROFILE_STATUS): void {
    if (!this.profiles.hasValue()) return;
    this.profiles.value.update((rows) =>
      rows.map((row) =>
        String(row.id) === id ? this.withStatusDisplay({ ...row, profileStatusId: statusId }) : row,
      ),
    );
  }

  /**
   * Appends one note with `arrayUnion` instead of rewriting the whole `comments` array, so notes
   * added elsewhere (or legacy ones) between load and save are never overwritten.
   */
  async addNote(id: string, value: string): Promise<Comment> {
    const note: Comment = { value, createDateAndTime: new Date() };
    const docRef = doc(this.firestore, 'profiles', id);
    await updateDoc(docRef, { comments: arrayUnion(note), updatedAt: serverTimestamp() });
    return note;
  }

  async addProfile(profileData: Partial<ProfileDetail>) {
    const profileToAdd = {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return addDoc(this.profilesCollection, profileToAdd);
  }

  /**
   * Looks for another profile that already uses the given Matrimony ID or mobile number (both
   * exact matches, so pass them in the stored form: trimmed ID, canonical "+91…" number). The
   * profile being edited is excluded through `excludeId`. A field that is left out is not checked.
   *
   * Fails open: if a lookup errors, that field is reported as free, so a flaky query never stops
   * someone from saving. This is a client-side check only; two saves at the same moment can still
   * both pass it.
   */
  async findDuplicates(criteria: {
    matrimonyId?: string;
    mobileNumber?: string;
    excludeId?: string | null;
  }): Promise<{ matrimonyId?: DuplicateOwner; mobileNumber?: DuplicateOwner }> {
    const lookup = async (
      field: 'matrimonyId' | 'mobileNumber',
      value: string | undefined,
    ): Promise<DuplicateOwner | undefined> => {
      if (!value) return undefined;
      try {
        // limit(2): one of the hits may be the profile being edited.
        const snapshot = await getDocs(
          query(this.profilesCollection, where(field, '==', value), limit(2)),
        );
        const other = snapshot.docs.find((doc) => doc.id !== criteria.excludeId);
        if (!other) return undefined;
        const data = other.data();
        return { name: String(data['name'] ?? ''), matrimonyId: String(data['matrimonyId'] ?? '') };
      } catch {
        return undefined;
      }
    };
    const [matrimonyId, mobileNumber] = await Promise.all([
      lookup('matrimonyId', criteria.matrimonyId),
      lookup('mobileNumber', criteria.mobileNumber),
    ]);
    return { matrimonyId, mobileNumber };
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
