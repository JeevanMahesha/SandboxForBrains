import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  loginModel = signal<Login>({
    email: '',
    password: '',
  });
  loginForm = form(this.loginModel, (loginForm) => {
    required(loginForm.email, { message: 'Email is required' });
    email(loginForm.email, { message: 'Invalid email address' });
    required(loginForm.password, { message: 'Password is required' });
    minLength(loginForm.password, 6, { message: 'Password must be at least 6 characters' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm().value();

    this.authService.login(email!, password!).subscribe({
      next: (userCredential) => {
        this.authService.currentUser.set(userCredential.user);
        this.snackBar.open('Login successful', 'Close', {
          duration: 1000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });

        this.router.navigate(['/']);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        let errorCode = '';
        if (error && typeof error === 'object' && 'code' in error) {
          errorCode = error.code as string;
        }
        this.errorMessage.set(this.getErrorMessage(errorCode));
      },
    });
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  }
}
