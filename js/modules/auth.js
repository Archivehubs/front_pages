const Auth = (() => {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────────── */

  function _initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }

    // Desktop toggle switch (id="theme-switch" in nav dropdown)
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
      themeSwitch.checked = (saved === 'dark');
      themeSwitch.addEventListener('change', function () {
        _applyTheme(this.checked ? 'dark' : 'light');
      });
    }

    // Button-style toggle (id="theme-toggle" — icon button in nav)
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        _applyTheme(current === 'dark' ? 'light' : 'dark');
        // Keep checkbox in sync if it exists
        if (themeSwitch) themeSwitch.checked = (current !== 'dark');
      });
    }
  }

  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  /* ── Account popup ─────────────────────────────────────────── */

  function _initAccountPopup() {
    const trigger = document.getElementById('accountPopup');
    const panel   = document.getElementById('accountPopupPanel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const rect = trigger.getBoundingClientRect();

      // Position below the nav link, right-aligned
      panel.style.top   = (rect.bottom + window.scrollY + 8) + 'px';
      panel.style.right = (window.innerWidth - rect.right - 8) + 'px';
      panel.style.left  = 'auto';

      const isVisible = panel.style.display === 'block';
      panel.style.display = isVisible ? 'none' : 'block';
    });

    // Close on outside click
    document.addEventListener('mousedown', (e) => {
      if (
        panel.style.display === 'block' &&
        !panel.contains(e.target) &&
        !trigger.contains(e.target)
      ) {
        panel.style.display = 'none';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.style.display === 'block') {
        panel.style.display = 'none';
      }
    });
  }

  /* ── Nav active state ──────────────────────────────────────── */

  function _initNavActive() {
    const currentPath = window.location.pathname.split('/').pop() || 'home.html';

    // Desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      if (href && href === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile bottom nav items
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      link.classList.toggle('active', href === currentPath);
    });

    // Mobile top nav items — click to set active
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
      item.addEventListener('click', function () {
        mobileNavItems.forEach(n => n.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  /* ── Sign out ───────────────────────────────────────────────── */

  function _initSignOut() {
    const signOutBtn = document.querySelector('.account-popup-signout');
    if (!signOutBtn) return;
    signOutBtn.addEventListener('click', () => {
      // API hook: POST /api/auth/logout then redirect
      // fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/login.html');
      if (confirm('Sign out of ArchiveHubs?')) {
        window.location.href = 'login.html';
      }
    });
  }

  /* ── Public API ────────────────────────────────────────────── */

  function init() {
    _initTheme();
    _initAccountPopup();
    _initNavActive();
    _initSignOut();
  }

  return { init };

})();

export default Auth;