import * as Realm from 'realm-web';
import { environmentValues } from 'src/environment/environment';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  title = 'roomFoodApp';
}
