import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [
    FormField,
    CardModule,
    InputTextModule,
    ButtonModule,
    FormRoot,
    FloatLabel,
    PasswordModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  loginModel = signal<Login>({
    email: '',
    password: '',
  });
  loginForm = form(
    this.loginModel,
    (loginForm) => {
      required(loginForm.email, { message: 'Email is required' });
      email(loginForm.email, { message: 'Invalid email address' });
      required(loginForm.password, { message: 'Password is required' });
      minLength(loginForm.password, 6, { message: 'Password must be at least 6 characters' });
    },
    {
      submission: {
        action: async ({ email, password }) => {
          return await this.authService
            .login(email().value(), password().value())
            .then((userCredential: UserCredential) => {
              this.authService.currentUser.set(userCredential.user);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Login successful',
              });
              this.router.navigate(['/']);
            })
            .catch(() => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Login failed',
              });
            });
        },
      },
    },
  );

  onSubmit() {
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm().value();

    // this.authService.login(email!, password!).subscribe({
    //   next: (userCredential) => {
    //     this.authService.currentUser.set(userCredential.user);
    //     this.snackBar.open('Login successful', 'Close', {
    //       duration: 1000,
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       panelClass: ['success-snackbar'],
    //     });

    //     this.router.navigate(['/']);
    //     this.isLoading.set(false);
    //   },
    //   error: (error: unknown) => {
    //     this.isLoading.set(false);
    //     let errorCode = '';
    //     if (error && typeof error === 'object' && 'code' in error) {
    //       errorCode = error.code as string;
    //     }
    //     this.errorMessage.set(this.getErrorMessage(errorCode));
    //   },
    // });
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
