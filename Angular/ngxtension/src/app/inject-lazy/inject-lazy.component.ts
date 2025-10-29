import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { injectLazy } from 'ngxtension/inject-lazy';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-inject-lazy',
  standalone: true,
  imports: [CommonModule, AsyncPipe, JsonPipe],
  templateUrl: './inject-lazy.component.html',
  styleUrls: ['./inject-lazy.component.css'],
})
export class InjectLazyComponent {
  userDetailService$ = injectLazy(() => import('./inject-lazy.service'));
  userDetail$;

  constructor() {
    this.userDetail$ = this.userDetailService$.pipe(
      switchMap((res) => res.getUserDetails())
    );
  }
}
