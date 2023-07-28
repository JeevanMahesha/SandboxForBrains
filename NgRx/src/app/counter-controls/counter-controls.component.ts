import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { decrementAction, incrementAction } from '../store/counter.actions';


@Component({
  selector: 'app-counter-controls',
  templateUrl: './counter-controls.component.html',
  styleUrls: ['./counter-controls.component.css'],
})
export class CounterControlsComponent {

  private store = inject(Store)

  increment() {
    this.store.dispatch(incrementAction({ value: 2,  }))
  }

  decrement() {
    this.store.dispatch(decrementAction({ value: 2,  }))

  }
}
