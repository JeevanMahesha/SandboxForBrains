import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {APIResponse} from './with-rx-js.model';

@Injectable()
export class WithRxJsService {
  httpClient = inject(HttpClient);
  #baseUrl = 'https://dummyjson.com/todos';

  getTodos() {
    return this.httpClient.get<APIResponse>(this.#baseUrl);
  }
}
