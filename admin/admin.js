/**
 * SESMine Admin — Shared JS
 * Sidebar toggle, active nav, shared utilities.
 */

(function() {
  'use strict';

  // ── Sidebar toggle ───────────────────────────────────
  window.toggleSidebar = function() {
    const sidebar = document.getElementById('adminSidebar');
    const main    = document.querySelector('.admin-main');
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('mobile-open');
    } else {
      sidebar.classList.toggle('collapsed');
      if (main) main.classList.toggle('expanded');
    }
  };

  // ── Active nav link ──────────────────────────────────
  (function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.admin-nav__item').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page) link.classList.add('active');
      else link.classList.remove('active');
    });
  })();

  // ── Reveal observer ──────────────────────────────────
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // ── Admin toast ──────────────────────────────────────
  window.adminToast = function(msg, type = 'info') {
    const colors = { success:'var(--emerald-400)', error:'var(--rose-400)', warning:'var(--amber-400)', info:'var(--cyan-400)' };
    const icons  = { success:'fa-check-circle', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
    let container = document.getElementById('adminToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'adminToastContainer';
      container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;display:flex;flex-direction:column;gap:0.5rem;z-index:9999;pointer-events:none;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `display:flex;align-items:center;gap:0.75rem;padding:0.875rem 1.25rem;background:var(--coal-800);border:1px solid var(--border-200);border-left:3px solid ${colors[type]};border-radius:var(--radius-lg);box-shadow:0 8px 32px rgba(0,0,0,0.5);font-size:0.875rem;color:var(--text-200);pointer-events:all;opacity:0;transform:translateX(20px);transition:opacity 0.25s ease,transform 0.25s ease;max-width:320px;`;
    toast.innerHTML = `<i class="fa-solid ${icons[type]}" style="color:${colors[type]};flex-shrink:0;"></i><span style="flex:1;">${msg}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateX(0)'; });
    setTimeout(() => { toast.style.opacity='0'; toast.style.transform='translateX(20px)'; setTimeout(()=>toast.remove(),300); }, 3500);
  };

  // ── Confirm dialog ───────────────────────────────────
  window.adminConfirm = function(msg, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:9000;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
      <div style="background:var(--coal-900);border:1px solid var(--border-200);border-radius:var(--radius-xl);padding:2rem;max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
        <div style="width:44px;height:44px;border-radius:50%;background:rgba(239,68,68,0.1);border:2px solid var(--rose-500);display:flex;align-items:center;justify-content:center;color:var(--rose-400);font-size:1.125rem;margin-bottom:1rem;"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div style="font-size:0.9375rem;font-weight:600;color:var(--text-100);margin-bottom:0.5rem;">Confirm Action</div>
        <div style="font-size:0.875rem;color:var(--text-400);line-height:1.65;margin-bottom:1.5rem;">${msg}</div>
        <div style="display:flex;gap:0.75rem;">
          <button onclick="this.closest('[style]').remove()" class="btn btn--ghost btn--md" style="flex:1;">Cancel</button>
          <button id="confirmOkBtn" class="btn btn--rose btn--md" style="flex:1;">Confirm</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmOkBtn').addEventListener('click', () => { overlay.remove(); onConfirm(); });
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  // ── Export table to CSV ──────────────────────────────
  window.exportTableCSV = function(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows  = Array.from(table.querySelectorAll('tr'));
    const csv   = rows.map(row =>
      Array.from(row.querySelectorAll('th,td'))
        .map(cell => '"' + cell.textContent.trim().replace(/"/g,'""') + '"')
        .join(',')
    ).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = filename || 'sesmine-export.csv';
    a.click();
  };

  // ── Format numbers ───────────────────────────────────
  window.fmtNum = n => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : String(n);

  console.log('%c SESMine Admin JS loaded ', 'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:3px;');
})();
