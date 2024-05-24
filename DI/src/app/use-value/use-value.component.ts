import { Component, inject } from '@angular/core';
import { BASE_API_URL } from './app.tokens';

@Component({
  selector: 'app-use-value',
  standalone: true,
  template: `
    <h3>
      When you use <strong>useValue</strong>, you provide a literal value
      directly to a dependency injection token. This is particularly useful for
      configuration objects or constant values that do not require any complex
      logic to instantiate.
    </h3>
  `,
  providers: [{ provide: BASE_API_URL, useValue: 'https://api.example.com' }],
})
export default class UseValueComponent {
  constructor() {
    console.log(inject(BASE_API_URL));
  }
}
