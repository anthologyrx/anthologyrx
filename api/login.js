export const config = { runtime: 'edge' };

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>AnthologyRX · Founders Portal</title>
<meta property="og:title" content="AnthologyRX · Founders Portal" />
<meta property="og:description" content="Restricted access portal for AnthologyRX founders." />
<meta property="og:image" content="https://anthologyrx.vercel.app/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://anthologyrx.com/promissorynote" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AnthologyRX · Founders Portal" />
<meta name="twitter:description" content="Restricted access portal for AnthologyRX founders." />
<meta name="twitter:image" content="https://anthologyrx.vercel.app/og-image.jpg" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800&family=Epilogue:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --charcoal: #1E1E1E;
    --bg-card: #262422;
    --border: #373430;
    --sand: #E8DCC8;
    --brass: #B28A2A;
    --brass-bright: #D4A847;
    --muted: #9A9080;
    --error: #C0392B;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--charcoal);
    color: var(--sand);
    font-family: 'Epilogue', system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    -webkit-font-smoothing: antialiased;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-top: 3px solid var(--brass);
    width: 100%;
    max-width: 420px;
    padding: 3rem 2.5rem 2.5rem;
  }

  .wordmark {
    font-family: 'Unbounded', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    color: var(--sand);
    letter-spacing: 0.02em;
    text-align: center;
    margin-bottom: 0.35rem;
  }

  .wordmark .rx { color: var(--brass); }

  .tagline {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.5em;
    color: var(--brass);
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .brass-rule {
    width: 40px;
    height: 2px;
    background: var(--brass);
    margin: 0 auto 2.5rem;
  }

  .portal-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.35em;
    color: var(--muted);
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 2rem;
  }

  .field {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    background: var(--charcoal);
    border: 1px solid var(--border);
    color: var(--sand);
    font-family: 'Epilogue', sans-serif;
    font-size: 0.95rem;
    padding: 0.85rem 1rem;
    outline: none;
    transition: border-color 0.2s ease;
    -webkit-appearance: none;
    border-radius: 0;
  }

  input:focus {
    border-color: var(--brass);
  }

  input::placeholder {
    color: var(--muted);
    opacity: 0.5;
  }

  .error-msg {
    display: none;
    background: rgba(192, 57, 43, 0.12);
    border: 1px solid rgba(192, 57, 43, 0.3);
    color: #E8A090;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1.25rem;
    line-height: 1.5;
    text-align: center;
  }

  .error-msg.visible { display: block; }

  .btn-submit {
    width: 100%;
    background: var(--brass);
    color: var(--charcoal);
    border: none;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 1rem;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.15s ease;
    margin-top: 0.5rem;
  }

  .btn-submit:hover {
    background: var(--brass-bright);
    transform: translateY(-1px);
  }

  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .footer-note {
    margin-top: 2rem;
    font-size: 0.7rem;
    color: var(--muted);
    text-align: center;
    line-height: 1.6;
    letter-spacing: 0.02em;
  }

  .spinner {
    display: none;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(30,30,30,0.3);
    border-top-color: var(--charcoal);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .btn-text { display: block; }

  @media (max-width: 480px) {
    .card { padding: 2.5rem 1.75rem 2rem; }
  }
</style>
</head>
<body>

<div class="card">
  <div class="wordmark">ANTHOLOGY<span class="rx">RX</span></div>
  <div class="tagline">LONGEVITY · VITALITY · LEGACY</div>
  <div class="brass-rule"></div>
  <div class="portal-label">Founders Portal · Restricted Access</div>

  <div class="error-msg" id="errorMsg">
    Invalid credentials. Please check your email and password.
  </div>

  <form id="loginForm">
    <div class="field">
      <label for="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="you@anthologyrx.com"
        autocomplete="username"
        required
      >
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="••••••••••••"
        autocomplete="current-password"
        required
      >
    </div>

    <button type="submit" class="btn-submit" id="submitBtn">
      <span class="btn-text">Access Portal</span>
      <span class="spinner" id="spinner"></span>
    </button>
  </form>

  <div class="footer-note">
    Confidential · For authorized founders only
  </div>
</div>

<script>
  const form = document.getElementById('loginForm');
  const btn = document.getElementById('submitBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.querySelector('.btn-text');
  const errorMsg = document.getElementById('errorMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.classList.remove('visible');
    btn.disabled = true;
    btnText.style.display = 'none';
    spinner.style.display = 'block';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/verify-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        redirect: 'follow',
      });

      if (res.ok) {
        // Cookie is set by the server — redirect to the protected page
        window.location.href = '/promissorynote';
      } else {
        errorMsg.classList.add('visible');
        btn.disabled = false;
        btnText.style.display = 'block';
        spinner.style.display = 'none';
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    } catch (err) {
      errorMsg.textContent = 'Something went wrong. Please try again.';
      errorMsg.classList.add('visible');
      btn.disabled = false;
      btnText.style.display = 'block';
      spinner.style.display = 'none';
    }
  });
</script>

</body>
</html>`;

export default function handler() {
  return new Response(LOGIN_HTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
