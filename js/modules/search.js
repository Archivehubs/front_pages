/**
 * ARCHIVEHUBS — Search Module
 * /js/modules/search.js
 *
 * Responsibilities:
 *   - Desktop nav search box toggle (click trigger, outside-click close)
 *   - Mobile search overlay open / close
 *
 * Replaces:
 *   - 3× duplicate search DOMContentLoaded blocks in script.js
 *   - The rogue document.querySelector('.search-trigger') call
 *     outside DOMContentLoaded that crashed on non-home pages
 *   - Search overlay inline <script> block in home.html
 *
 * Removed (not in home.html):
 *   - Menu page search filter (belongs in Archivehubs-Menu/menu.js)
 *   - Community page search filter (belongs in Archivehubs-Community/community.js)
 *   - Mobile search trigger/close from script.js (.mobile-search-trigger
 *     and .search-close don't exist in home.html's markup)
 */

const Search = (() => {
  'use strict';

  /* ── Desktop search box ────────────────────────────────────── */

  function _initDesktopSearch() {
    const searchBox     = document.querySelector('.search-box');
    const searchTrigger = document.querySelector('.search-trigger');
    const searchInput   = document.querySelector('.search-input');

    if (!searchBox || !searchTrigger || !searchInput) return;

    // Open on trigger click
    searchTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      searchBox.classList.toggle('active');
      if (searchBox.classList.contains('active')) {
        searchInput.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target)) {
        searchBox.classList.remove('active');
      }
    });

    // Prevent closing when clicking inside the input
    searchInput.addEventListener('click', (e) => e.stopPropagation());

    // Placeholder behaviour
    searchInput.addEventListener('focus', function () { this.placeholder = ''; });
    searchInput.addEventListener('blur',  function () {
      if (!this.value) this.placeholder = 'Search';
    });

    // ── API HOOK (Phase 5) ────────────────────────────────────
    // Real-time search: debounce input and call GET /api/search?q=
    // let debounceTimer;
    // searchInput.addEventListener('input', function () {
    //   clearTimeout(debounceTimer);
    //   debounceTimer = setTimeout(() => {
    //     fetch(`/api/search?q=${encodeURIComponent(this.value)}`)
    //       .then(r => r.json())
    //       .then(data => SearchResults.render(data));
    //   }, 350);
    // });
  }

  /* ── Mobile search overlay ─────────────────────────────────── */

  function _initMobileSearch() {
    const triggerBtn    = document.getElementById('searchTriggerBtn');
    const searchView    = document.getElementById('searchView');
    const backBtn       = document.getElementById('searchBackBtn');
    const searchInput   = document.getElementById('searchInput');

    if (!triggerBtn || !searchView) return;

    function openSearch() {
      searchView.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 60);
    }

    function closeSearch() {
      searchView.classList.remove('active');
      document.body.style.overflow = '';
    }

    triggerBtn.addEventListener('click', (e) => { e.preventDefault(); openSearch(); });
    backBtn?.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchView.classList.contains('active')) {
        closeSearch();
      }
    });
  }

  /* ── Public API ────────────────────────────────────────────── */

  function init() {
    _initDesktopSearch();
    _initMobileSearch();
  }

  return { init };

})();

export default Search;