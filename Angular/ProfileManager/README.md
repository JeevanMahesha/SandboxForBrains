# ProfileManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Testing

There are no unit tests by design. The app is a thin UI over Firebase, so its risk lives at the
integration seams (Firestore queries and rules, auth timing, drawer state). Those are covered by
end-to-end tests that run against the **Firebase emulators**, never against the real project.

### Prerequisites

The Firestore emulator needs a Java runtime:

```bash
brew install openjdk
echo 'export PATH=/opt/homebrew/opt/openjdk/bin:$PATH' >> ~/.zshrc   # or add it to your shell profile
java -version
```

Playwright's browser is installed once with `pnpm exec playwright install chromium`.

### Running

```bash
pnpm e2e            # ng e2e: starts the emulators + dev server (e2e config), runs everything
pnpm e2e:ui         # same, in the Playwright UI
pnpm e2e:headed     # same, with a visible browser
pnpm e2e:rules      # only the Firestore security-rules tests (no browser)
```

To iterate without restarting servers, run `pnpm emulators` and `pnpm start:e2e` in two terminals
and then `pnpm exec playwright test` as often as you like.

Playwright normally uses its own Chromium (`pnpm exec playwright install chromium`). If that build
is not installed, for example because its CDN is unreachable on your network, the config falls back
to the installed Google Chrome automatically. `PLAYWRIGHT_BROWSER_CHANNEL=chrome` (or `msedge`)
forces a channel explicitly.

### How the real database is protected

- `ng e2e` serves the app with the `e2e` configuration, which swaps `environment.ts` for the
  committed `environment.e2e.ts` (project id `demo-profilemanager`, no secrets).
- Firebase treats `demo-*` project ids as emulator-only, and `provideFirebase` refuses to enable
  emulator mode for any other id.
- All emulator commands pass `--project demo-profilemanager`, so the default project in
  `.firebaserc` is never used.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
