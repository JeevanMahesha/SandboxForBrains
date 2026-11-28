import { inject, Injector } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedInput {
  hasUnsavedInput(): boolean;
}

/** Asks before leaving a page that holds typed-but-unsaved input; closing the dialog keeps it. */
export const discardChangesGuard: CanDeactivateFn<HasUnsavedInput> = async (component) => {
  if (!component.hasUnsavedInput()) return true;

  const injector = inject(Injector);
  // Route guards ship in the initial bundle, the dialog code does not: load it on demand.
  const { ConfirmService } = await import('../services/confirm.service');
  return injector.get(ConfirmService).confirm({
    title: 'Discard this new profile?',
    description: 'The details you entered have not been saved and will be lost.',
    confirmLabel: 'Discard',
    destructive: true,
  });
};
