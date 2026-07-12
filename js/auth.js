/**
 * SESMine Intelligence Platform
 * Authentication Module — SESAuth
 * Version: 5.0.3
 * Updated: 2026-07-01
 */

'use strict';

const SESAuth = (() => {

  // ── Storage Keys ──────────────────────────────────────────
  const KEYS = {
    user:       'ses_user',
    token:      'ses_token',
    adminToken: 'ses_admin_token',
    session:    'ses_session',
    remember:   'ses_remember'
  };

  // ── Demo Credentials (development / demo only) ────────────
  const DEMO_USERS = [
    {
      id:        'usr_001',
      email:     'demo@sesmine.com',
      password:  'Demo2026!',
      firstName: 'Demo',
      lastName:  'User',
      company:   'SESMine Demo',
      role:      'Mining Engineer',
      plan:      'pro',
      hubs:      ['economics','engineering','innovation','procurement','safety','sustainability'],
      avatar:    'DU',
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id:        'usr_002',
      email:     'admin@sesmine.com',
      password:  'Admin2026!',
      firstName: 'Super',
      lastName:  'Admin',
      company:   'SESMine Intelligence',
      role:      'Platform Administrator',
      plan:      'enterprise',
      isAdmin:   true,
      hubs:      ['economics','engineering','innovation','procurement','safety','sustainability'],
      avatar:    'SA',
      createdAt: '2025-01-01T00:00:00Z'
    }
  ];

  // ── Token Generation ──────────────────────────────────────
  function generateToken(userId) {
    const payload = {
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24h
      jti: Math.random().toString(36).slice(2)
    };
    return btoa(JSON.stringify(payload));
  }

  // ── Token Validation ──────────────────────────────────────
  function isTokenValid(token) {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }

  // ── Session Storage Helper ────────────────────────────────
  function getStorage(remember) {
    return remember ? localStorage : sessionStorage;
  }

  // ── Login ─────────────────────────────────────────────────
  function login(email, password, remember = false) {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please try again.' };
    }

    const token   = generateToken(user.id);
    const storage = getStorage(remember);
    const safeUser = { ...user };
    delete safeUser.password;

    storage.setItem(KEYS.user,  JSON.stringify(safeUser));
    storage.setItem(KEYS.token, token);
    if (remember) localStorage.setItem(KEYS.remember, 'true');

    trackEvent('login_success', { userId: user.id, plan: user.plan });

    return { success: true, user: safeUser, token };
  }

  // ── Admin Login ───────────────────────────────────────────
  function adminLogin(email, password) {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase()
        && u.password === password
        && u.isAdmin === true
    );

    if (!user) {
      return { success: false, message: 'Invalid admin credentials or insufficient permissions.' };
    }

    const token = generateToken(user.id + '_admin');
    sessionStorage.setItem(KEYS.adminToken, token);

    const safeUser = { ...user };
    delete safeUser.password;
    sessionStorage.setItem(KEYS.user, JSON.stringify(safeUser));

    trackEvent('admin_login', { userId: user.id });

    return { success: true, user: safeUser };
  }

  // ── Logout ────────────────────────────────────────────────
  function logout() {
    [localStorage, sessionStorage].forEach(s => {
      Object.values(KEYS).forEach(k => s.removeItem(k));
    });
    trackEvent('logout');
  }

  // ── Admin Logout ──────────────────────────────────────────
  function adminLogout() {
    sessionStorage.removeItem(KEYS.adminToken);
    sessionStorage.removeItem(KEYS.user);
    trackEvent('admin_logout');
  }

  // ── Get Current User ──────────────────────────────────────
  function getCurrentUser() {
    const remember = localStorage.getItem(KEYS.remember);
    const storage  = remember ? localStorage : sessionStorage;
    const token    = storage.getItem(KEYS.token) || sessionStorage.getItem(KEYS.adminToken);

    if (!isTokenValid(token)) {
      logout();
      return null;
    }

    try {
      return JSON.parse(storage.getItem(KEYS.user));
    } catch {
      return null;
    }
  }

  // ── Check Authentication ──────────────────────────────────
  function isAuthenticated() {
    return getCurrentUser() !== null;
  }

  // ── Check Admin ───────────────────────────────────────────
  function isAdmin() {
    const token = sessionStorage.getItem(KEYS.adminToken);
    if (!isTokenValid(token)) return false;
    const user = getCurrentUser();
    return user?.isAdmin === true;
  }

  // ── Check Hub Access ──────────────────────────────────────
  function hasHubAccess(hubId) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.hubs?.includes(hubId) ?? false;
  }

  // ── Check Plan Access ─────────────────────────────────────
  function hasPlanAccess(requiredPlan) {
    const user = getCurrentUser();
    if (!user) return false;
    const hierarchy = { explorer: 0, pro: 1, enterprise: 2 };
    return (hierarchy[user.plan] ?? -1) >= (hierarchy[requiredPlan] ?? 999);
  }

  // ── Register New User ─────────────────────────────────────
  function register(userData) {
    const { email, password, firstName, lastName, company, role, hubs = [] } = userData;

    if (!email || !password || !firstName) {
      return { success: false, message: 'Required fields missing.' };
    }

    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters.' };
    }

    const newUser = {
      id:        'usr_' + Math.random().toString(36).slice(2, 9),
      email,
      firstName,
      lastName:  lastName || '',
      company:   company  || '',
      role:      role     || '',
      plan:      'pro',   // Start on Pro trial
      hubs:      hubs.length ? hubs : ['economics','safety','sustainability'],
      avatar:    (firstName[0] + (lastName?.[0] || '')).toUpperCase(),
      trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    };

    const token = generateToken(newUser.id);
    sessionStorage.setItem(KEYS.user,  JSON.stringify(newUser));
    sessionStorage.setItem(KEYS.token, token);

    trackEvent('signup_complete', {
      userId: newUser.id,
      plan:   newUser.plan,
      hubs:   hubs.join(',')
    });

    return { success: true, user: newUser, token };
  }

  // ── Route Guard ───────────────────────────────────────────
  function requireAuth(redirectUrl = '/auth/login.html') {
    if (!isAuthenticated()) {
      const current = encodeURIComponent(window.location.pathname);
      window.location.href = redirectUrl + '?redirect=' + current;
      return false;
    }
    return true;
  }

  // ── Admin Route Guard ─────────────────────────────────────
  function requireAdmin(redirectUrl = '/admin/admin-login.html') {
    if (!isAdmin()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // ── Analytics Event Tracker ───────────────────────────────
  function trackEvent(name, params = {}) {
    if (window.gtag && window.SESConfig?.ANALYTICS?.enabled) {
      window.gtag('event', name, params);
    }
    if (window.SESConfig?.isDev?.()) {
      console.debug('[SESAuth] Event:', name, params);
    }
  }

  // ── Auto-redirect if already logged in ───────────────────
  function redirectIfAuthenticated(dashboardUrl = '/dashboard/main-dashboard.html') {
    if (isAuthenticated()) {
      window.location.href = dashboardUrl;
    }
  }

  // ── Public API ────────────────────────────────────────────
  return Object.freeze({
    login,
    adminLogin,
    logout,
    adminLogout,
    register,
    getCurrentUser,
    isAuthenticated,
    isAdmin,
    hasHubAccess,
    hasPlanAccess,
    requireAuth,
    requireAdmin,
    redirectIfAuthenticated
  });

})();

// Expose globally
window.SESAuth = SESAuth;
