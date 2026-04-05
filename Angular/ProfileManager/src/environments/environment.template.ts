// Copy this file to environment.ts and fill in your actual Firebase credentials
// DO NOT commit environment.ts - it's gitignored for security

export const environment = {
  production: false,
  /** Set true when using `firebase emulators:start` (Auth 9099, Firestore 8080). */
  useFirebaseEmulators: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
    measurementId: 'YOUR_MEASUREMENT_ID',
  },
  /**
   * Optional App Check (reCAPTCHA Enterprise). Register the key in Firebase Console > App Check.
   * Use debugToken: true in development to print a debug token in the browser console, then
   * register it in the console before enabling enforcement.
   */
  appCheck: undefined as
    | undefined
    | {
        recaptchaEnterpriseKey: string;
        debugToken?: boolean | string;
      },
};
