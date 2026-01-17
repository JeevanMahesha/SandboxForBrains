import { Component, signal, inject, DestroyRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.html',
})
export class App {
  private breakpointObserver = inject(BreakpointObserver);
  sidebarOpen = signal(true);
  isMobile = signal(false);
  private authService = inject(AuthService);
  isAuthenticated = this.authService.isAuthenticated;
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  constructor() {
    // Observe breakpoint changes
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        this.sidebarOpen.set(!result.matches);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  getSidebarMode(): 'over' | 'side' {
    return this.isMobile() ? 'over' : 'side';
  }

  logout(): void {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Logged out successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error logging out:', error);
          this.snackBar.open('Error logging out', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }
}
