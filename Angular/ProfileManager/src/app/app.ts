import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmToaster } from '@spartan-ng/helm/sonner';
import { ProfilesService } from './services/profiles.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToaster, BrnAlertDialogContent, ...HlmAlertDialogImports],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly profileService = inject(ProfilesService);
  // Instantiated eagerly so its theme-applying effects run for the session.
  private readonly themeService = inject(ThemeService);
}
