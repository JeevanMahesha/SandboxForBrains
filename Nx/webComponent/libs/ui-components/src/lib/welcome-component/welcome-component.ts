import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('welcome-component')
export class WelcomeComponent extends LitElement {
  @property() name = 'World';
  override render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
