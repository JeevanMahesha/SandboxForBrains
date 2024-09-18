import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { DB_NAMES } from '../common/db.name.list';
import { IUserProfile } from './auth.model';

@Injectable()
export class AuthService {
  #fireBaseDatabase = inject(Firestore);
  #angularFireAuth = inject(AngularFireAuth);
  loggedInUserDetail: IUserProfile | null = null;

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

  getCollection(
    collectionName: DB_NAMES
  ): CollectionReference<DocumentData, DocumentData> {
    return collection(this.#fireBaseDatabase, collectionName);
  }

  getUsers(): Observable<IUserProfile[]> {
    return collectionData(this.getCollection(DB_NAMES.USERS));
  }
}
