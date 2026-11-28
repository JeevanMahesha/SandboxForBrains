import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { expect, test } from '@playwright/test';
import {
  type Firestore,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  setLogLevel,
  updateDoc,
} from 'firebase/firestore';
import { FIRESTORE_EMULATOR_URL, PROJECT_ID } from '../support/emulator';

/**
 * Security-rules tests. They run in Node (no browser) against the Firestore emulator started
 * by playwright.config.ts, using the rules file that gets deployed to production.
 */
test.describe.configure({ mode: 'serial' });

const VALID_PROFILE = {
  name: 'Rules Test',
  matrimonyId: 'M1',
  mobileNumber: '+919876543210',
  profileStatusId: 'NEW',
  createdAt: new Date(),
};

let env: RulesTestEnvironment;

const asFirestore = (ctx: { firestore(): unknown }) => ctx.firestore() as Firestore;
const anonymousDb = () => asFirestore(env.unauthenticatedContext());
const userDb = () => asFirestore(env.authenticatedContext('regular-user'));
const adminDb = () => asFirestore(env.authenticatedContext('admin-user', { admin: true }));
const claimDb = (claims: Record<string, unknown>) =>
  asFirestore(env.authenticatedContext('claim-user', claims));

test.beforeAll(async () => {
  // Expected PERMISSION_DENIED responses would otherwise be logged as SDK warnings.
  setLogLevel('silent');
  const { hostname, port } = new URL(FIRESTORE_EMULATOR_URL);
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      host: hostname,
      port: Number(port),
      rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8'),
    },
  });
});

test.beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(asFirestore(ctx), 'profiles/existing'), VALID_PROFILE);
  });
});

test.afterAll(async () => {
  await env.cleanup();
});

test.describe('profiles collection', () => {
  test('denies anonymous reads', async () => {
    await assertFails(getDoc(doc(anonymousDb(), 'profiles/existing')));
    await assertFails(getDocs(collection(anonymousDb(), 'profiles')));
  });

  test('denies signed-in users without the admin claim', async () => {
    await assertFails(getDoc(doc(userDb(), 'profiles/existing')));
    await assertFails(getDocs(collection(userDb(), 'profiles')));
    await assertFails(setDoc(doc(userDb(), 'profiles/new'), VALID_PROFILE));
    await assertFails(updateDoc(doc(userDb(), 'profiles/existing'), { name: 'x' }));
    await assertFails(deleteDoc(doc(userDb(), 'profiles/existing')));
  });

  test('denies anonymous writes and deletes', async () => {
    await assertFails(setDoc(doc(anonymousDb(), 'profiles/new'), VALID_PROFILE));
    await assertFails(updateDoc(doc(anonymousDb(), 'profiles/existing'), { name: 'x' }));
    await assertFails(deleteDoc(doc(anonymousDb(), 'profiles/existing')));
  });

  // Only the boolean `true` counts: `admin: false` and look-alike values must never pass.
  for (const [label, claims] of [
    ['admin: false', { admin: false }],
    ['admin: "true" (a string)', { admin: 'true' }],
    ['admin: 1 (a number)', { admin: 1 }],
    ['a different claim name', { isAdmin: true }],
  ] as const) {
    test(`denies a token with ${label}`, async () => {
      const db = () => claimDb(claims);
      await assertFails(getDoc(doc(db(), 'profiles/existing')));
      await assertFails(getDocs(collection(db(), 'profiles')));
      await assertFails(setDoc(doc(db(), 'profiles/new'), VALID_PROFILE));
      await assertFails(updateDoc(doc(db(), 'profiles/existing'), { name: 'x' }));
      await assertFails(deleteDoc(doc(db(), 'profiles/existing')));
    });
  }

  test('allows admins to read, list, update and delete', async () => {
    const snapshot = await assertSucceeds(getDoc(doc(adminDb(), 'profiles/existing')));
    expect(snapshot.exists()).toBe(true);
    const list = await assertSucceeds(getDocs(collection(adminDb(), 'profiles')));
    expect(list.size).toBe(1);
    await assertSucceeds(
      updateDoc(doc(adminDb(), 'profiles/existing'), {
        name: 'Updated',
        updatedAt: serverTimestamp(),
      }),
    );
    await assertSucceeds(deleteDoc(doc(adminDb(), 'profiles/existing')));
  });
});

/** A profile the way the app creates it: every form field plus server timestamps. */
const newProfile = (overrides: Record<string, unknown> = {}) => ({
  name: 'Rules Test',
  mobileNumber: '+919876543210',
  zodiacSign: 'aries',
  star: null,
  age: 28,
  starMatchScore: null,
  state: 'Tamil Nadu',
  city: 'Chennai',
  profileStatusId: 'NEW',
  matrimonyId: 'M-New',
  comments: [{ value: 'First note', createDateAndTime: new Date() }],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  ...overrides,
});

const without = (profile: Record<string, unknown>, ...keys: string[]) =>
  Object.fromEntries(Object.entries(profile).filter(([key]) => !keys.includes(key)));

test.describe('profile validation on create', () => {
  const create = (data: Record<string, unknown>) => setDoc(doc(adminDb(), 'profiles/new'), data);

  test('accepts a profile exactly as the app writes it', async () => {
    await assertSucceeds(create(newProfile()));
    // Optional fields may be left out entirely.
    await assertSucceeds(
      setDoc(
        doc(adminDb(), 'profiles/minimal'),
        without(newProfile(), 'zodiacSign', 'star', 'age', 'starMatchScore', 'state', 'city'),
      ),
    );
  });

  test('requires the core fields', async () => {
    for (const key of ['name', 'mobileNumber', 'matrimonyId', 'profileStatusId', 'createdAt']) {
      await assertFails(create(without(newProfile(), key)));
    }
  });

  test('createdAt and updatedAt must be the server time', async () => {
    await assertFails(create(newProfile({ createdAt: null })));
    await assertFails(create(newProfile({ createdAt: new Date('2001-01-01') })));
    await assertFails(create(newProfile({ updatedAt: new Date('2001-01-01') })));
    await assertFails(create(newProfile({ createdAt: 'now' })));
  });

  test('rejects fields the app never writes', async () => {
    await assertFails(create(newProfile({ isAdmin: true })));
    await assertFails(create(newProfile({ id: 'x' })));
  });

  test('rejects wrong types and out-of-range values', async () => {
    await assertFails(create(newProfile({ name: 42 })));
    await assertFails(create(newProfile({ name: '' })));
    await assertFails(create(newProfile({ matrimonyId: '' })));
    await assertFails(create(newProfile({ age: '28' })));
    await assertFails(create(newProfile({ age: 17 })));
    await assertFails(create(newProfile({ age: 28.5 })));
    await assertFails(create(newProfile({ starMatchScore: 'high' })));
    await assertFails(create(newProfile({ comments: 'a note' })));
    await assertFails(create(newProfile({ state: 7 })));
  });

  test('rejects oversize strings', async () => {
    await assertFails(create(newProfile({ name: 'x'.repeat(101) })));
    await assertFails(create(newProfile({ matrimonyId: 'x'.repeat(65) })));
    await assertFails(create(newProfile({ city: 'x'.repeat(101) })));
  });

  test('requires a canonical mobile number', async () => {
    for (const bad of ['9876543210', '+91 98765 43210', '+915876543210', '+9198765432', 'N/A']) {
      await assertFails(create(newProfile({ mobileNumber: bad })));
    }
  });

  test('profileStatusId must be a known status', async () => {
    await assertFails(create(newProfile({ profileStatusId: 'HACKED' })));
    await assertFails(create(newProfile({ profileStatusId: null })));
    await assertSucceeds(create(newProfile({ profileStatusId: 'MEETING_SCHEDULED' })));
  });

  test('caps the number of notes', async () => {
    const note = { value: 'n', createDateAndTime: new Date() };
    await assertSucceeds(create(newProfile({ comments: Array(200).fill(note) })));
    await assertFails(
      setDoc(doc(adminDb(), 'profiles/big'), newProfile({ comments: Array(201).fill(note) })),
    );
  });

  test('non-admins still cannot create a valid profile', async () => {
    await assertFails(setDoc(doc(userDb(), 'profiles/new'), newProfile()));
  });
});

test.describe('profile validation on update', () => {
  const existing = () => doc(adminDb(), 'profiles/existing');

  test('accepts the writes the app makes', async () => {
    // Status change (updateProfileStatus) and a full edit (updateProfile).
    await assertSucceeds(
      updateDoc(existing(), { profileStatusId: 'CONTACTED', updatedAt: serverTimestamp() }),
    );
    await assertSucceeds(
      updateDoc(existing(), {
        ...without(newProfile(), 'createdAt', 'updatedAt'),
        matrimonyId: 'M2',
        updatedAt: serverTimestamp(),
      }),
    );
    // Quick note (addNote).
    await assertSucceeds(
      updateDoc(existing(), {
        comments: arrayUnion({ value: 'hi', createDateAndTime: new Date() }),
        updatedAt: serverTimestamp(),
      }),
    );
  });

  test('keeps createdAt and matrimonyId in place', async () => {
    await assertFails(
      updateDoc(existing(), { createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
    );
    await assertFails(
      updateDoc(existing(), { createdAt: deleteField(), updatedAt: serverTimestamp() }),
    );
    await assertFails(
      updateDoc(existing(), { matrimonyId: deleteField(), updatedAt: serverTimestamp() }),
    );
    await assertFails(updateDoc(existing(), { matrimonyId: '', updatedAt: serverTimestamp() }));
  });

  test('updatedAt must be the server time', async () => {
    await assertFails(updateDoc(existing(), { name: 'Renamed' }));
    await assertFails(
      updateDoc(existing(), { name: 'Renamed', updatedAt: new Date('2001-01-01') }),
    );
  });

  test('rejects unknown fields, wrong types, bad status and oversize values', async () => {
    const stamp = { updatedAt: serverTimestamp() };
    await assertFails(updateDoc(existing(), { isAdmin: true, ...stamp }));
    await assertFails(updateDoc(existing(), { name: 7, ...stamp }));
    await assertFails(updateDoc(existing(), { name: 'x'.repeat(101), ...stamp }));
    await assertFails(updateDoc(existing(), { profileStatusId: 'HACKED', ...stamp }));
    await assertFails(updateDoc(existing(), { mobileNumber: '12345', ...stamp }));
    await assertFails(updateDoc(existing(), { age: 12, ...stamp }));
    await assertFails(updateDoc(existing(), { comments: 'text', ...stamp }));
    await assertFails(
      updateDoc(existing(), {
        comments: Array(201).fill({ value: 'n', createDateAndTime: new Date() }),
        ...stamp,
      }),
    );
  });

  test('a legacy document stays editable: only the changed fields are validated', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(asFirestore(ctx), 'profiles/legacy'), {
        name: 'Old',
        matrimonyId: 'M-legacy',
        createdAt: new Date(),
        mobileNumber: '98765 43210',
        profileStatusId: 'RETIRED',
        age: '30',
        comments: ['a plain string note'],
        extraLegacyField: true,
      });
    });
    const legacy = doc(adminDb(), 'profiles/legacy');
    await assertSucceeds(
      updateDoc(legacy, { profileStatusId: 'ACCEPTED', updatedAt: serverTimestamp() }),
    );
    await assertSucceeds(
      updateDoc(legacy, {
        comments: arrayUnion({ value: 'hi', createDateAndTime: new Date() }),
        updatedAt: serverTimestamp(),
      }),
    );
    // Whatever IS written must still be valid.
    await assertFails(
      updateDoc(legacy, { profileStatusId: 'HACKED', updatedAt: serverTimestamp() }),
    );
  });

  test('deleting stays admin-only and unconditional', async () => {
    await assertSucceeds(deleteDoc(existing()));
  });
});

test.describe('everything else', () => {
  test('is denied even for admins', async () => {
    await assertFails(getDoc(doc(adminDb(), 'settings/global')));
    await assertFails(setDoc(doc(adminDb(), 'settings/global'), { any: true }));
    // A sub-collection under a profile is not covered by the profile rule either.
    await assertFails(setDoc(doc(adminDb(), 'profiles/existing/notes/n1'), { value: 'x' }));
  });

  test('is denied for anonymous and non-admin users too', async () => {
    await assertFails(getDoc(doc(anonymousDb(), 'settings/global')));
    await assertFails(getDoc(doc(userDb(), 'settings/global')));
    await assertFails(setDoc(doc(userDb(), 'settings/global'), { any: true }));
  });
});
