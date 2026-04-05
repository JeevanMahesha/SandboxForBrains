import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';

import { FIREBASE_AUTH } from '../firebase/provide-firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(FIREBASE_AUTH);
  private destroyRef = inject(DestroyRef);

  readonly currentUser = signal<User | null>(null);
  readonly currentToken = signal<string | null>(null);
  readonly authInitialized = signal(false);

  readonly isAuthenticated = computed(() => {
    const hasUser = !!this.currentUser();
    const initialized = this.authInitialized();
    return hasUser && initialized;
  });

  constructor() {
    const unsubAuth = onAuthStateChanged(
      this.auth,
      (user) => {
        this.currentUser.set(user);
        this.authInitialized.set(true);
      },
      () => {
        this.authInitialized.set(true);
      },
    );

    const unsubToken = onIdTokenChanged(
      this.auth,
      async (user) => {
        try {
          this.currentToken.set(user ? await user.getIdToken() : null);
        } catch {
          this.currentToken.set(null);
        }
      },
      () => {
        this.currentToken.set(null);
      },
    );

    this.destroyRef.onDestroy(() => {
      unsubAuth();
      unsubToken();
    });
  }

  /**
   * Wait for Firebase Auth to initialize
   * This ensures we don't check auth state before Firebase has restored the session
   * Uses onAuthStateChanged which properly waits for session restoration
   */
  async waitForAuthInit(): Promise<void> {
    if (this.authInitialized()) {
      return;
    }

    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          this.currentUser.set(user);
          this.authInitialized.set(true);
          unsubscribe();
          resolve();
        },
        () => {
          this.authInitialized.set(true);
          unsubscribe();
          resolve();
        },
      );
    });
  }

  /**
   * Get the current ID token (access token)
   * @param forceRefresh - Force refresh the token even if it hasn't expired
   * @returns Promise with the ID token or null
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = this.auth.currentUser;
    if (!user) {
      return null;
    }
    try {
      return await user.getIdToken(forceRefresh);
    } catch {
      return null;
    }
  }

  /**
   * Check if the current token is valid
   * @returns Promise<boolean>
   */
  async isTokenValid(): Promise<boolean> {
    const token = await this.getIdToken();
    return !!token;
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    this.currentUser.set(null);
    this.currentToken.set(null);
    this.authInitialized.set(false);
    return await signOut(this.auth);
  }
}
