import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Auth, authState, GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { addDoc, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { filter, from, Observable } from 'rxjs';
import { DB_NAMES } from '../common/db.name.list';
import { DBService } from '../db/db.service';
import { IAuthStateResponse, IUserProfile } from './auth.model';

@Injectable()
export class AuthService implements OnInit {
  #dbService = inject(DBService);
  #angularFireAuth = inject(AngularFireAuth);
  #auth = inject(Auth);
  #router = inject(Router);
  #authState$: Observable<IAuthStateResponse> = authState(this.#auth);
  loggedInUserDetail = signal<IUserProfile | null>(null);

  ngOnInit(): void {
    this.#authState$.pipe(filter((user) => !!user)).subscribe((user) => {
      const userDetail = user.providerData.at(0)!;
      this.loggedInUserDetail.set({
        email: userDetail?.email,
        name: userDetail?.displayName,
        id: userDetail?.uid,
        verified_email: null,
        given_name: null,
        family_name: null,
        picture: userDetail?.photoURL,
        granted_scopes: userDetail?.providerId,
      });
      this.#router.navigate(['/products']);
    });
  }

  signInWithGoogle(): void {
    from(
      this.#angularFireAuth.signInWithPopup(new GoogleAuthProvider())
    ).subscribe((authResponse) => {
      this.loggedInUserDetail.set(
        authResponse.additionalUserInfo?.profile as IUserProfile
      );
      if (authResponse.additionalUserInfo?.isNewUser) {
        addDoc(this.#dbService.getCollection(DB_NAMES.USERS), {
          ...this.loggedInUserDetail,
        });
      }
      this.#router.navigate(['/products']);
    });
  }

  signOut(): void {
    this.#auth.signOut();
    this.loggedInUserDetail.set(null);
  }

  getUsers(): Observable<IUserProfile[]> {
    return collectionData(this.#dbService.getCollection(DB_NAMES.USERS));
  }
}
