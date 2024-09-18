import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {} from '@angular/fire/storage';
import { from } from 'rxjs';
import { IUserProfile } from './auth.model';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DB_NAMES } from '../common/db.name.list';

@Injectable()
export class AuthService {
  fireBaseDatabase = inject(AngularFireDatabase);
  #angularFireAuth = inject(AngularFireAuth);
  loggedInUserDetail: IUserProfile | null = null;

  signInWithGoogle(): void {
    from(
      this.#angularFireAuth.signInWithPopup(new GoogleAuthProvider())
    ).subscribe((authResponse) => {
      this.loggedInUserDetail = authResponse.additionalUserInfo
        ?.profile as IUserProfile;
      if (authResponse.additionalUserInfo?.isNewUser) {
        this.fireBaseDatabase
          .object(DB_NAMES.USERS)
          .set(this.loggedInUserDetail);
      }
    });
  }
}
