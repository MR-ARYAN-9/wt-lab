# Session & Cookies — Quick Guide

This folder contains a small demo showing how to use cookies, `sessionStorage`, and `localStorage` on the client, and how to use PHP sessions on the server.

Files
- `index.html` — demo UI that demonstrates cookies and `sessionStorage` (already present).
- `app.js` — client JS used by the demo.
- `session-examples.php` — small PHP file with session examples (added below).

Concepts
- Cookies: small key/value pairs stored by the browser and sent to the server with each request. Good for short-lived preferences and identifiers. Use `HttpOnly` and `Secure` when storing sensitive values.
- sessionStorage: per-tab storage. Cleared when the tab/window is closed. Good for temporary UI state like an active cart during a session.
- localStorage: persistent storage scoped to origin. Good for non-sensitive preferences that should survive browser restarts.
- PHP `$_SESSION`: server-side session storage. The browser only keeps a session id cookie; all data lives on the server.

Client examples (JS)

Set a cookie (7 days):

```js
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((v, c) => {
    const [k, val] = c.split('=');
    return k === name ? decodeURIComponent(val) : v;
  }, '');
}
```

Save a cart to `sessionStorage`:

```js
function saveCart(cart) { sessionStorage.setItem('cart', JSON.stringify(cart)); }
function loadCart()  { return JSON.parse(sessionStorage.getItem('cart') || '[]'); }
```

Persist a theme preference in `localStorage`:

```js
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
```

Server examples (PHP)

`session-examples.php` demonstrates starting a session, setting and reading values, and destroying a session.

Security notes
- Always set `HttpOnly` and `Secure` flags on cookies containing session IDs when using HTTPS.
- Regenerate session IDs after login to prevent session fixation (`session_regenerate_id(true)`).
- Never store sensitive secrets in client-side storage.

How to run the PHP example
1. Ensure PHP is installed (or use XAMPP/WAMP).
2. From the project folder run the built-in server: `php -S 127.0.0.1:8000` (or use `start-server.ps1`).
3. Open `http://127.0.0.1/Session%20and%20cookies%20info/index.html` in your browser.
