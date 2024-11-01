import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal',
  imports: [],
  templateUrl: './signal.component.html',
  standalone: true,
})
export class SignalComponent {
  userName = signal('Jeevan Mahesha');

  setUserName(userName: string) {
    this.userName.set(userName);
  }

  updateUserName(value: string) {
    this.userName.update((prev) => value.concat(prev));
  }
}
