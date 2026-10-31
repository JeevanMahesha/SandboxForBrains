import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/** Old "Add Profile" links (`/?actionType=create&openDrawer=true`) now land on the wizard. */
export const legacyCreateRedirectGuard: CanActivateFn = (route) =>
  route.queryParamMap.get('actionType') === 'create'
    ? inject(Router).createUrlTree(['/profiles/new'])
    : true;
