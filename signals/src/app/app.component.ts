import { Component, Signal, computed, signal } from '@angular/core';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        TitleCasePipe,
    ],
})
export class AppComponent {
  title = 'signals';
  userName = signal('');
  users = signal(orgUserArray);
  filteredUsersArray = computed(this.filterUserWithUserName.bind(this));

  setUserName(par: Event): void {
    const userNameValue = par.target as unknown as HTMLInputElement;
    this.userName.set(userNameValue.value as string);
  }

  addNewUser() {
    this.users.mutate(() => {
      this.users().push({
        name: this.userName(),
        age: this.getRandomAge(),
      });
    });
  }

  private filterUserWithUserName() {
    return this.users().filter((eachUser) =>
      eachUser.name
        ?.toLowerCase()
        ?.includes(this.userName()?.toLowerCase() as string)
    );
  }

  private getRandomAge(): number {
    return Math.floor(Math.random() * (55 - 15 + 1)) + 15;
  }
}

interface IUser {
  name: string | null;
  age: number;
}

const orgUserArray = [
  { name: 'John Doe', age: 30 },
  { name: 'Jane Smith', age: 25 },
  // { name: 'Michael Johnson', age: 35 },
  // { name: 'Emily Davis', age: 28 },
  // { name: 'Daniel Brown', age: 32 },
  // { name: 'Sophia Wilson', age: 27 },
  // { name: 'David Thompson', age: 31 },
  { name: 'Olivia Clark', age: 26 },
  // { name: 'William Allen', age: 29 },
  { name: 'Emma Turner', age: 33 },
];
