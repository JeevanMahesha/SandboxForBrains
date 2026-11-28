import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToaster],
  template: `<router-outlet />

    @defer (on idle) {
      <hlm-toaster />
    } `,
})
export class App {
  constructor() {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Route guards only run on navigation, so a session that ends while a page is open (token
    // revoked, signed out in another tab) would otherwise leave an empty list on screen. Only the
    // signed-in -> signed-out transition redirects: a plain "not signed in" check at startup would
    // race the auth guard and drop its returnUrl.
    let wasSignedIn = false;
    effect(() => {
      const signedIn = !!authService.user();
      if (wasSignedIn && !signedIn) {
        router.navigate(['/login']);
      }
      wasSignedIn = signedIn;
    });
  }
}
