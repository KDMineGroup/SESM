/**
 * SESMine Platform — Global Configuration
 * Shared constants, feature flags and utility functions
 * loaded as the first script on every page.
 */

window.SESMINE = window.SESMINE || {};

// ── App metadata ─────────────────────────────────────────
SESMINE.version    = '2.4.0';
SESMINE.buildDate  = '2026-07-01';
SESMINE.env        = 'production';

// ── Feature flags ────────────────────────────────────────
SESMINE.features = {
  liveTickerEnabled : true,
  aiPredictorEnabled: true,
  darkModeForced    : true,   // platform is dark-only
  analyticsEnabled  : false,  // enable when GA4 ID is set
};

// ── Commodity spot prices (seed — overwritten by live feed) ──
SESMINE.spotPrices = {
  gold    : 3142.50,
  silver  : 31.84,
  copper  : 9847.00,
  nickel  : 18240.00,
  lithium : 14200.00,
  cobalt  : 26800.00,
  zinc    : 2840.00,
  ironOre : 108.40,
};

// ── Utility: format currency ─────────────────────────────
SESMINE.fmtUSD = function(val, decimals = 2) {
  if (val >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return '$' + val.toLocaleString('en-US', { maximumFractionDigits: decimals });
  return '$' + val.toFixed(decimals);
};

// ── Utility: format large numbers ────────────────────────
SESMINE.fmtNum = function(val) {
  if (val >= 1e9) return (val / 1e9).toFixed(2) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
  return String(val);
};

// ── Utility: debounce ────────────────────────────────────
SESMINE.debounce = function(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// ── Utility: local storage helpers ──────────────────────
SESMINE.store = {
  get: (key, fallback = null) => {
    try { return JSON.parse(localStorage.getItem('sesmine_' + key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, val) => {
    try { localStorage.setItem('sesmine_' + key, JSON.stringify(val)); }
    catch { /* storage full or blocked */ }
  },
  remove: (key) => localStorage.removeItem('sesmine_' + key),
};

// ── Auth helpers ─────────────────────────────────────────
SESMINE.auth = {
  isLoggedIn : () => !!SESMINE.store.get('token'),
  getToken   : () => SESMINE.store.get('token'),
  getUser    : () => SESMINE.store.get('user'),
  logout     : () => {
    SESMINE.store.remove('token');
    SESMINE.store.remove('user');
    window.location.href = '/auth/login.html';
  },
};

// ── Redirect logged-in users away from auth pages ────────
(function() {
  const path = window.location.pathname;
  const isAuthPage = path.includes('/auth/login') || path.includes('/auth/signup');
  if (isAuthPage && SESMINE.auth.isLoggedIn()) {
    window.location.href = '/index.html';
  }
})();

// ── Console branding ─────────────────────────────────────
console.log(
  '%c SESMine Intelligence v' + SESMINE.version + ' ',
  'background:#0891b2;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px;'
);
