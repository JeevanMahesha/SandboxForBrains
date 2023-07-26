import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DbAccess } from './DB/DB.access';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  private _db = inject(DbAccess);
  constructor() {
    this._db.getCredentials();
  }
}
