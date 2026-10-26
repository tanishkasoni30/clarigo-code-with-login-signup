const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';

// One-time migration: move any existing token/user from sessionStorage to localStorage
(function migrateSessionToLocal() {
  try {
    const sToken = sessionStorage.getItem(TOKEN_KEY);
    const sUser = sessionStorage.getItem(USER_KEY);
    if (sToken && !localStorage.getItem(TOKEN_KEY)) localStorage.setItem(TOKEN_KEY, sToken);
    if (sUser && !localStorage.getItem(USER_KEY)) localStorage.setItem(USER_KEY, sUser);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch (e) {
    // ignore (not running in browser or storage blocked)
  }
})();

export function setSession({ token, user }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
