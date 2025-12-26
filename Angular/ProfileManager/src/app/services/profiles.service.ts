import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { Observable, from, map, of } from 'rxjs';
import { Comment, Profile } from '../models/profile';
import { PROFILE_STATUS } from '../constant/common';

@Injectable({
  providedIn: 'root',
})
export class ProfilesService {
  private firestore = inject(Firestore);
  private profilesCollection = collection(this.firestore, 'profiles');

  /**
   * Add a new profile to Firestore
   */
  addProfile(profileData: Partial<Profile>): Observable<string> {
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
  ): Observable<Profile[]> {
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
    );
  }

  /**
   * Get a single profile by ID
   */
  getProfileById(id: string): Observable<Profile | null> {
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

  getProfilesByMatrimonyId(matrimonyId: string | null): Observable<Profile[]> {
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
  updateProfile(id: string, profileData: Partial<Profile>): Observable<void> {
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
  deleteProfile(id: string): Observable<void> {
    const docRef = doc(this.firestore, 'profiles', id);
    return from(deleteDoc(docRef));
  }

  /**
   * Add a comment to a profile
   */
  addComment(id: string, comments: Comment[]): Observable<void> {
    const docRef = doc(this.firestore, 'profiles', id);
    // Convert Date objects to Firestore Timestamps for storage
    const commentsForFirestore = comments.map((comment) => ({
      value: comment.value,
      createDateAndTime: Timestamp.fromDate(comment.createDateAndTime),
    }));
    return from(
      updateDoc(docRef, {
        comments: commentsForFirestore,
        updatedAt: Timestamp.now(),
      }),
    );
  }

  private mapDocToProfile(doc: QueryDocumentSnapshot | DocumentSnapshot): Profile {
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
    } as unknown as Profile;
  }
}
