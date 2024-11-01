import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal',
  imports: [FormsModule],
  templateUrl: './signal.component.html',
  standalone: true,
})
export class SignalComponent {
  userName = signal('Jeevan Mahesha');
  userDetailNameValue: string | null = null;
  userDetailNumberValue: number | null = null;

  userDetail = signal<IUser>(
    {
      name: 'Jeevan Mahesha',
      userId: 1,
    },
    {
      equal: (prev, next) => prev.userId === next.userId,
    }
  );

  setUserName(userName: string) {
    this.userName.set(userName);
  }

  updateUserName(value: string) {
    this.userName.update((prev) => value.concat(prev));
  }

  updateUserDetailName() {
    if (!this.userDetailNameValue) {
      return;
    }
    this.userDetail.update((prev) => ({
      ...prev,
      name: this.userDetailNameValue!,
    }));
  }

  updateUserDetailNumber() {
    if (!this.userDetailNumberValue) {
      return;
    }
    this.userDetail.update((prev) => ({
      ...prev,
      userId: this.userDetailNumberValue!,
    }));
  }
}

interface IUser {
  name: string;
  userId: number;
}
