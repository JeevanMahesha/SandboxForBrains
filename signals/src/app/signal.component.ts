import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signal',
  imports: [FormsModule],
  template: `
    <div class="d-flex justify-content-evenly">
      <div class="col-md-4">
        <div class="card mt-2">
          <h5 class="card-header">signal API</h5>
          <div class="card-body">
            <h6 class="card-title">{{ userName() }}</h6>
          </div>
          <div class="card-footer text-body-secondary">
            <a class="card-link" (click)="setUserName('John')"> set Value </a>
            <a class="card-link" (click)="updateUserName('Hello')">
              update Value
            </a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card mt-2">
          <h5 class="card-header">signal API with Object Value</h5>
          <div class="card-body">
            <h6 class="card-title">
              <p>Name: {{ userDetail().name }}</p>
              <p>Name: {{ userDetail().userId }}</p>
              <div class="input-group flex-nowrap">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="addon-wrapping"
                  [(ngModel)]="userDetailNameValue"
                />
              </div>
              <div class="input-group mt-1 flex-nowrap">
                <input
                  type="text"
                  class="form-control"
                  placeholder="UserId"
                  aria-label="UserId"
                  aria-describedby="addon-wrapping"
                  [(ngModel)]="userDetailNumberValue"
                />
              </div>
            </h6>
            <a class="card-link" (click)="updateUserDetailName()">
              update user Name
            </a>
            <a class="card-link" (click)="updateUserDetailNumber()">
              update user Number
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
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
