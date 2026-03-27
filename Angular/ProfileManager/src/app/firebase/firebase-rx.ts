import { Auth, onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

function fromFirebaseListener<T>(
  subscribe: (next: (value: T) => void, error: (err: unknown) => void) => () => void,
): Observable<T> {
  return new Observable<T>((subscriber) => {
    const unsubscribe = subscribe(
      (value) => subscriber.next(value),
      (err) => subscriber.error(err),
    );
    return () => unsubscribe();
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
}

export function authState$(auth: Auth): Observable<User | null> {
  return fromFirebaseListener((next, error) => onAuthStateChanged(auth, next, error));
}

export function idToken$(auth: Auth): Observable<string | null> {
  return new Observable<string | null>((subscriber) => {
    const unsubscribe = onIdTokenChanged(
      auth,
      async (user) => {
        try {
          subscriber.next(user ? await user.getIdToken() : null);
        } catch (e) {
          subscriber.error(e);
        }
      },
      (err) => subscriber.error(err),
    );
    return () => unsubscribe();
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
}
