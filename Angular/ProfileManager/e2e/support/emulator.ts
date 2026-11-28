/**
 * Thin REST helpers for the Firebase Auth and Firestore emulators.
 *
 * Everything here talks to 127.0.0.1 only and is authorised with the emulator-only
 * `Bearer owner` token, which the real Firebase backend would reject. The project id must
 * start with `demo-`: the Firebase SDK and CLI treat such ids as emulator-only.
 */

import { randomUUID } from 'node:crypto';

import type { ProfileDetail } from '../../src/app/models/profile.model';

export const PROJECT_ID = 'demo-profilemanager';
export const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';
export const FIRESTORE_EMULATOR_URL = 'http://127.0.0.1:8080';

export const ADMIN_USER = { email: 'admin@example.com', password: 'password123' } as const;

const OWNER_HEADERS = {
  Authorization: 'Bearer owner',
  'Content-Type': 'application/json',
} as const;

const AUTH_API = `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}`;
const FIRESTORE_DOCS = `${FIRESTORE_EMULATOR_URL}/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function request(url: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, { ...init, headers: { ...OWNER_HEADERS, ...init.headers } });
  if (!response.ok) {
    throw new Error(
      `${init.method ?? 'GET'} ${url} failed: ${response.status} ${await response.text()}`,
    );
  }
  return response;
}

/** Deletes every account in the Auth emulator. */
export async function clearAuth(): Promise<void> {
  await request(`${AUTH_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
    method: 'DELETE',
  });
}

/**
 * Creates the e2e admin account with the `admin: true` custom claim that firestore.rules
 * requires. Custom claims can only be set through the privileged (owner) API.
 */
export async function createAdminUser(): Promise<void> {
  const created = await request(`${AUTH_API}/accounts`, {
    method: 'POST',
    body: JSON.stringify({ ...ADMIN_USER, emailVerified: true }),
  });
  const { localId } = (await created.json()) as { localId: string };
  await request(`${AUTH_API}/accounts:update`, {
    method: 'POST',
    body: JSON.stringify({ localId, customAttributes: JSON.stringify({ admin: true }) }),
  });
}

/** Key the Firebase Auth SDK stores the signed-in user under (session persistence). */
export const AUTH_SESSION_KEY = 'firebase:authUser:demo-api-key:[DEFAULT]';

/**
 * Signs the admin in through the Auth emulator's REST API and returns the value the Firebase
 * SDK would keep in `sessionStorage` after a real login, so a test can start already signed in
 * without driving the login form. Emulator-only: the API key and tokens are the emulator's.
 */
export async function adminSessionEntry(): Promise<string> {
  const response = await request(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key`,
    { method: 'POST', body: JSON.stringify({ ...ADMIN_USER, returnSecureToken: true }) },
  );
  const { localId, idToken, refreshToken, expiresIn } = (await response.json()) as {
    localId: string;
    idToken: string;
    refreshToken: string;
    expiresIn: string;
  };
  const now = Date.now();
  return JSON.stringify({
    uid: localId,
    email: ADMIN_USER.email,
    emailVerified: true,
    isAnonymous: false,
    providerData: [
      {
        providerId: 'password',
        uid: ADMIN_USER.email,
        displayName: null,
        email: ADMIN_USER.email,
        phoneNumber: null,
        photoURL: null,
      },
    ],
    stsTokenManager: {
      refreshToken,
      accessToken: idToken,
      expirationTime: now + Number(expiresIn) * 1000,
    },
    createdAt: String(now),
    lastLoginAt: String(now),
    apiKey: 'demo-api-key',
    appName: '[DEFAULT]',
  });
}

/** Deletes every document in the Firestore emulator. */
export async function clearFirestore(): Promise<void> {
  await request(
    `${FIRESTORE_EMULATOR_URL}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: 'DELETE' },
  );
}

/**
 * The Firestore document shape for a seeded profile, derived from the app's own `ProfileDetail`
 * model rather than duplicated by hand — a field added or renamed there now surfaces here as a
 * type error instead of a silent mismatch discovered only when a test fails at run time.
 *
 * `id`/`sNo`/`profileStatus`/`profileStatusColor` are excluded: they're derived client-side
 * (`ProfilesService.mapDocToProfile`), never stored. `createdAt`/`updatedAt` are made required,
 * since every seeded document needs a concrete date. `comments` stays `never[]`: the REST
 * seeding helper below (`toFirestoreValue`) only supports primitive field values, not nested
 * comment objects — comments are exercised through the UI instead, in profile-comments.spec.ts.
 */
export type SeedProfile = Omit<
  ProfileDetail,
  'id' | 'sNo' | 'profileStatus' | 'profileStatusColor' | 'createdAt' | 'updatedAt' | 'comments'
> & {
  comments: never[];
  createdAt: Date;
  updatedAt: Date;
};

const SEED_EPOCH = Date.parse('2026-01-01T00:00:00Z');

/**
 * Builds a valid profile document. `createdAt` is staggered by `index` minutes so the list's
 * `orderBy('createdAt')` is deterministic: a higher index is a newer profile.
 */
export function makeProfile(index: number, overrides: Partial<SeedProfile> = {}): SeedProfile {
  const createdAt = new Date(SEED_EPOCH + index * 60_000);
  return {
    name: `Seed Profile ${String(index + 1).padStart(2, '0')}`,
    mobileNumber: `+9198765${String(43200 + index).padStart(5, '0')}`,
    matrimonyId: `M${String(1000 + index)}`,
    profileStatusId: 'NEW',
    zodiacSign: 'aries',
    star: null,
    starMatchScore: null,
    age: 28,
    state: 'Tamil Nadu',
    city: 'Chennai',
    comments: [],
    createdAt,
    updatedAt: createdAt,
    ...overrides,
  };
}

type SeedValue = string | number | boolean | null | Date | SeedValue[];

function toFirestoreValue(value: SeedValue): Record<string, unknown> {
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  switch (typeof value) {
    case 'string':
      return { stringValue: value };
    case 'boolean':
      return { booleanValue: value };
    case 'number':
      return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
}

/** Documents per `:commit` request (the Firestore limit is 500 writes per commit). */
const SEED_BATCH_SIZE = 400;

/**
 * Writes the given profiles to the `profiles` collection, bypassing security rules. Profiles go
 * in as a few `:commit` batches rather than one request each: the larger specs seed 60+ rows.
 */
export async function seedProfiles(profiles: SeedProfile[]): Promise<void> {
  const documentsPath = `projects/${PROJECT_ID}/databases/(default)/documents/profiles`;
  for (let start = 0; start < profiles.length; start += SEED_BATCH_SIZE) {
    const writes = profiles.slice(start, start + SEED_BATCH_SIZE).map((profile) => ({
      update: {
        name: `${documentsPath}/${randomUUID().replaceAll('-', '').slice(0, 20)}`,
        fields: Object.fromEntries(
          Object.entries(profile).map(([key, value]) => [
            key,
            toFirestoreValue(value as SeedValue),
          ]),
        ),
      },
    }));
    await request(`${FIRESTORE_DOCS}:commit`, {
      method: 'POST',
      body: JSON.stringify({ writes }),
    });
  }
}

/** Raw stored `profiles` documents (Firestore REST field maps), read straight from the emulator. */
export async function readStoredProfiles(): Promise<Record<string, Record<string, unknown>>[]> {
  const response = await request(`${FIRESTORE_DOCS}/profiles`, { method: 'GET' });
  const { documents = [] } = (await response.json()) as {
    documents?: { fields: Record<string, Record<string, unknown>> }[];
  };
  return documents.map((d) => d.fields);
}

/** Status stored in Firestore for the profile with the given name (read straight from the emulator). */
export async function storedProfileStatus(name: string): Promise<string | undefined> {
  const response = await request(`${FIRESTORE_DOCS}/profiles`, { method: 'GET' });
  const { documents = [] } = (await response.json()) as {
    documents?: { fields: Record<string, { stringValue?: string }> }[];
  };
  return documents.find((d) => d.fields['name']?.stringValue === name)?.fields['profileStatusId']
    ?.stringValue;
}

/** Deletes every profile document behind the app's back (a loaded list still shows its stale rows). */
export async function deleteAllProfileDocs(): Promise<void> {
  const response = await request(`${FIRESTORE_DOCS}/profiles`, { method: 'GET' });
  const { documents = [] } = (await response.json()) as { documents?: { name: string }[] };
  for (const d of documents) {
    await request(`${FIRESTORE_EMULATOR_URL}/v1/${d.name}`, { method: 'DELETE' });
  }
}

/**
 * Polls the Auth and Firestore emulators until both accept HTTP requests. Playwright's
 * `webServer.url` can only watch one endpoint and the emulators come up in no fixed order.
 */
export async function waitForEmulators(timeoutMs = 60_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  const endpoints = [AUTH_EMULATOR_URL, FIRESTORE_EMULATOR_URL];
  while (Date.now() < deadline) {
    const results = await Promise.all(
      endpoints.map((url) =>
        fetch(url).then(
          (response) => response.ok,
          () => false,
        ),
      ),
    );
    if (results.every(Boolean)) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Firebase emulators did not become ready within ${timeoutMs}ms.`);
}
