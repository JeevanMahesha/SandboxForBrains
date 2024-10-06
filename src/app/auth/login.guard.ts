import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IAuthStateResponse } from './auth.model';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const authService = inject(AuthService);
  const authState$: Observable<IAuthStateResponse> = authState(auth);
  authState$
    .pipe(
      map((user) => {
        if (!user) {
          return true;
        }
        authService.setLoggedInUserDetail(user.providerData.at(0)!);
        return false;
      })
    )
    .subscribe(console.log);
  return true;
};
