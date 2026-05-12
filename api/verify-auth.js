export const config = { runtime: 'edge' };

const CREDENTIALS = {
  'michael@anthologyrx.com': '30eIh5E#p2%G#VFz',
  'danika@anthologyrx.com':  'Mx@RbwiJ8BBOkQqw',
  'dylan@anthologyrx.com':   'vMjdf8bADBjqZ2Vp',
  'dave@anthologyrx.com':    '5a5deUH3Av7eEpFm',
};

// Simple token: HMAC-like signature using a shared secret + email
// In Edge runtime we use SubtleCrypto to sign
const SECRET = 'anthology-founders-2026-secure';

async function signToken(email) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(email));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  // URL-safe base64
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password || !CREDENTIALS[email] || CREDENTIALS[email] !== password) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Sign the token so auth.js can verify it without a DB
  const token = await signToken(email);
  const cookieValue = `${encodeURIComponent(email)}:${token}`;

  return new Response('OK', {
    status: 200,
    headers: {
      // Session cookie — no Max-Age means it dies when the browser/tab is closed
      'Set-Cookie': `anthology_auth=${cookieValue}; Path=/promissorynote; HttpOnly; Secure; SameSite=Lax`,
      'Content-Type': 'text/plain',
    },
  });
}
