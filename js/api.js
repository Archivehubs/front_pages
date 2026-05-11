/**
 * ARCHIVEHUBS — API Abstraction Layer
 * /js/api.js
 *
 * Single source of truth for ALL data fetching.
 * Modules never call fetch() directly — they call functions here.
 *
 * Current state (Phase 4):
 *   Every function returns hardcoded data wrapped in a resolved Promise,
 *   so all module code already works with async/await as if it were real.
 *
 * Phase 5 migration:
 *   Replace each stub body with the commented-out fetch() call above it.
 *   Auth token injection and error handling are already structured here
 *   so modules need zero changes when the real API lands.
 *
 * Usage in modules:
 *   import API from '../api.js';
 *   const { posts } = await API.feed.getPosts();
 */

/* ── Config ──────────────────────────────────────────────────── */

const BASE_URL = '/api';
let _authToken = null;

export function setAuthToken(token)  { _authToken = token; }
export function clearAuthToken()     { _authToken = null;  }

/* ── Request helper ──────────────────────────────────────────── */

async function _req(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (_authToken) headers['Authorization'] = `Bearer ${_authToken}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

const _get    = p       => _req('GET',    p);
const _post   = (p, b)  => _req('POST',   p, b);
const _patch  = (p, b)  => _req('PATCH',  p, b);
const _delete = p       => _req('DELETE', p);

/* ================================================================
   AUTH
   ================================================================ */
export const auth = {

  /** POST /api/auth/login → { user, token } */
  login: (email, password) =>
    // _post('/auth/login', { email, password }),
    Promise.resolve({ token: 'stub-jwt', user: { id: 1, name: 'John Doe', email, avatar: 'images/profile.jpg' } }),

  /** POST /api/auth/logout */
  logout: () => {
    // return _post('/auth/logout');
    clearAuthToken();
    return Promise.resolve({ success: true });
  },

  /** GET /api/auth/me → { user } */
  getMe: () =>
    // _get('/auth/me'),
    Promise.resolve({ user: { id: 1, name: 'John Doe', avatar: 'images/profile.jpg', location: 'Lagos, Nigeria' } }),

};

/* ================================================================
   FEED / POSTS
   ================================================================ */

const _stubPosts = [
  { id: 1, authorName: 'Sarah Johnson', authorRole: 'Software Engineer at Tech Corp', avatar: 'images/profile.jpg', time: '2h ago', text: 'Just finished implementing a new AI feature! #Programming #AI #Innovation', image: 'images/post-example.jpg',  likes: 142, comments: 28, isLiked: false },
  { id: 2, authorName: 'Michael Chen',  authorRole: 'Product Manager at ArchiveHubs',  avatar: 'images/profile.jpg', time: '4h ago', text: 'Excited to announce the new ArchiveHubs platform! 🚀 #ArchiveHubs #Innovation',   image: null,                      likes: 89,  comments: 15, isLiked: false },
];

export const feed = {

  /** GET /api/feed?page&limit → { posts, nextPage } */
  getPosts: (page = 1, limit = 10) =>
    // _get(`/feed?page=${page}&limit=${limit}`),
    Promise.resolve({ posts: _stubPosts, nextPage: null }),

  /** POST /api/posts → { post } */
  createPost: async (payload) => {
    // return _post('/posts', payload);
    const p = { id: Date.now(), authorName: 'John Doe', authorRole: 'Your Role', avatar: 'images/profile.jpg', time: 'Just now', text: payload.text, image: null, likes: 0, comments: 0, isLiked: false };
    _stubPosts.unshift(p);
    return { post: p };
  },

  /** POST /api/posts/:id/like  or  DELETE /api/posts/:id/like */
  toggleLike: (postId, currently_liked) => {
    // return currently_liked ? _delete(`/posts/${postId}/like`) : _post(`/posts/${postId}/like`);
    const p = _stubPosts.find(x => x.id === Number(postId));
    if (p) { p.isLiked = !p.isLiked; p.likes += p.isLiked ? 1 : -1; }
    return Promise.resolve({ success: true });
  },

  /** POST /api/posts/:id/repost */
  repost: (postId, thoughts = null) =>
    // _post(`/posts/${postId}/repost`, { thoughts }),
    Promise.resolve({ success: true }),

  /** DELETE /api/posts/:id */
  deletePost: (postId) => {
    // return _delete(`/posts/${postId}`);
    const i = _stubPosts.findIndex(x => x.id === Number(postId));
    if (i > -1) _stubPosts.splice(i, 1);
    return Promise.resolve({ success: true });
  },

};

/* ================================================================
   COMMENTS
   ================================================================ */

const _stubComments = {
  1: [
    { id: 1,  authorName: 'Alex Rodriguez', avatar: 'images/profile.jpg', text: "Really interesting! Working on similar AI implementations.",  time: '2 hours ago',   likes: 12, isLiked: false },
    { id: 2,  authorName: 'Maria Garcia',   avatar: 'images/profile.jpg', text: 'Great insights! AI is transforming development.',              time: '1 hour ago',    likes: 8,  isLiked: false },
    { id: 3,  authorName: 'David Kim',      avatar: 'images/profile.jpg', text: 'The possibilities with machine learning are endless.',         time: '45 minutes ago',likes: 15, isLiked: false },
    { id: 4,  authorName: 'Sarah Wilson',   avatar: 'images/profile.jpg', text: 'What framework are you using?',                                time: '30 minutes ago',likes: 6,  isLiked: false },
    { id: 5,  authorName: 'Mike Johnson',   avatar: 'images/profile.jpg', text: 'Reminds me of a project I did last year!',                    time: '15 minutes ago',likes: 4,  isLiked: false },
  ],
  2: [
    { id: 6,  authorName: 'Jennifer Lee',   avatar: 'images/profile.jpg', text: "This platform looks amazing! Can't wait to try it.",           time: '3 hours ago',   likes: 18, isLiked: false },
    { id: 7,  authorName: 'Robert Chen',    avatar: 'images/profile.jpg', text: 'Finally, a digital asset management solution!',                time: '2 hours ago',   likes: 14, isLiked: false },
    { id: 8,  authorName: 'Amanda Foster',  avatar: 'images/profile.jpg', text: 'The interface looks clean and professional.',                   time: '1 hour ago',    likes: 9,  isLiked: false },
    { id: 9,  authorName: 'Carlos Mendez',  avatar: 'images/profile.jpg', text: 'How does this compare to other solutions?',                    time: '45 minutes ago',likes: 7,  isLiked: false },
    { id: 10, authorName: 'Lisa Thompson',  avatar: 'images/profile.jpg', text: 'This will revolutionise how we handle archives!',              time: '20 minutes ago',likes: 11, isLiked: false },
  ],
};

export const comments = {

  /** GET /api/posts/:id/comments?sort → { comments } */
  getComments: (postId, sort = 'relevant') => {
    // return _get(`/posts/${postId}/comments?sort=${sort}`);
    const data = [...(_stubComments[postId] || _stubComments[1])];
    if (sort === 'relevant') data.sort((a, b) => b.likes - a.likes);
    if (sort === 'newest')   data.reverse();
    return Promise.resolve({ comments: data });
  },

  /** POST /api/posts/:id/comments → { comment } */
  addComment: (postId, text) => {
    // return _post(`/posts/${postId}/comments`, { text });
    const c = { id: Date.now(), authorName: 'John Doe', avatar: 'images/profile.jpg', text, time: 'Just now', likes: 0, isLiked: false };
    if (!_stubComments[postId]) _stubComments[postId] = [];
    _stubComments[postId].unshift(c);
    return Promise.resolve({ comment: c });
  },

  /** POST/DELETE /api/comments/:id/like */
  toggleLike: (commentId, isLiked) =>
    // isLiked ? _delete(`/comments/${commentId}/like`) : _post(`/comments/${commentId}/like`),
    Promise.resolve({ success: true }),

  /** DELETE /api/comments/:id */
  deleteComment: (commentId) =>
    // _delete(`/comments/${commentId}`),
    Promise.resolve({ success: true }),

};

/* ================================================================
   CONNECTIONS
   ================================================================ */

const _stubPeople = [
  { id: 'u1', name: 'Sarah Johnson',   role: 'Software Engineer at Tech Corp', avatar: 'images/profile.jpg', initial: 'S', mutualCount: 3 },
  { id: 'u2', name: 'Michael Chen',    role: 'Product Manager at ArchiveHubs', avatar: 'images/profile.jpg', initial: 'M', mutualCount: 5 },
  { id: 'u3', name: 'David Kim',       role: 'AI Researcher at OpenAI',        avatar: 'images/profile.jpg', initial: 'D', mutualCount: 2 },
  { id: 'u4', name: 'Emma Watson',     role: 'UI/UX Designer at Apple',        avatar: 'images/profile.jpg', initial: 'E', mutualCount: 7 },
  { id: 'u5', name: 'James Rodriguez', role: 'Backend Dev at Microsoft',       avatar: 'images/profile.jpg', initial: 'J', mutualCount: 1 },
  { id: 'u6', name: 'Lisa Thompson',   role: 'Data Scientist at Google',       avatar: 'images/profile.jpg', initial: 'L', mutualCount: 4 },
];

export const connections = {

  getSuggestions: (limit = 10) =>
    // _get(`/connections/suggestions?limit=${limit}`),
    Promise.resolve({ suggestions: _stubPeople.slice(0, limit) }),

  getRequests: () =>
    // _get('/connections/requests'),
    Promise.resolve({ requests: _stubPeople.slice(0, 3) }),

  connect:    (userId) => Promise.resolve({ success: true }), // _post(`/connections/${userId}`)
  disconnect: (userId) => Promise.resolve({ success: true }), // _delete(`/connections/${userId}`)
  accept:     (userId) => Promise.resolve({ success: true }), // _post(`/connections/${userId}/accept`)
  decline:    (userId) => Promise.resolve({ success: true }), // _post(`/connections/${userId}/decline`)

  searchUsers: (query) => {
    // return _get(`/users/search?q=${encodeURIComponent(query)}`);
    const q = query.toLowerCase();
    return Promise.resolve({ users: _stubPeople.filter(u => u.name.toLowerCase().includes(q)) });
  },

};

/* ================================================================
   MESSAGING
   ================================================================ */

export const messaging = {

  getConversations: () =>
    // _get('/conversations'),
    Promise.resolve({
      focused: [
        { id: 'chat1', name: 'John Doe',      avatar: 'images/profile.jpg', preview: 'Hey, how are you?',     timestamp: '2025-07-28T10:00:00Z', unread: 0 },
        { id: 'chat2', name: 'Jane Smith',    avatar: 'images/profile.jpg', preview: "Let's catch up soon!",  timestamp: '2025-07-28T09:30:00Z', unread: 2 },
      ],
      others: [
        { id: 'chat3', name: 'Alice Johnson', avatar: 'images/profile.jpg', preview: 'Are we still on?',      timestamp: '2025-07-27T10:00:00Z', unread: 0 },
        { id: 'chat4', name: 'Bob Brown',     avatar: 'images/profile.jpg', preview: 'Can you send files?',   timestamp: '2025-07-26T09:00:00Z', unread: 1 },
      ],
    }),

  getMessages:   (convId, cursor, limit) => Promise.resolve({ messages: [], nextCursor: null }),
  // _get(`/conversations/${convId}/messages${cursor ? `?before=${cursor}&limit=${limit}` : `?limit=${limit}`}`),

  sendMessage:   (convId, content) => Promise.resolve({ message: { id: Date.now(), content, isSent: true, timestamp: new Date().toISOString() } }),
  // _post(`/conversations/${convId}/messages`, { content }),

  deleteMessage: (msgId)  => Promise.resolve({ success: true }),  // _delete(`/messages/${msgId}`)
  startConvo:    (userId) => Promise.resolve({ conversation: { id: `chat_${userId}` } }), // _post('/conversations', { userId })

};

/* ================================================================
   STORIES
   ================================================================ */

export const stories = {
  getStories:   ()        => Promise.resolve({ stories: [] }),  // _get('/stories')
  createStory:  (payload) => Promise.resolve({ story: { id: Date.now(), ...payload, timestamp: new Date().toISOString() } }), // _post('/stories', payload)
  deleteStory:  (id)      => Promise.resolve({ success: true }), // _delete(`/stories/${id}`)
};

/* ================================================================
   PROFILE
   ================================================================ */

export const profile = {
  getProfile:    (userId) => Promise.resolve({ profile: { id: userId, name: 'John Doe', avatar: 'images/profile.jpg', location: 'Lagos, Nigeria' } }),
  // _get(`/users/${userId}/profile`),

  updateProfile: (userId, data) => Promise.resolve({ success: true }),
  // _patch(`/users/${userId}/profile`, data),
};

/* ================================================================
   SEARCH
   ================================================================ */

export const search = {
  search: (query, type = 'all') => Promise.resolve({ posts: [], people: [], pages: [] }),
  // _get(`/search?q=${encodeURIComponent(query)}&type=${type}`),
};

/* ================================================================
   NOTIFICATIONS
   ================================================================ */

export const notifications = {
  getAll:     (limit = 20) => Promise.resolve({ notifications: [], unreadCount: 0 }),
  // _get(`/notifications?limit=${limit}`),

  markAllRead: () => Promise.resolve({ success: true }),
  // _post('/notifications/read-all'),
};

/* ── Default export (namespace) ───────────────────────────────── */

const API = { setAuthToken, clearAuthToken, auth, feed, comments, connections, messaging, stories, profile, search, notifications };
export default API;