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

  // Inject secure handshake secret for backend communication
  const apiSecret = process.env.NEXT_PUBLIC_API_SECRET || "saras-secret-handshake-token-9988";
  headers.set('X-Saras-Secret', apiSecret);

  return fetch(url, {
    ...options,
    headers
  });
}
