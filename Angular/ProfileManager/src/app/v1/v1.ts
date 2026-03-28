import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-v1',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './v1.html',
  styleUrl: './v1.css',
})
export default class V1 {
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
