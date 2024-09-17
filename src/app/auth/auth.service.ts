import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from } from 'rxjs';

@Injectable()
export class AuthService {
  #angularFireAuth = inject(AngularFireAuth);
  constructor() {}

  signInWithGoogle() {
    const auth = from(
      this.#angularFireAuth.signInWithPopup(new GoogleAuthProvider())
    );
  }
}
