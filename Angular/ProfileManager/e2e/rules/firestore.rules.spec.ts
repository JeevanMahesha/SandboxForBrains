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
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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

  test('allows admins to read, list, update and delete', async () => {
    const snapshot = await assertSucceeds(getDoc(doc(adminDb(), 'profiles/existing')));
    expect(snapshot.exists()).toBe(true);
    const list = await assertSucceeds(getDocs(collection(adminDb(), 'profiles')));
    expect(list.size).toBe(1);
    await assertSucceeds(updateDoc(doc(adminDb(), 'profiles/existing'), { name: 'Updated' }));
    await assertSucceeds(deleteDoc(doc(adminDb(), 'profiles/existing')));
  });

  test('requires matrimonyId and createdAt on create, even for admins', async () => {
    const { matrimonyId: _matrimonyId, ...withoutMatrimonyId } = VALID_PROFILE;
    const { createdAt: _createdAt, ...withoutCreatedAt } = VALID_PROFILE;

    await assertFails(setDoc(doc(adminDb(), 'profiles/a'), withoutMatrimonyId));
    await assertFails(setDoc(doc(adminDb(), 'profiles/b'), withoutCreatedAt));
    await assertSucceeds(setDoc(doc(adminDb(), 'profiles/c'), VALID_PROFILE));
  });
});

test.describe('everything else', () => {
  test('is denied even for admins', async () => {
    await assertFails(getDoc(doc(adminDb(), 'settings/global')));
    await assertFails(setDoc(doc(adminDb(), 'settings/global'), { any: true }));
  });
});
