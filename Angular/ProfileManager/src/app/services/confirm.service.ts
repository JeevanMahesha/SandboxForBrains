import { Service, inject } from '@angular/core';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { firstValueFrom } from 'rxjs';
import ConfirmDialog, { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';

export interface ConfirmOptions extends ConfirmDialogContext {
  /**
   * Explicit dialog id. Needed when the prompt opens over another Brain dialog (the profile
   * drawer): an auto-generated id can collide with it ("Dialog with ID ... already exists").
   */
  id?: string;
}

/**
 * The one place that opens the yes/no prompt. Closing it any other way than the confirm button
 * (Cancel, Esc, backdrop) resolves to false.
 *
 * Route guards ship in the initial bundle and this file pulls in the dialog code, so a guard must
 * load it with `await import('./confirm.service')` instead of a static import.
 */
@Service()
export class ConfirmService {
  private readonly dialogService = inject(HlmDialogService);

  async confirm({ id, ...context }: ConfirmOptions): Promise<boolean> {
    const dialogRef = this.dialogService.open(ConfirmDialog, {
      ...(id ? { id } : {}),
      context: context satisfies ConfirmDialogContext,
      contentClass: 'sm:max-w-md',
      // Cancel is right there (and Esc works); the corner X only collides with a long title.
      showCloseButton: false,
    });
    return (await firstValueFrom(dialogRef.closed$, { defaultValue: false })) === true;
  }
}
