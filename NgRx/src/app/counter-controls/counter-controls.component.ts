import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { incrementAction } from '../store/counter.actions';


@Component({
  selector: 'app-counter-controls',
  templateUrl: './counter-controls.component.html',
  styleUrls: ['./counter-controls.component.css'],
})
export class CounterControlsComponent {

  private store = inject(Store)

  increment() {
    this.store.dispatch(incrementAction())
  }

  decrement() {
  }
}
