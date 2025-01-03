import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TodoStore } from './with-out-rx-js/todo.store';
import { WithOutRxJsComponent } from './with-out-rx-js/with-out-rx-js.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [MatTabsModule, WithOutRxJsComponent],
})
export class AppComponent {
  title = 'ngrxSignals';
}
