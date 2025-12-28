import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
  idToken,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  user = toSignal(user(this.auth), { initialValue: null });
  idToken = toSignal(idToken(this.auth), { initialValue: null });

  currentUser = signal<User | null>(null);
  currentToken = signal<string | null>(null);
  authInitialized = signal<boolean>(false);

  isAuthenticated = computed(() => {
    const hasUser = !!this.currentUser();
    const initialized = this.authInitialized();
    return hasUser && initialized;
  });

  constructor() {
    effect(() => {
      this.currentUser.set(this.user());
    });

    effect(() => {
      this.currentToken.set(this.idToken());
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
      // onAuthStateChanged is called after Firebase completes session restoration
      // This is more reliable than subscribing to observables
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          // Update the user signal immediately
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

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    // Reset all auth state immediately
    this.currentUser.set(null);
    this.currentToken.set(null);
    this.authInitialized.set(false); // Reset so next login waits for auth init
    return from(signOut(this.auth));
  }
}
