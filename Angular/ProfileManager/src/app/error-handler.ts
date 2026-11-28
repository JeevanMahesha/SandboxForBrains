import { ErrorHandler, Service } from '@angular/core';

/** Prefix on every line the app logs, so reported errors are easy to find in the console. */
export const ERROR_LOG_PREFIX = '[ProfileManager]';

/**
 * The one place unexpected errors are logged. Angular routes uncaught errors here (through
 * `provideBrowserGlobalErrorListeners()`), and code that shows its own user-facing toast calls
 * `handleError(error)` so the underlying cause is not lost. It shows no UI of its own.
 */
@Service()
export class AppErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error(ERROR_LOG_PREFIX, error);
  }
}
