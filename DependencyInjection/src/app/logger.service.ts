import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  constructor() {}

  log(message: string): void {
    console.log(message);
  }
}
