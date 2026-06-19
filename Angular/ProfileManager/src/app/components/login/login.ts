import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { UserCredential } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot, HlmButton, HlmInput, ...HlmCardImports, ...HlmFieldImports],
  templateUrl: './login.html',
})
export default class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  readonly loginModel = signal<Login>({
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
              toast.success('Login successful');
              this.router.navigate(['/']);
            })
            .catch(() => {
              toast.error('Login failed');
            });
        },
      },
    },
  );
}
