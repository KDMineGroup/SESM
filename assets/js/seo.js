/**
 * SESMine SEO & Analytics Helper v5.0
 * GA4 events · page timing · scroll depth · outbound links · error logging
 */
(function () {
  'use strict';

  const GA_ID   = 'G-SESMINE2026';   // Replace with real GA4 ID
  const BASE    = 'https://www.sesmine.com';
  const DEBUG   = window.location.hostname === 'localhost';

  /* ── GA4 Loader ── */
  function loadGA4() {
    if (DEBUG) return;
    const s = document.createElement('script');
    s.async = true;
    s.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, {
      page_title:    document.title,
      page_location: window.location.href,
      send_page_view: true
    });
  }

  /* ── Page Timing ── */
  function trackTiming() {
    window.addEventListener('load', () => {
      const nav = performance.getEntriesByType('navigation')[0];
      if (!nav || !window.gtag) return;
      gtag('event', 'page_timing', {
        event_category: 'Performance',
        ttfb:  Math.round(nav.responseStart - nav.requestStart),
        fcp:   Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        load:  Math.round(nav.loadEventEnd - nav.startTime)
      });
    });
  }

  /* ── Scroll Depth ── */
  function trackScrollDepth() {
    const milestones = [25, 50, 75, 90, 100];
    const fired = new Set();
    window.addEventListener('scroll', () => {
      const pct = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      milestones.forEach(m => {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          if (window.gtag) {
            gtag('event', 'scroll_depth', {
              event_category: 'Engagement',
              depth_percent: m,
              page: window.location.pathname
            });
          }
        }
      });
    }, { passive: true });
  }

  /* ── Outbound Links ── */
  function trackOutbound() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (href && !href.startsWith(BASE) && /^https?:\/\//.test(href)) {
        if (window.gtag) {
          gtag('event', 'outbound_click', {
            event_category: 'Outbound',
            event_label: href,
            transport_type: 'beacon'
          });
        }
      }
    });
  }

  /* ── CTA Click Tracking ── */
  function trackCTAs() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-track]');
      if (!btn || !window.gtag) return;
      gtag('event', 'cta_click', {
        event_category: 'CTA',
        event_label: btn.dataset.track,
        page: window.location.pathname
      });
    });
  }

  /* ── Error Logging ── */
  function trackErrors() {
    window.addEventListener('error', e => {
      if (window.gtag) {
        gtag('event', 'js_error', {
          event_category: 'Error',
          event_label: `${e.message} @ ${e.filename}:${e.lineno}`
        });
      }
      if (DEBUG) console.error('[SESMine SEO] JS Error:', e);
    });
  }

  /* ── Fonts Loaded ── */
  function markFontsLoaded() {
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      document.documentElement.classList.add('fonts-loaded');
    }
  }

  /* ── Init ── */
  function init() {
    loadGA4();
    trackTiming();
    trackScrollDepth();
    trackOutbound();
    trackCTAs();
    trackErrors();
    markFontsLoaded();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
