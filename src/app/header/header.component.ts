import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isCollapsed = signal(true);
  #authService = inject(AuthService);
  #router = inject(Router);

  toggleNavbar() {
    this.isCollapsed.update((isCollapsed) => !isCollapsed);
  }

  logout() {
    this.#authService.signOut();
    this.#router.navigate(['/login']);
  }
}
