import { computed, inject, Service, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';

import { authState$, idToken$ } from '../firebase/firebase-rx';
import { FIREBASE_AUTH } from '../firebase/provide-firebase';

@Service()
export class AuthService {
  private auth = inject(FIREBASE_AUTH);

  readonly user = toSignal(authState$(this.auth), { initialValue: null });
  readonly idToken = toSignal(idToken$(this.auth), { initialValue: null });

  readonly authInitialized = signal<boolean>(false);

  readonly isAuthenticated = computed(() => !!this.user() && this.authInitialized());

  /**
   * Wait for Firebase Auth to initialize before checking auth state.
   * onAuthStateChanged fires once immediately with the restored session (or null),
   * guaranteeing we never act on intermediate state.
   */
  async waitForAuthInit(): Promise<void> {
    if (this.authInitialized()) {
      return;
    }

    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        () => {
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

  async login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    // onAuthStateChanged fires after signOut — user signal goes null reactively.
    // Reset authInitialized so waitForAuthInit re-arms for the next login.
    this.authInitialized.set(false);
  }
}
