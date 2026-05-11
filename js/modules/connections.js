/**
 * ARCHIVEHUBS — Connections Module
 * /js/modules/connections.js
 *
 * Responsibilities:
 *   - Connect / Decline button interactions (optimistic UI)
 *   - "Pending" state toggle on connect
 *   - Decline removes card from feed
 *
 * Replaces:
 *   - The querySelectorAll('.connect-btn') block in script.js
 *     (which only toggled text, had no decline handler, no API stub)
 *
 * API hooks marked with: // ── API HOOK ──
 */

const Connections = (() => {
  'use strict';

  function _initConnectButtons() {
    // Use event delegation — handles cards injected dynamically later
    document.addEventListener('click', (e) => {

      /* ── Connect button ─────────────────────────────────── */
      if (e.target.matches('.connect-btn') || e.target.closest('.connect-btn')) {
        const btn  = e.target.closest('.connect-btn');
        const card = btn.closest('.connection-card, .suggestion-item');

        if (btn.textContent.trim() === 'Connect') {
          btn.textContent  = 'Pending';
          btn.classList.add('pending');
          btn.disabled     = true;
          btn.style.opacity = '0.65';

          // ── API HOOK (Phase 5) ──────────────────────────────
          // const userId = card?.dataset.userId;
          // fetch(`/api/connections/${userId}`, { method: 'POST' })
          //   .catch(() => { btn.textContent = 'Connect'; btn.classList.remove('pending'); btn.disabled = false; btn.style.opacity = ''; });

        } else if (btn.textContent.trim() === 'Pending') {
          // Cancel request
          btn.textContent  = 'Connect';
          btn.classList.remove('pending');
          btn.disabled     = false;
          btn.style.opacity = '';

          // ── API HOOK (Phase 5) ──────────────────────────────
          // fetch(`/api/connections/${card?.dataset.userId}`, { method: 'DELETE' });
        }
      }

      /* ── Decline button ─────────────────────────────────── */
      if (e.target.matches('.decline-btn') || e.target.closest('.decline-btn')) {
        const btn  = e.target.closest('.decline-btn');
        const card = btn.closest('.connection-card, .suggestion-item');

        if (card) {
          // Animate out then remove
          card.style.transition = 'opacity 0.25s, transform 0.25s';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.95)';
          setTimeout(() => card.remove(), 260);
        }

        // ── API HOOK (Phase 5) ──────────────────────────────
        // fetch(`/api/connections/${card?.dataset.userId}/decline`, { method: 'POST' });
      }

      /* ── Follow button (right sidebar pages) ───────────── */
      if (e.target.matches('.follow-btn') || e.target.closest('.follow-btn')) {
        const btn      = e.target.closest('.follow-btn');
        const isFollow = btn.textContent.trim() === 'Follow';
        btn.textContent = isFollow ? 'Following' : 'Follow';
        btn.style.background = isFollow ? 'var(--accent-color)' : '';
        btn.style.color      = isFollow ? 'var(--color-dark)'   : '';

        // ── API HOOK (Phase 5) ──────────────────────────────
        // const pageId = btn.closest('[data-page-id]')?.dataset.pageId;
        // fetch(`/api/pages/${pageId}/follow`, { method: isFollow ? 'POST' : 'DELETE' });
      }
    });
  }

  /* ── Public API ────────────────────────────────────────────── */

  function init() {
    _initConnectButtons();
  }

  return { init };

})();

export default Connections;