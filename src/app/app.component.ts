import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Rooted-Baskets';
  #authService = inject(AuthService);

  get isUserLoggedIn() {
    return !!this.#authService.loggedInUserDetail;
  }

  login() {
    this.#authService.signInWithGoogle();
  }
}
