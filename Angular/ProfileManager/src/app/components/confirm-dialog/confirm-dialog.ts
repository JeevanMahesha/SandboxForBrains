import { Component, inject } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDialogDescription,
  HlmDialogFooter,
  HlmDialogHeader,
  HlmDialogTitle,
} from '@spartan-ng/helm/dialog';

export interface ConfirmDialogContext {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [HlmButton, HlmDialogHeader, HlmDialogTitle, HlmDialogDescription, HlmDialogFooter],
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>{{ title }}</h3>
      <p hlmDialogDescription>{{ description }}</p>
    </hlm-dialog-header>
    <hlm-dialog-footer>
      <button type="button" hlmBtn variant="outline" (click)="close(false)">
        {{ cancelLabel }}
      </button>
      <button
        type="button"
        hlmBtn
        [class]="destructive ? 'bg-destructive text-white hover:bg-destructive/90 border-destructive' : ''"
        (click)="close(true)"
      >
        {{ confirmLabel }}
      </button>
    </hlm-dialog-footer>
  `,
  host: { class: 'contents' },
})
export default class ConfirmDialog {
  private readonly dialogRef = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly context = injectBrnDialogContext<ConfirmDialogContext>();

  protected readonly title = this.context.title ?? 'Are you sure?';
  protected readonly description = this.context.description ?? '';
  protected readonly confirmLabel = this.context.confirmLabel ?? 'Confirm';
  protected readonly cancelLabel = this.context.cancelLabel ?? 'Cancel';
  protected readonly destructive = this.context.destructive ?? false;

  protected close(result: boolean): void {
    this.dialogRef.close(result);
  }
}
