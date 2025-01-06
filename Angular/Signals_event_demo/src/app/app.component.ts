import {
  Component,
  Signal,
  computed,
  Injector,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable, concat, concatMap, from, map, of, toArray } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
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
  logger = effect(() =>
    console.log("Hello I'm effect in signal", this.searchValue())
  );
  userDetailFilter$: Observable<IUserDetail[]> | null = null;
  private injector = inject(Injector);

  constructor() {
    this.#httpClient.get<IUserDetail[]>(this.#URL).subscribe((userResponse) => {
      this.userDetail = signal(userResponse);
      this.userDetailFilter = computed(this.filterUserDetail.bind(this));
      this.userDetailFilter$ = toObservable(this.userDetail, {
        injector: this.injector,
      }).pipe(
        concatMap((each) => from(each)),
        concatMap((eachUser) => {
          eachUser.company.name = eachUser.company.name.concat(' -> toObs');
          return of(eachUser);
        }),
        toArray()
      );
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
