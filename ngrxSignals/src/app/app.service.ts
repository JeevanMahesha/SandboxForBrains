import { Injectable } from '@angular/core';
import { TODOS } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  async getTodos() {
    await sleep(1000);
    return TODOS;
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
