import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserDetail } from './app.model';

@Injectable()
export class AppService {
  httpClient = inject(HttpClient);
  url = 'https://jsonplaceholder.typicode.com/users';

  getUsers(): Observable<IUserDetail[]> {
    return this.httpClient.get<IUserDetail[]>(this.url);
  }
}
