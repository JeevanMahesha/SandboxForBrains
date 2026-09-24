// Used by `ng serve --configuration e2e` / `ng e2e` via fileReplacements in angular.json.
// Contains no secrets. The `demo-` project id is emulator-only: the Firebase SDK and CLI
// refuse to talk to a real backend for such ids, so tests can never touch production data.

import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: 'demo-api-key',
    authDomain: 'demo-profilemanager.firebaseapp.com',
    projectId: 'demo-profilemanager',
    appId: '1:demo:web:demo',
  },
};
