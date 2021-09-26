import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { ServersService } from "../servers.service";

export interface IServer {
  id: number;
  name: string;
  status: string;
}

@Injectable()
export class ResolverService implements Resolve<IServer> {
  constructor(private serverService: ServersService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): IServer | Observable<IServer> | Promise<IServer> {
    return this.serverService.getServer(+route.params["id"]);
  }
}
