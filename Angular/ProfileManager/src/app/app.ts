import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  template: `<p-toast />
    <p-confirmdialog />
    <router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
