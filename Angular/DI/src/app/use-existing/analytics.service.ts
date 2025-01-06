import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsService {
  constructor() {
    console.log('AnalyticsService trackEvent');
  }
}
