/**
 * ARCHIVEHUBS — Main Entry Point
 * /js/main.js
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
  // Initialize all modules
  Auth.init();
  Feed.init();      // This will now fetch real posts
  Stories.init();
  Search.init();
  Connections.init();
  Messaging.init();
  CreatePost.init();
  CreateStory.init();

  // Expose globally for onclick handlers
  window.CreatePost = CreatePost;
  window.CreateStory = CreateStory;
  window.Feed = Feed;  // Add this for refresh access
});