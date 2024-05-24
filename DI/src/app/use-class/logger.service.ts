import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {
  constructor() {
    console.log('😌 i am LoggerService');
  }
}
