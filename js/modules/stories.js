/**
 * ARCHIVEHUBS — Stories Module
 * /js/modules/stories.js
 *
 * Responsibilities:
 *   - "Create Story" card click → opens CreateStory modal
 *   - Story card click → opens story viewer (placeholder for Phase 5)
 *   - Manages "Your Story" preview after a story is posted
 *
 * Replaces:
 *   - StoryHandler class in script.js (fully superseded by createStory.js modal)
 *   - The nested DOMContentLoaded(() => new StoryHandler()) in script.js
 *   - The file input on .create-story-top (now goes through the modal)
 *
 * Note: The old StoryHandler did a local preview-only upload.
 *       The new flow: create-story card → CreateStory modal → API (Phase 5).
 */

const Stories = (() => {
  'use strict';

  /* ── Create story trigger ──────────────────────────────────── */

  function _initCreateStoryTrigger() {
    // The create story card and the plus button both open the modal.
    // Old flow: directly triggered a file input.
    // New flow: opens CreateStory modal (createStory.js).

    const createStoryTop = document.querySelector('.create-story-top');
    if (createStoryTop) {
      createStoryTop.addEventListener('click', (e) => {
        e.preventDefault();
        // CreateStory is exposed on window by main.js
        if (window.CreateStory) {
          window.CreateStory.open();
        }
      });
    }

    // Also handle the label element that used to trigger a file input
    const createStoryPlus = document.querySelector('.create-story-plus');
    if (createStoryPlus) {
      createStoryPlus.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.CreateStory) window.CreateStory.open();
      });
    }

    // The hidden file input (#story-upload) is no longer used directly.
    // It remains in the DOM for backward compat but CreateStory modal
    // has its own file input (#csFileInput).
  }

  /* ── Story card viewer ─────────────────────────────────────── */

  function _initStoryViewer() {
    document.querySelectorAll('.story-card:not(.create-story)').forEach(card => {
      card.addEventListener('click', () => {
        const username = card.querySelector('.story-username')?.textContent || 'Story';
        const avatar   = card.querySelector('.story-avatar')?.src || '';

        // ── API HOOK (Phase 5) ────────────────────────────────
        // Fetch story media and open a full-screen story viewer:
        // fetch(`/api/stories/${card.dataset.userId}`)
        //   .then(r => r.json())
        //   .then(data => StoryViewer.open(data));
        //
        // For now: placeholder alert until viewer is built.
        console.log(`[Stories] Viewing story for: ${username}`);
        // StoryViewer module will be built in Phase 5 alongside the API.
      });
    });
  }

  /* ── Prepend story card (called from CreateStory after post) ── */

  function prependStoryCard({ username = 'Your Story', avatarSrc = 'images/profile.jpg', mediaSrc, mediaType }) {
    const container      = document.querySelector('.stories-container');
    const createStoryEl  = document.querySelector('.create-story');
    if (!container || !createStoryEl) return;

    const card = document.createElement('div');
    card.className = 'story-card';

    const mediaEl = mediaType === 'video'
      ? `<video src="${mediaSrc}" class="story-media" autoplay muted loop></video>`
      : `<img src="${mediaSrc || avatarSrc}" alt="Story" class="story-media">`;

    card.innerHTML = `
      <div class="story-content">
        ${mediaEl}
        <img src="${avatarSrc}" alt="${username}" class="story-avatar">
        <span class="story-username">${username}</span>
      </div>
    `;

    // Insert right after the create-story card
    container.insertBefore(card, createStoryEl.nextSibling);
  }

  /* ── Public API ────────────────────────────────────────────── */

  function init() {
    _initCreateStoryTrigger();
    _initStoryViewer();
  }

  return { init, prependStoryCard };

})();

export default Stories;