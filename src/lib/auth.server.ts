
'use server';

import { cookies } from 'next/headers';
import type { User } from './types';
import { db, ensureDataSynced } from './database.server';

// --- User-finding logic is now co-located with auth logic ---

async function findUserByEmail(email: string): Promise<User | undefined> {
    await ensureDataSynced();
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
        return undefined;
    }
    return snapshot.docs[0].data() as User;
}

async function findUserById(id: string): Promise<User | undefined> {
    await ensureDataSynced();
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? doc.data() as User : undefined;
}

// --- Session and Auth Actions ---

const SESSION_COOKIE_NAME = 'core_to_crust_session';

async function getSession(): Promise<{ userId: string; role: 'admin' | 'student' } | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = { userId: user.id, role: user.role };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), { expires, httpOnly: true });
}

export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();
    if (!session?.userId) return null;

    const user = await findUserById(session.userId);
    return user || null;
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  await createSession(user);
  return { success: true, role: user.role };
}

export async function logout() {
  cookies().set(SESSION_COOKIE_NAME, '', { expires: new Date(0) });
}
