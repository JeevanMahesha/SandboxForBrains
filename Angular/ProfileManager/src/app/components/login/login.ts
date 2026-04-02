import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, FormField, FormRoot, ButtonModule, CardModule, InputTextModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
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
}
