/**
 * ARCHIVEHUBS — Feed Module (Backend Integrated)
 * /js/modules/feed.js
 *
 * Responsibilities:
 *   - Fetch and display posts from backend
 *   - Like / unlike posts
 *   - Comment modal with real API
 *   - Repost functionality
 *   - Share modal
 *   - Infinite scroll / pagination
 */

import API from '../api.js';

const Feed = (() => {
  'use strict';

  /* ── State ─────────────────────────────────────────────────── */
  let state = {
    posts: [],
    isLoading: false,
    hasMore: true,
    paginate: 0,
    currentPostId: null,
    currentComments: [],
    commentSort: 'relevant'
  };

  /* ── DOM Elements ──────────────────────────────────────────── */
  let elements = {};

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
      const p = Math.min((t - t0) / duration, 1);
      const val = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 2)));
      el.textContent = _formatNumber(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function _formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  function _formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    return date.toLocaleDateString();
  }

  function _showToast(message, type = 'success') {
    const existing = document.querySelector('.feed-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `feed-toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'error' ? '#ef4444' : '#22c55e'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 100000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ── Render Posts ──────────────────────────────────────────── */
  function _renderPost(post) {
    const postId = post.id;
    const likeCount = post.likeCount || 0;
    const commentCount = post.commentCount || 0;
    const mediaUrls = post.mediaUrls || [];
    const createdAt = post.createdAt?.low || post.createdAt;
    
    // Get author info (simplified - you'll need to fetch author details)
    const authorName = post.authorName || 'User';
    const authorAvatar = post.authorAvatar || 'images/profile.jpg';
    const authorRole = post.authorRole || 'Member';
    
    const mediaHtml = mediaUrls.map(url => {
      const isVideo = url.match(/\.(mp4|webm|mov)$/i);
      if (isVideo) {
        return `<video src="${url}" class="post-image" controls></video>`;
      }
      return `<img src="${url}" alt="Post image" class="post-image">`;
    }).join('');
    
    const tagsHtml = post.tags ? post.tags.map(tag => `#${tag}`).join(' ') : '';
    
    return `
      <div class="post" data-post-id="${postId}" data-post-author="${post.authorId}">
        <div class="post-header">
          <div class="post-author-info">
            <a href="Archivehubs-Individual_Page/Individual_Bio_profile.html">
              <img src="${authorAvatar}" alt="Profile" class="post-profile-pic">
            </a>
            <div class="post-author-details">
              <h4 class="post-author-name">${_escapeHtml(authorName)}</h4>
              <p class="post-meta">${_escapeHtml(authorRole)} • ${_formatTime(createdAt)}</p>
            </div>
          </div>
          <button class="more-options post-menu-btn" data-post-id="${postId}">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>

        <div class="post-content">
          <p class="post-text">${_escapeHtml(post.textContent)} ${tagsHtml}</p>
          ${mediaHtml}
        </div>

        <div class="post-metrics">
          <span class="metric">
            <i class="fas fa-thumbs-up"></i>
            <span class="metric-count" data-likes="${likeCount}">${_formatNumber(likeCount)}</span>
          </span>
          <span class="metric">
            <span class="metric-count comment-trigger" data-comments="${commentCount}">${_formatNumber(commentCount)} comments</span>
          </span>
        </div>

        <div class="post-actions">
          <button class="action-btn like-btn" data-post-id="${postId}" data-liked="false">
            <i class="far fa-thumbs-up"></i>
            <span>Like</span>
          </button>
          <button class="action-btn comment-action-btn" data-post-id="${postId}">
            <i class="far fa-comment"></i>
            <span>Comment</span>
          </button>
          <div class="repostWrapper" style="position:relative;display:inline-block;">
            <button class="action-btn repost-btn" data-post-id="${postId}">
              <i class="fas fa-retweet"></i>
              <span>Repost</span>
            </button>
            <div class="repost-expanded" id="repost-expanded-${postId}" style="display:none; position:absolute; left:0; top:40px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; box-shadow:0 12px 28px rgba(0,0,0,.2); width:320px; z-index:10000;">
              <button class="thoughtRepost-btn repost-option-btn" data-post-id="${postId}" style="display:block;width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:12px 14px;">
                <span class="material-symbols-outlined" style="vertical-align:middle;margin-right:10px;">edit_square</span>
                <strong>Repost with your thoughts</strong>
                <p style="margin:4px 0 0 30px;font-size:12px;color:#6b7280">Create a new post with thoughts</p>
              </button>
              <hr style="margin:0">
              <button class="plainRepost-btn repost-option-btn" data-post-id="${postId}" style="display:block;width:100%;text-align:left;background:transparent;border:0;cursor:pointer;padding:12px 14px;">
                <span class="material-symbols-outlined" style="vertical-align:middle;margin-right:10px;">repeat</span>
                <strong>Repost</strong>
                <p style="margin:4px 0 0 30px;font-size:12px;color:#6b7280">Instantly bring this post to others feeds</p>
              </button>
            </div>
          </div>
          <button class="action-btn share-btn" data-post-id="${postId}">
            <i class="far fa-paper-plane"></i>
            <span>Share</span>
          </button>
        </div>
      </div>
    `;
  }

  function _escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
      return c;
    });
  }

  /* ── Load Feed from Backend ────────────────────────────────── */
  async function loadFeed(revalidate = false) {
    if (state.isLoading) return;
    if (!revalidate && !state.hasMore) return;

    state.isLoading = true;
    _showLoadingIndicator();

    try {
      const response = await fetch(`http://localhost:3000/feed?paginate=${state.paginate}&revalidate=${revalidate}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const newPosts = data.posts || [];

      if (revalidate) {
        state.posts = newPosts;
        state.paginate = 1;
      } else {
        state.posts = [...state.posts, ...newPosts];
        state.paginate++;
      }

      state.hasMore = newPosts.length > 0;
      _renderFeed();

    } catch (error) {
      console.error('Failed to load feed:', error);
      _showToast('Failed to load feed. Please refresh.', 'error');
    } finally {
      state.isLoading = false;
      _hideLoadingIndicator();
    }
  }

  function _renderFeed() {
    const postsContainer = document.querySelector('.posts-section');
    if (!postsContainer) return;

    if (state.posts.length === 0) {
      postsContainer.innerHTML = '<div class="empty-feed">No posts yet. Follow more people or create your first post!</div>';
      return;
    }

    postsContainer.innerHTML = state.posts.map(post => _renderPost(post)).join('');
    
    // Re-initialize event listeners for new posts
    _initPostEventListeners();
  }

  function _showLoadingIndicator() {
    const container = document.querySelector('.posts-section');
    if (container && !document.querySelector('.feed-loader')) {
      const loader = document.createElement('div');
      loader.className = 'feed-loader';
      loader.innerHTML = '<div class="spinner"></div><span>Loading more posts...</span>';
      container.appendChild(loader);
    }
  }

  function _hideLoadingIndicator() {
    const loader = document.querySelector('.feed-loader');
    if (loader) loader.remove();
  }

  /* ── Like / Unlike ─────────────────────────────────────────── */
  async function _handleLike(btn) {
    const postId = btn.dataset.postId;
    const isLiked = btn.classList.contains('liked');
    const post = btn.closest('.post');
    const countEl = post?.querySelector('.metric-count[data-likes]');
    if (!countEl) return;

    const current = parseInt(countEl.dataset.likes) || 0;
    const next = isLiked ? Math.max(0, current - 1) : current + 1;

    // Optimistic update
    _setLiked(btn, !isLiked);
    countEl.dataset.likes = next;
    _animateCount(countEl, current, next);

    try {
      if (isLiked) {
        await API.feed.unlike(postId);
      } else {
        await API.feed.toggleLike(postId);
      }
    } catch (error) {
      // Rollback on error
      console.error('Like/unlike failed:', error);
      _setLiked(btn, isLiked);
      countEl.dataset.likes = current;
      _animateCount(countEl, next, current);
      _showToast('Action failed. Please try again.', 'error');
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
  async function _openCommentModal(postId) {
    state.currentPostId = postId;
    const modal = document.getElementById('commentModal');
    if (!modal) return;

    // Show loading state
    const container = _qs('.comments-container', modal);
    if (container) container.innerHTML = '<div class="loading-comments">Loading comments...</div>';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load comments from API
    await _loadComments(postId);
  }

  async function _loadComments(postId, sort = state.commentSort) {
    try {
      // Note: You'll need to implement a get comments endpoint
      // For now, using a placeholder - you'll need to add this to your backend
      const response = await fetch(`http://localhost:3000/post/${postId}/comments?sort=${sort}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        state.currentComments = data.comments || [];
      } else {
        state.currentComments = [];
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      state.currentComments = [];
    }
    
    _renderComments();
  }

 function _renderComments() {
    const container = _qs('.comments-container');
    if (!container) return;

    if (state.currentComments.length === 0) {
      container.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
      return;
    }

    container.innerHTML = state.currentComments.map(comment => {
      // 1. Handle the author name (it's inside the author object)
      const authorName = comment.author?.name || 'Unknown User';
      // 2. Handle the avatar
      const avatar = comment.author?.profilePic || 'images/profile.jpg';
      
      return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <img src="${avatar}" alt="${_escapeHtml(authorName)}" class="comment-avatar">
        <div class="comment-content">
          <div class="comment-author">${_escapeHtml(authorName)}</div>
          <div class="comment-text">${_escapeHtml(comment.text)}</div>
          <div class="comment-actions">
            <button class="comment-action like-comment" data-comment-id="${comment.id}" data-likes="${comment.likes || 0}">Like (${comment.likes || 0})</button>
            <button class="comment-action reply-btn">Reply</button>
            <span class="comment-time">${_formatTime(comment.createdAt)}</span>
          </div>
        </div>
      </div>
    `}).join('');

    _bindCommentActions(container);
  }

  async function _addComment() {
    const input = _qs('.comment-input');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;

    try {
      const response = await fetch('http://localhost:3000/post/comment', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: state.currentPostId, comment: text })
      });

      if (response.ok) {
        input.value = '';
        await _loadComments(state.currentPostId);
        _updateCommentCount(state.currentComments.length + 1);
        _showToast('Comment added!');
      } else {
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      console.error('Add comment failed:', error);
      _showToast('Failed to add comment', 'error');
    }
  }

  function _updateCommentCount(count) {
    const post = document.querySelector(`.post[data-post-id="${state.currentPostId}"]`);
    const trigger = post?.querySelector('.comment-trigger');
    if (trigger) {
      trigger.textContent = `${_formatNumber(count)} comments`;
      trigger.dataset.comments = count;
    }
  }

  function _bindCommentActions(container) {
    container.querySelectorAll('.like-comment').forEach(btn => {
      btn.addEventListener('click', async function() {
        const commentId = this.dataset.commentId;
        const current = parseInt(this.dataset.likes);
        // You'll need to implement comment like endpoint
        this.dataset.likes = current + 1;
        this.textContent = `Like (${current + 1})`;
      });
    });

    container.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const author = this.closest('.comment-item')?.querySelector('.comment-author')?.textContent;
        const input = _qs('.comment-input');
        if (input && author) {
          input.value = `@${author} `;
          input.focus();
        }
      });
    });
  }

  function _closeCommentModal() {
    const modal = document.getElementById('commentModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      const input = _qs('.comment-input', modal);
      if (input) input.value = '';
      state.currentPostId = null;
    }
  }

  /* ── Repost ─────────────────────────────────────────────────── */
  async function _handleRepost(postId, thoughts = null) {
    try {
      await API.feed.repost(postId, thoughts);
      _showToast(thoughts ? 'Reposted with thoughts!' : 'Post reposted!');
    } catch (error) {
      console.error('Repost failed:', error);
      _showToast('Failed to repost', 'error');
    }
  }

  async function _handleRepostWithThoughts(postId) {
    const thoughts = prompt('Add your thoughts (optional):');
    if (thoughts !== null) {
      await _handleRepost(postId, thoughts);
    }
  }

  /* ── Share ──────────────────────────────────────────────────── */
  function _handleShare(postId) {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      _showToast('Link copied to clipboard!');
    }).catch(() => {
      _showToast('Share link: ' + url);
    });
  }

  /* ── Delete Post ────────────────────────────────────────────── */
  async function _handleDeletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await API.feed.deletePost(postId);
      // Remove post from DOM
      const post = document.querySelector(`.post[data-post-id="${postId}"]`);
      if (post) post.remove();
      // Remove from state
      state.posts = state.posts.filter(p => p.id !== postId);
      _showToast('Post deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      _showToast('Failed to delete post', 'error');
    }
  }

  /* ── Event Listeners ───────────────────────────────────────── */
  function _initPostEventListeners() {
    // Like buttons
    _qsa('.like-btn').forEach(btn => {
      btn.removeEventListener('click', () => _handleLike(btn));
      btn.addEventListener('click', () => _handleLike(btn));
    });

    // Comment buttons
    _qsa('.comment-action-btn, .comment-trigger').forEach(btn => {
      btn.removeEventListener('click', () => _openCommentModal(btn.dataset.postId || btn.closest('.post')?.dataset.postId));
      btn.addEventListener('click', () => {
        const postId = btn.dataset.postId || btn.closest('.post')?.dataset.postId;
        if (postId) _openCommentModal(postId);
      });
    });

    // Repost buttons
    _qsa('.repost-btn').forEach(btn => {
      const postId = btn.dataset.postId;
      const popup = document.getElementById(`repost-expanded-${postId}`);
      
      btn.removeEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (popup) popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
      });
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (popup) popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
      });
    });

    // Plain repost
    _qsa('.plainRepost-btn').forEach(btn => {
      btn.removeEventListener('click', () => _handleRepost(btn.dataset.postId));
      btn.addEventListener('click', () => {
        _handleRepost(btn.dataset.postId);
        const popup = document.getElementById(`repost-expanded-${btn.dataset.postId}`);
        if (popup) popup.style.display = 'none';
      });
    });

    // Repost with thoughts
    _qsa('.thoughtRepost-btn').forEach(btn => {
      btn.removeEventListener('click', () => _handleRepostWithThoughts(btn.dataset.postId));
      btn.addEventListener('click', () => {
        _handleRepostWithThoughts(btn.dataset.postId);
        const popup = document.getElementById(`repost-expanded-${btn.dataset.postId}`);
        if (popup) popup.style.display = 'none';
      });
    });

    // Share buttons
    _qsa('.share-btn').forEach(btn => {
      btn.removeEventListener('click', () => _handleShare(btn.dataset.postId));
      btn.addEventListener('click', () => _handleShare(btn.dataset.postId));
    });

    // Post menu (delete, edit)
    _qsa('.post-menu-btn').forEach(btn => {
      btn.removeEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        if (confirm('Delete this post?')) _handleDeletePost(postId);
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        if (confirm('Delete this post?')) _handleDeletePost(postId);
      });
    });
  }

  /* ── Infinite Scroll ───────────────────────────────────────── */
  function _initInfiniteScroll() {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.body.offsetHeight - 500;
      
      if (scrollPosition >= bottomPosition && !state.isLoading && state.hasMore) {
        loadFeed(false);
      }
    };
    
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
  }

  /* ── Refresh Feed (after new post) ─────────────────────────── */
  function refresh(revalidate = true) {
    state.paginate = revalidate ? 0 : state.paginate;
    loadFeed(revalidate);
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    // Set up comment modal listeners
    const modal = document.getElementById('commentModal');
    if (modal) {
      const closeBtn = _qs('.close-modal-btn', modal);
      const postBtn = _qs('.post-comment-btn', modal);
      const filterBtns = _qsa('.filter-btn', modal);
      
      closeBtn?.addEventListener('click', _closeCommentModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) _closeCommentModal();
      });
      postBtn?.addEventListener('click', _addComment);
      
      filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.commentSort = btn.dataset.filter;
          if (state.currentPostId) {
            await _loadComments(state.currentPostId);
          }
        });
      });
      
      const commentInput = _qs('.comment-input', modal);
      commentInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          _addComment();
        }
      });
    }
    
    // Close repost popups on outside click
    document.addEventListener('click', () => {
      _qsa('.repost-expanded').forEach(p => { p.style.display = 'none'; });
    });
    
    // Load initial feed
    loadFeed(true);
    
    // Setup infinite scroll
    _initInfiniteScroll();
    
    // Listen for new posts from CreatePost module
    window.addEventListener('postCreated', () => {
      refresh(true);
    });
  }

  /* ── Public API ────────────────────────────────────────────── */
  return { 
    init, 
    refresh, 
    loadFeed,
    getPosts: () => state.posts 
  };

})();

export default Feed;