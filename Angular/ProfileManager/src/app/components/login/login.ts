import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideHeart, lucideLoaderCircle } from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { ProfileAvatar } from '../shared/profile-avatar/profile-avatar';
import { ScoreRing } from '../shared/score-ring/score-ring';
import { AuthService } from '../../services/auth.service';

/** Only in-app paths ("/profiles/new"); never "//host", "/\\host" or absolute URLs. */
function isInternalPath(url: string | null): url is string {
  return url !== null && /^\/(?![/\\])/.test(url);
}

/**
 * Maps a Firebase Auth error to what the user should read. Wrong password, unknown email and a
 * malformed email all give the same text on purpose, so the form never reveals which accounts exist.
 */
function loginErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'Incorrect email or password';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Cannot reach the server. Check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    default:
      return 'Login failed. Please try again.';
  }
}

interface Login {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    FormRoot,
    HlmButton,
    HlmInput,
    NgIcon,
    ProfileAvatar,
    ScoreRing,
    ...HlmFieldImports,
    HlmSpinnerImports,
  ],
  templateUrl: './login.html',
  providers: [provideIcons({ lucideEye, lucideEyeOff, lucideHeart, lucideLoaderCircle })],
})
export default class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly showPassword = signal(false);
  /** Inline sign-in failure, shown under the fields and cleared when the user edits or retries. */
  readonly loginError = signal<string | null>(null);
  private readonly passwordInput = viewChild<ElementRef<HTMLInputElement>>('passwordInput');
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
          this.loginError.set(null);
          return await this.authService
            .login(email().value(), password().value())
            .then(() => {
              toast.success('Login successful');
              // The auth guard sends visitors here with the page they asked for.
              const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
              this.router.navigateByUrl(isInternalPath(returnUrl) ? returnUrl : '/');
            })
            .catch((error: unknown) => {
              this.loginError.set(loginErrorMessage(error));
              this.passwordInput()?.nativeElement.focus();
            });
        },
      },
    },
  );
}
