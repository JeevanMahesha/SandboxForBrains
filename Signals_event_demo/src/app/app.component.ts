import { Component, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Signals';
  #URL = 'https://jsonplaceholder.typicode.com/users';
  #httpClient = inject(HttpClient);
  searchValue = signal<string>('');
  userDetail = signal<IUserDetail[]>([]);
  userDetailFilter: Signal<IUserDetail[]> = signal<IUserDetail[]>([]);

  constructor() {
    this.#httpClient.get<IUserDetail[]>(this.#URL).subscribe((userResponse) => {
      this.userDetail = signal(userResponse);
      this.userDetailFilter = computed(this.filterUserDetail.bind(this));
    });
  }

  searchUserDetail(searchInput: EventTarget | null) {
    const searchInputValue = searchInput as HTMLInputElement;
    this.searchValue.set(searchInputValue.value);
  }

  private filterUserDetail(): IUserDetail[] {
    return this.userDetail().filter(
      (eachUser) =>
        eachUser.name
          .toLowerCase()
          .includes(this.searchValue().toLowerCase()) ||
        eachUser.username
          .toLowerCase()
          .includes(this.searchValue().toLowerCase())
    );
  }
}

export interface IUserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  address: IAddress;
  phone: string;
  website: string;
  company: ICompany;
}

export interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: IGeo;
}

export interface IGeo {
  lat: string;
  lng: string;
}

export interface ICompany {
  name: string;
  catchPhrase: string;
  bs: string;
}
