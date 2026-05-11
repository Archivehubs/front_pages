/**
 * ARCHIVEHUBS — Feed Module
 * /js/modules/feed.js
 *
 * Responsibilities:
 *   - Like / unlike posts (animated count)
 *   - Comment modal (open, close, render, add, filter, sort)
 *   - Repost popup + "Repost with thoughts" modal
 *   - Share modal
 *   - Post metrics formatting
 *
 * Replaces:
 *   - initializeLikeButtons / handleLikeClick / likePost / unlikePost
 *   - animateLikeCount / updateLikeCount in script.js
 *   - All comment functions in script.js
 *   - Repost inline <script> blocks in home.html
 *   - Share inline <script> block in home.html
 *
 * API hooks marked with: // ── API HOOK ──
 */

const Feed = (() => {
  'use strict';

  /* ── Hardcoded comment data (Phase 4 → moves to api.js) ────── */
  const COMMENTS_BY_POST = {
    1: [
      { id: 1,  author: 'Alex Rodriguez', avatar: 'images/profile.jpg', text: "Really interesting! I've been working on similar AI implementations.", time: '2 hours ago',  likes: 12 },
      { id: 2,  author: 'Maria Garcia',   avatar: 'images/profile.jpg', text: 'Great insights! AI is definitely transforming how we approach development.', time: '1 hour ago',   likes: 8  },
      { id: 3,  author: 'David Kim',      avatar: 'images/profile.jpg', text: 'The possibilities are endless with machine learning.', time: '45 minutes ago', likes: 15 },
      { id: 4,  author: 'Sarah Wilson',   avatar: 'images/profile.jpg', text: 'What framework are you using for this implementation?', time: '30 minutes ago', likes: 6  },
      { id: 5,  author: 'Mike Johnson',   avatar: 'images/profile.jpg', text: 'This reminds me of a project I worked on last year.', time: '15 minutes ago', likes: 4  },
    ],
    2: [
      { id: 6,  author: 'Jennifer Lee',   avatar: 'images/profile.jpg', text: 'This platform looks amazing! Can\'t wait to try it out.', time: '3 hours ago',  likes: 18 },
      { id: 7,  author: 'Robert Chen',    avatar: 'images/profile.jpg', text: 'Finally, a solution for digital asset management!', time: '2 hours ago',  likes: 14 },
      { id: 8,  author: 'Amanda Foster',  avatar: 'images/profile.jpg', text: 'The interface looks so clean and professional.', time: '1 hour ago',   likes: 9  },
      { id: 9,  author: 'Carlos Mendez',  avatar: 'images/profile.jpg', text: 'How does this compare to other solutions in the market?', time: '45 minutes ago', likes: 7  },
      { id: 10, author: 'Lisa Thompson',  avatar: 'images/profile.jpg', text: 'This is going to revolutionise how we handle archives!', time: '20 minutes ago', likes: 11 },
    ],
  };

  /* ── Utilities ─────────────────────────────────────────────── */

  function _qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function _qsa(selector, scope = document) {
    return scope.querySelectorAll(selector);
  }

  function _animateCount(el, start, end, duration = 300) {
    const t0 = performance.now();
    function step(t) {
      const p   = Math.min((t - t0) / duration, 1);
      const val = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 2)));
      el.textContent = val;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ── Likes ─────────────────────────────────────────────────── */

  function _initLikes() {
    _qsa('.like-btn').forEach(btn => {
      const postId = btn.dataset.postId;

      // ── API HOOK (Phase 5) ───────────────────────────────────
      // Replace localStorage read with: GET /api/posts/:id/liked
      const isLiked = localStorage.getItem(`post_${postId}_liked`) === 'true';
      if (isLiked) _setLiked(btn, true);

      btn.addEventListener('click', () => _handleLike(btn));
    });
  }

  function _handleLike(btn) {
    const postId     = btn.dataset.postId;
    const isLiked    = btn.classList.contains('liked');
    const countEl    = btn.closest('.post')?.querySelector('.metric-count[data-likes]');
    if (!countEl) return;

    const current = parseInt(countEl.dataset.likes) || 0;
    const next    = isLiked ? Math.max(0, current - 1) : current + 1;

    _setLiked(btn, !isLiked);
    countEl.dataset.likes = next;
    countEl.classList.add('updating');
    _animateCount(countEl, current, next);
    setTimeout(() => countEl.classList.remove('updating'), 320);

    // ── API HOOK (Phase 5) ───────────────────────────────────
    // Replace localStorage with:
    // fetch(`/api/posts/${postId}/like`, { method: isLiked ? 'DELETE' : 'POST' })
    //   .catch(err => { _setLiked(btn, isLiked); countEl.dataset.likes = current; }); // rollback on error
    if (isLiked) {
      localStorage.removeItem(`post_${postId}_liked`);
    } else {
      localStorage.setItem(`post_${postId}_liked`, 'true');
    }
  }

  function _setLiked(btn, liked) {
    btn.classList.toggle('liked', liked);
    btn.dataset.liked = liked;
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fas', liked);
      icon.classList.toggle('far', !liked);
    }
  }

  /* ── Comment Modal ─────────────────────────────────────────── */

  let _activePostId = null;

  function _initComments() {
    const modal      = document.getElementById('commentModal');
    const closeBtn   = _qs('.close-modal-btn', modal);
    const filterBtns = _qsa('.filter-btn', modal);
    const postCmtBtn = _qs('.post-comment-btn', modal);
    const cmtInput   = _qs('.comment-input', modal);

    if (!modal) return;

    // Open via comment count trigger
    _qsa('.comment-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const post = trigger.closest('.post');
        if (post) _openCommentModal(post);
      });
    });

    // Open via Comment action button
    _qsa('.post-actions .action-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon && (icon.classList.contains('fa-comment'))) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const post = btn.closest('.post');
          if (post) _openCommentModal(post);
        });
      }
    });

    // Close
    closeBtn?.addEventListener('click', _closeCommentModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) _closeCommentModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        _closeCommentModal();
      }
    });

    // Filter tabs
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _filterComments(btn.dataset.filter);
      });
    });

    // Post comment
    postCmtBtn?.addEventListener('click', _addNewComment);

    cmtInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _addNewComment();
      }
    });
  }

  function _openCommentModal(post) {
    const modal     = document.getElementById('commentModal');
    if (!modal) return;

    _activePostId = parseInt(post.dataset.postId) || 1;

    // Populate preview
    const preview    = _qs('.post-preview', modal);
    const postHeader = _qs('.post-header', post);
    const postContent= _qs('.post-content', post);

    if (preview && postHeader && postContent) {
      preview.innerHTML = `
        <div class="post-header">${postHeader.innerHTML}</div>
        <div class="post-content">${postContent.innerHTML}</div>
      `;
    }

    // Load comments
    _loadComments(_activePostId);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus input
    setTimeout(() => _qs('.comment-input', modal)?.focus(), 120);
  }

  function _closeCommentModal() {
    const modal = document.getElementById('commentModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const input = _qs('.comment-input', modal);
    if (input) input.value = '';
    _activePostId = null;
  }

  function _loadComments(postId) {
    const container = _qs('.comments-container');
    if (!container) return;

    // ── API HOOK (Phase 5) ──────────────────────────────────
    // fetch(`/api/posts/${postId}/comments`)
    //   .then(r => r.json())
    //   .then(data => _renderComments(container, data.comments));

    const data = COMMENTS_BY_POST[postId] || COMMENTS_BY_POST[1];
    _renderComments(container, data);
  }

  function _renderComments(container, comments) {
    container.innerHTML = comments.map(c => `
      <div class="comment-item" data-comment-id="${c.id}">
        <img src="${c.avatar}" alt="${c.author}" class="comment-avatar">
        <div class="comment-content">
          <div class="comment-author">${c.author}</div>
          <div class="comment-text">${c.text}</div>
          <div class="comment-actions">
            <button class="comment-action like-comment" data-likes="${c.likes}">Like (${c.likes})</button>
            <button class="comment-action reply-btn">Reply</button>
            <span class="comment-time">${c.time}</span>
          </div>
        </div>
      </div>
    `).join('');

    _bindCommentActions(container);
  }

  function _bindCommentActions(container) {
    container.querySelectorAll('.like-comment').forEach(btn => {
      btn.addEventListener('click', function () {
        const current = parseInt(this.dataset.likes);
        const isLiked = this.classList.contains('liked');
        const next    = isLiked ? current - 1 : current + 1;
        this.classList.toggle('liked', !isLiked);
        this.dataset.likes = next;
        this.textContent   = `Like (${next})`;
      });
    });

    container.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const author = this.closest('.comment-item')?.querySelector('.comment-author')?.textContent;
        const input  = _qs('.comment-input');
        if (input && author) {
          input.value = `@${author} `;
          input.focus();
        }
      });
    });
  }

  function _addNewComment() {
    const input = _qs('.comment-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const container = _qs('.comments-container');
    if (!container) return;

    // ── API HOOK (Phase 5) ──────────────────────────────────
    // fetch(`/api/posts/${_activePostId}/comments`, { method:'POST', body: JSON.stringify({ text }) })
    //   .then(r => r.json())
    //   .then(data => _prependComment(container, data.comment));

    const comment = {
      id:     Date.now(),
      author: 'You',
      avatar: 'images/profile.jpg',
      text,
      time:   'Just now',
      likes:  0,
    };

    const div = document.createElement('div');
    div.className = 'comment-item';
    div.dataset.commentId = comment.id;
    div.innerHTML = `
      <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
      <div class="comment-content">
        <div class="comment-author">${comment.author}</div>
        <div class="comment-text">${comment.text}</div>
        <div class="comment-actions">
          <button class="comment-action like-comment" data-likes="0">Like (0)</button>
          <button class="comment-action reply-btn">Reply</button>
          <span class="comment-time">${comment.time}</span>
        </div>
      </div>
    `;
    container.insertAdjacentElement('afterbegin', div);
    _bindCommentActions(div);
    input.value = '';

    // Update count on original post card
    _updateCommentCount(container.querySelectorAll('.comment-item').length);
  }

  function _updateCommentCount(count) {
    if (!_activePostId) return;
    const post    = document.querySelector(`.post[data-post-id="${_activePostId}"]`);
    const trigger = post?.querySelector('.comment-trigger');
    if (trigger) {
      trigger.textContent         = `${count} comments`;
      trigger.dataset.comments    = count;
    }
  }

  function _filterComments(type) {
    const container = _qs('.comments-container');
    if (!container) return;

    if (type === 'all') { _loadComments(_activePostId); return; }

    const items = Array.from(container.querySelectorAll('.comment-item'));

    items.sort((a, b) => {
      if (type === 'relevant') {
        const la = parseInt(a.querySelector('.like-comment')?.dataset.likes || 0);
        const lb = parseInt(b.querySelector('.like-comment')?.dataset.likes || 0);
        return lb - la;
      }
      if (type === 'newest') return -1; // reverse
      return 0;
    });

    items.forEach(item => container.appendChild(item));
  }

  /* ── Repost ─────────────────────────────────────────────────── */

  function _initReposts() {
    // Wire up each repost button that has a local popup (data-post-id based)
    _qsa('.repost-btn').forEach(btn => {
      const post    = btn.closest('.post');
      if (!post) return;
      const postId  = post.dataset.postId;
      const popup   = document.getElementById(`repost-expanded-${postId}`);
      if (!popup) return;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
      });

      // Plain repost option
      const plainBtn = document.getElementById(`plainRepost-${postId}`);
      plainBtn?.addEventListener('click', () => {
        popup.style.display = 'none';
        _showToast('Post reposted to your feed.');
        // ── API HOOK: POST /api/posts/:id/repost
      });

      // Repost with thoughts option
      const thoughtBtn = document.getElementById(`thoughtRepost-btn-${postId}`);
      thoughtBtn?.addEventListener('click', () => {
        popup.style.display = 'none';
        _openRepostThoughtsModal(postId, post);
      });
    });

    // Close all repost popups on outside click
    document.addEventListener('mousedown', () => {
      _qsa('.repost-expanded').forEach(p => { p.style.display = 'none'; });
    });

    // Repost-with-thoughts modal controls
    _qsa('[id^="repostThoughtsModal"]').forEach(modal => {
      const id         = modal.id.replace('repostThoughtsModal', '');
      const closeBtn   = document.getElementById(`repostThoughtsClose${id}`);
      const cancelBtn  = document.getElementById(`repostThoughtsCancel${id}`);
      const postBtn    = document.getElementById(`repostThoughtsPost${id}`);
      const overlay    = document.getElementById(`repostThoughtsOverlay${id}`);

      const close = () => { modal.style.display = 'none'; document.body.style.overflow = ''; };

      closeBtn?.addEventListener('click', close);
      cancelBtn?.addEventListener('click', close);
      overlay?.addEventListener('click', close);
      postBtn?.addEventListener('click', () => {
        close();
        _showToast('Reposted with your thoughts.');
        // ── API HOOK: POST /api/posts/:id/repost { thoughts: textarea.value }
      });
    });
  }

  function _openRepostThoughtsModal(postId, originalPost) {
    const modal   = document.getElementById(`repostThoughtsModal${postId}`);
    const preview = document.getElementById(`repostOriginalPreview${postId}`);
    if (!modal) return;

    if (preview && originalPost) {
      const clone = originalPost.cloneNode(true);
      clone.querySelectorAll('.post-actions, .repost-expanded').forEach(el => el.remove());
      preview.innerHTML = '';
      preview.appendChild(clone);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  /* ── Share modal ───────────────────────────────────────────── */

  function _initShare() {
    _qsa('[id^="share-btn-"]').forEach(btn => {
      const postId = btn.id.replace('share-btn-', '');
      const modal  = document.getElementById(`shareModal${postId}`);
      if (!modal) return;

      const overlay  = document.getElementById(`shareOverlay${postId}`);
      const closeBtn = document.getElementById(`shareClose${postId}`);
      const shareNow = document.getElementById(`shareNow${postId}`);

      const open  = () => { modal.style.display = 'block'; document.body.style.overflow = 'hidden'; };
      const close = () => { modal.style.display = 'none';  document.body.style.overflow = ''; };

      btn.addEventListener('click', (e) => { e.preventDefault(); open(); });
      overlay?.addEventListener('click', close);
      closeBtn?.addEventListener('click', close);
      shareNow?.addEventListener('click', () => { close(); _showToast('Post shared!'); });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') close();
      });
    });
  }

  /* ── Toast utility ─────────────────────────────────────────── */

  function _showToast(msg) {
    const existing = document.querySelector('.story-success-message');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className   = 'story-success-message';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  /* ── Public API ────────────────────────────────────────────── */

  function init() {
    _initLikes();
    _initComments();
    _initReposts();
    _initShare();
  }

  return { init };

})();

export default Feed;