/**
 * SESMine Platform — Main JS
 * Global behaviours: navbar scroll, reveal animations,
 * live ticker, page loader, toast system, modal system.
 */

(function() {
  'use strict';

  // ── Page loader ──────────────────────────────────────
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('pageLoader');
      if (loader) loader.classList.add('hidden');
    }, 400);
  });

  // ── Navbar scroll state ──────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ── Reveal on scroll (IntersectionObserver) ──────────
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // Re-observe after dynamic content injection
  SESMINE.observeReveal = function(root) {
    (root || document).querySelectorAll('.reveal:not(.visible)').forEach(el => revObs.observe(el));
  };

  // ── Live commodity ticker ────────────────────────────
  const TICKER_COMMODITIES = [
    { name: 'Gold',     price: 3142.50, chg: +0.8  },
    { name: 'Copper',   price: 9847.00, chg: +1.2  },
    { name: 'Lithium',  price: 14200,   chg: +2.1  },
    { name: 'Silver',   price: 31.84,   chg: -0.3  },
    { name: 'Nickel',   price: 18240,   chg: +0.6  },
    { name: 'Iron Ore', price: 108.40,  chg: +0.5  },
    { name: 'Cobalt',   price: 26800,   chg: -1.1  },
    { name: 'Zinc',     price: 2840,    chg: +0.4  },
    { name: 'Platinum', price: 1084,    chg: +0.3  },
    { name: 'Palladium',price: 1240,    chg: -0.7  },
  ];

  function fmtTickerPrice(price) {
    return price >= 1000
      ? price.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : price.toFixed(2);
  }

  function renderTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    const items = [...TICKER_COMMODITIES, ...TICKER_COMMODITIES];
    track.innerHTML = items.map(c => {
      const up = c.chg >= 0;
      return `<div class="ticker-item">
        <span class="ticker-item__name">${c.name}</span>
        <span class="ticker-item__price">$${fmtTickerPrice(c.price)}</span>
        <span class="ticker-item__change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(c.chg).toFixed(1)}%</span>
      </div>`;
    }).join('');
  }

  function tickTicker() {
    TICKER_COMMODITIES.forEach(c => {
      c.price = Math.max(0.01, c.price + (Math.random() - 0.49) * c.price * 0.0015);
      c.chg   = parseFloat((c.chg + (Math.random() - 0.5) * 0.06).toFixed(2));
      // Sync to global spot prices
      const key = c.name.toLowerCase().replace(' ', '');
      if (window.SESMINE && SESMINE.spotPrices[key] !== undefined) {
        SESMINE.spotPrices[key] = c.price;
      }
    });
    renderTicker();
  }

  if (document.getElementById('tickerTrack')) {
    renderTicker();
    setInterval(tickTicker, 8000);
  }

  // ── Toast notification system ────────────────────────
  SESMINE.toast = (function() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = [
        'position:fixed', 'bottom:1.5rem', 'right:1.5rem',
        'display:flex', 'flex-direction:column', 'gap:0.625rem',
        'z-index:9999', 'pointer-events:none',
      ].join(';');
      document.body.appendChild(container);
    }

    const ICONS = {
      success : 'fa-circle-check',
      error   : 'fa-circle-xmark',
      warning : 'fa-triangle-exclamation',
      info    : 'fa-circle-info',
    };
    const COLORS = {
      success : 'var(--emerald-400)',
      error   : 'var(--rose-400)',
      warning : 'var(--amber-400)',
      info    : 'var(--cyan-400)',
    };

    return function show(message, type = 'info', duration = 4000) {
      const toast = document.createElement('div');
      toast.style.cssText = [
        'display:flex', 'align-items:center', 'gap:0.75rem',
        'padding:0.875rem 1.25rem',
        'background:var(--coal-800)',
        'border:1px solid var(--border-200)',
        'border-left:3px solid ' + COLORS[type],
        'border-radius:var(--radius-lg)',
        'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
        'font-size:0.875rem', 'color:var(--text-200)',
        'pointer-events:all',
        'opacity:0', 'transform:translateX(20px)',
        'transition:opacity 0.25s ease, transform 0.25s ease',
        'max-width:360px',
      ].join(';');
      toast.innerHTML = `
        <i class="fa-solid ${ICONS[type]}" style="color:${COLORS[type]};font-size:1rem;flex-shrink:0;"></i>
        <span style="flex:1;">${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-600);cursor:pointer;padding:0;font-size:0.875rem;"><i class="fa-solid fa-xmark"></i></button>`;
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
      });
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    };
  })();

  // ── Modal system ─────────────────────────────────────
  SESMINE.modal = {
    open(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
    },
    close(id) {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
    },
    closeAll() {
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    },
  };

  // Close modal on backdrop click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) SESMINE.modal.closeAll();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') SESMINE.modal.closeAll();
  });

  // ── Smooth scroll for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Active nav link highlight ─────────────────────────
  (function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a').forEach(link => {
      const href = link.getAttribute('href').split('/').pop();
      if (href === path) link.classList.add('active');
    });
  })();

  // ── Copy-to-clipboard helper ─────────────────────────
  SESMINE.copyToClipboard = function(text, label = 'Copied!') {
    navigator.clipboard?.writeText(text).then(() => {
      SESMINE.toast(label, 'success', 2500);
    }).catch(() => {
      SESMINE.toast('Copy failed — please copy manually.', 'error');
    });
  };

  // ── Form validation helper ───────────────────────────
  SESMINE.validateEmail = function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  SESMINE.validateForm = function(formEl) {
    let valid = true;
    formEl.querySelectorAll('[required]').forEach(field => {
      const empty = !field.value.trim();
      field.style.borderColor = empty ? 'var(--rose-500)' : '';
      if (empty) valid = false;
    });
    // Email field specific validation
    formEl.querySelectorAll('[type="email"]').forEach(field => {
      if (field.value && !SESMINE.validateEmail(field.value)) {
        field.style.borderColor = 'var(--rose-500)';
        valid = false;
      }
    });
    return valid;
  };

  // ── Number counter animation ─────────────────────────
  SESMINE.animateCounter = function(el, from, to, duration = 1200, suffix = '') {
    const start  = performance.now();
    const range  = to - from;
    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(from + range * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  // Auto-trigger counters when they enter viewport
  document.querySelectorAll('[data-count-to]').forEach(el => {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const to      = parseFloat(el.dataset.countTo);
          const from    = parseFloat(el.dataset.countFrom  || 0);
          const suffix  = el.dataset.countSuffix || '';
          const dur     = parseInt(el.dataset.countDuration || 1200);
          SESMINE.animateCounter(el, from, to, dur, suffix);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(el);
  });

  // ── Stagger delay injection ───────────────────────────
  // Automatically assigns delay classes to .stagger children
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  // ── Lazy image loading fallback ───────────────────────
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObs   = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          imgObs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObs.observe(img));
  }

  // ── External link safety ─────────────────────────────
  document.querySelectorAll('a[href^="http"]').forEach(a => {
    if (!a.href.includes('sesmine.com')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // ── Keyboard accessibility: focus-visible polyfill ───
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
  });
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });

  // ── Performance: preconnect on hover ─────────────────
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const url = link.href;
      if (url && url.startsWith(window.location.origin)) {
        const prefetch = document.createElement('link');
        prefetch.rel  = 'prefetch';
        prefetch.href = url;
        document.head.appendChild(prefetch);
      }
    }, { once: true });
  });

  // ── Ready log ────────────────────────────────────────
  console.log('%c SESMine main.js loaded ', 'background:#0e7490;color:#fff;padding:2px 6px;border-radius:3px;');

})();
