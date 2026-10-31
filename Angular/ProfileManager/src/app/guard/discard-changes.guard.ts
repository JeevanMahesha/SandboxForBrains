import { inject, Injector } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import type { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';

export interface HasUnsavedInput {
  hasUnsavedInput(): boolean;
}

/** Asks before leaving a page that holds typed-but-unsaved input; closing the dialog keeps it. */
export const discardChangesGuard: CanDeactivateFn<HasUnsavedInput> = async (component) => {
  if (!component.hasUnsavedInput()) return true;

  const injector = inject(Injector);
  // Route guards ship in the initial bundle, the dialog code does not: load it on demand.
  const [{ HlmDialogService }, { default: ConfirmDialog }] = await Promise.all([
    import('@spartan-ng/helm/dialog'),
    import('../components/confirm-dialog/confirm-dialog'),
  ]);

  const dialogRef = injector.get(HlmDialogService).open(ConfirmDialog, {
    context: {
      title: 'Discard this new profile?',
      description: 'The details you entered have not been saved and will be lost.',
      confirmLabel: 'Discard',
      destructive: true,
    } satisfies ConfirmDialogContext,
    contentClass: 'sm:max-w-md',
    showCloseButton: false,
  });
  const confirmed = await firstValueFrom(dialogRef.closed$, { defaultValue: false });
  return confirmed === true;
};
