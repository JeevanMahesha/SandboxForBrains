import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

export interface ICanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export class CanDeactivateGuardService
  implements CanDeactivate<ICanComponentDeactivate>
{
  canDeactivate(
    component: ICanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return component.canDeactivate();
  }
}
