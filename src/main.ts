import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MealFormComponent } from './app/meal-form/meal-form.component';

bootstrapApplication(MealFormComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModule)],
});
