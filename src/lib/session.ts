import 'server-only';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'magellan_session';

export async function getSession(): Promise<{ userId: string; role: 'admin' | 'student' } | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}
