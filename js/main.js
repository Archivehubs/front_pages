/**
 * ARCHIVEHUBS — Main Entry Point
 * /js/main.js
 *
 * Single DOMContentLoaded listener for home.html.
 * All feature modules are imported and initialised here.
 *
 * HTML: replace ALL existing <script> tags at bottom of home.html with:
 *   <script type="module" src="js/main.js"></script>
 *
 * Remove these old tags entirely:
 *   <script src="js/script.js"></script>
 *   <script src="js/message.js"></script>
 *   + all inline <script> blocks in home.html
 */

import Auth        from './modules/auth.js';
import Feed        from './modules/feed.js';
import Stories     from './modules/stories.js';
import Search      from './modules/search.js';
import Connections from './modules/connections.js';
import Messaging   from './modules/messaging.js';
import CreatePost  from './modules/createPost.js';
import CreateStory from './modules/createStory.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ── Initialise all modules ─────────────────────────────── */
  Auth.init();
  Feed.init();
  Stories.init();
  Search.init();
  Connections.init();
  Messaging.init();
  CreatePost.init();
  CreateStory.init();

  /* ── Expose modal openers globally ──────────────────────────
     Required because home.html uses onclick="CreatePost.open()"
     and onclick="CreateStory.open()" on static HTML elements.
     Once all onclick attrs are replaced with event listeners
     these window assignments can be removed.
  ─────────────────────────────────────────────────────────── */
  window.CreatePost  = CreatePost;
  window.CreateStory = CreateStory;

});