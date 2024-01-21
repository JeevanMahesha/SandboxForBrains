import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export default class InjectLazyService {
  private readonly http = inject(HttpClient);
  #URL = 'https://jsonplaceholder.typicode.com/users';

  getUserDetails() {
    return this.http.get(this.#URL);
  }
}
