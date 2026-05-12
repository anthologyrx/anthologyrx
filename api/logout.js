export const config = { runtime: 'edge' };

export default function handler(request) {
  return new Response(null, {
    status: 302,
    headers: {
      // Kill the cookie immediately
      'Set-Cookie': 'anthology_auth=; Path=/promissorynote; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Location': '/login',
    },
  });
}
