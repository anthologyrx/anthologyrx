export const config = { runtime: 'edge' };

const CREDENTIALS = {
  'michael@anthologyrx.com': '30eIh5E#p2%G#VFz',
  'danika@anthologyrx.com':  'Mx@RbwiJ8BBOkQqw',
  'dylan@anthologyrx.com':   'vMjdf8bADBjqZ2Vp',
  'dave@anthologyrx.com':    '5a5deUH3Av7eEpFm',
};

export default function handler(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colon = decoded.indexOf(':');
      if (colon > -1) {
        const user = decoded.slice(0, colon);
        const pass = decoded.slice(colon + 1);
        if (CREDENTIALS[user] && CREDENTIALS[user] === pass) {
          // Serve the actual page content
          return fetch(new URL('/promissorynote/index.html', request.url));
        }
      }
    } catch (e) {}
  }

  return new Response('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AnthologyRX Founders Portal"',
      'Content-Type': 'text/plain',
    },
  });
}
