import { inject, Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { filter, from, Observable } from 'rxjs';
import { DB_NAMES } from '../common/db.name.list';
import { IAuthStateResponse, IUserProfile } from './auth.model';

@Injectable()
export class AuthService {
  #fireBaseDatabase = inject(Firestore);
  #angularFireAuth = inject(AngularFireAuth);
  #auth = inject(Auth);
  authState$: Observable<IAuthStateResponse> = authState(this.#auth);
  loggedInUserDetail: IUserProfile | null = null;

  constructor() {
    this.authState$.pipe(filter((user) => !!user)).subscribe((user) => {
      const userDetail = user.providerData.at(0)!;
      this.loggedInUserDetail = {
        email: userDetail?.email,
        name: userDetail?.displayName,
        id: userDetail?.uid,
        verified_email: null,
        given_name: null,
        family_name: null,
        picture: userDetail?.photoURL,
        granted_scopes: userDetail?.providerId,
      };
    });
  }

  signInWithGoogle(): void {
    from(
      this.#angularFireAuth.signInWithPopup(new GoogleAuthProvider())
    ).subscribe((authResponse) => {
      this.loggedInUserDetail = authResponse.additionalUserInfo
        ?.profile as IUserProfile;
      if (authResponse.additionalUserInfo?.isNewUser) {
        addDoc(this.getCollection(DB_NAMES.USERS), {
          ...this.loggedInUserDetail,
        });
      }
    });
  }

  signOut(): void {
    this.#auth.signOut();
    this.loggedInUserDetail = null;
  }

  getCollection(
    collectionName: DB_NAMES
  ): CollectionReference<DocumentData, DocumentData> {
    return collection(this.#fireBaseDatabase, collectionName);
  }

  getUsers(): Observable<IUserProfile[]> {
    return collectionData(this.getCollection(DB_NAMES.USERS));
  }
}
