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
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Profile } from '../models/profile';
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
    sortField: string = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc',
    filters?: {
      profileStatus?: keyof typeof PROFILE_STATUS | null;
      starMatchScore?: number | null;
    }
  ): Observable<Profile[]> {
    let q = query(this.profilesCollection);

    // Apply filters using where clauses
    if (filters?.profileStatus) {
      q = query(q, where('profileStatusId', '==', filters.profileStatus));
    } else {
      q = query(q, where('profileStatusId', '!=', PROFILE_STATUS.REJECTED.toUpperCase()));
    }

    if (filters?.starMatchScore !== null && filters?.starMatchScore !== undefined) {
      q = query(q, where('starMatchScore', '==', filters.starMatchScore));
    }

    // Apply sorting - must come after where clauses
    q = query(q, orderBy(sortField, sortDirection));

    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const profiles = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamps to Date objects
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date(),
          } as unknown as Profile;
        });
        return profiles;
      })
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
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date(),
          } as unknown as Profile;
        }
        return null;
      })
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
  addComment(id: string, comments: string[]): Observable<void> {
    const docRef = doc(this.firestore, 'profiles', id);
    return from(
      updateDoc(docRef, {
        comments,
        updatedAt: Timestamp.now(),
      })
    );
  }
}
