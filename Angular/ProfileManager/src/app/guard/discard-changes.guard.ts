import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { map, take } from 'rxjs';
import ConfirmDialog, { ConfirmDialogContext } from '../components/confirm-dialog/confirm-dialog';

export interface HasUnsavedInput {
  hasUnsavedInput(): boolean;
}

/** Asks before leaving a page that holds typed-but-unsaved input; closing the dialog keeps it. */
export const discardChangesGuard: CanDeactivateFn<HasUnsavedInput> = (component) => {
  if (!component.hasUnsavedInput()) return true;

  const dialogRef = inject(HlmDialogService).open(ConfirmDialog, {
    context: {
      title: 'Discard this new profile?',
      description: 'The details you entered have not been saved and will be lost.',
      confirmLabel: 'Discard',
      destructive: true,
    } satisfies ConfirmDialogContext,
    contentClass: 'sm:max-w-md',
  });
  return dialogRef.closed$.pipe(
    take(1),
    map((confirmed) => confirmed === true),
  );
};
