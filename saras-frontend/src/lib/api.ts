import { getSession } from 'next-auth/react';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const session = await getSession();
  
  // Build headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (session?.user?.email) {
    headers.set('X-User-Email', session.user.email);
  }

  return fetch(url, {
    ...options,
    headers
  });
}
