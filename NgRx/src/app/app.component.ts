import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { initialAction } from './store/counter.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private store = inject(Store<{ value: number }>)
  constructor() {
    this.store.dispatch(initialAction())
  }
}
