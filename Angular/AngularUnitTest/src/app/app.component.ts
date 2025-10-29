import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AngularUnitTest';
  users$ = new BehaviorSubject<IUser[]>([]);

  addNewUser(newUser: IUser): void {
    this.users$.next([...this.users$.getValue(), newUser]);
  }

  removeUsers(userId: string): void {
    const userValue = this.users$
      .getValue()
      .filter((eachUser) => eachUser.id !== userId);
    this.users$.next(userValue);
  }
}

interface IUser {
  id: string;
  name: string;
}
