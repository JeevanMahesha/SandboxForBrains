import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { UserCredential } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-v2-login',
  imports: [FormField, FormRoot],
  templateUrl: './login-v2.html',
})
export default class LoginV2 {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly showPassword = signal(false);

  readonly loginModel = signal<LoginModel>({ email: '', password: '' });

  readonly loginForm = form(
    this.loginModel,
    (f) => {
      required(f.email, { message: 'Email is required' });
      email(f.email, { message: 'Enter a valid email address' });
      required(f.password, { message: 'Password is required' });
      minLength(f.password, 6, { message: 'Password must be at least 6 characters' });
    },
    {
      submission: {
        action: async ({ email: emailField, password: passwordField }) => {
          await this.authService
            .login(emailField().value(), passwordField().value())
            .then((cred: UserCredential) => {
              this.authService.currentUser.set(cred.user);
              toast.success('Login successful');
              this.router.navigate(['/v2']);
            })
            .catch(() => toast.error('Login failed — check your credentials'));
        },
      },
    },
  );

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
