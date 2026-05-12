/**
 * ARCHIVEHUBS — API Abstraction Layer (Fixed)
 * /js/api.js
 */

const BASE_URL = 'http://localhost:3000';

async function _req(method, path, body = null, isFormData = false) {
  const opts = { 
    method, 
    credentials: 'include',  // Critical for session cookies
  };
  
  if (!isFormData) {
    opts.headers = { 'Content-Type': 'application/json' };
    if (body) opts.body = JSON.stringify(body);
  } else {
    opts.body = body;
  }

  const res = await fetch(`${BASE_URL}${path}`, opts);
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  
  return res.json();
}

const _get = (p) => _req('GET', p);
const _post = (p, b, isFormData = false) => _req('POST', p, b, isFormData);
const _patch = (p, b) => _req('PATCH', p, b);
const _delete = (p) => _req('DELETE', p);

/* ================================================================
   AUTH
   ================================================================ */
export const auth = {
  login: (email, password) => _post('/auth/login', { email, password }),
  logout: () => _post('/auth/logout'),
  getMe: () => _get('/auth/me'),
};

/* ================================================================
   FEED / POSTS
   ================================================================ */
export const feed = {
  getPosts: (paginate = 0, revalidate = false) => 
    _get(`/feed?paginate=${paginate}&revalidate=${revalidate}`),

  createPost: (formData) => 
    _post('/post/create', formData, true),  // multipart form data

  toggleLike: (postId) => 
    _post(`/post/${postId}/like`),

  unlike: (postId) => 
    _post(`/post/${postId}/unlike`),

  repost: (postId, thoughts = null) => 
    _post('/post/repost', { postId, thoughts }),

  deletePost: (postId) => 
    _post('/post/delete', { postId }),
};

/* ================================================================
   COMMENTS & REPLIES
   ================================================================ */
export const comments = {
  addComment: (postId, comment) => 
    _post('/post/comment', { postId, comment }),

  replyToComment: (commentId, reply) => 
    _post(`/post/${commentId}/reply-to-comment`, { reply }),
};

/* ================================================================
   CONNECTIONS
   ================================================================ */
export const connections = {
  getAddToYourConnections: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_aty_connections?paginate=${paginate}&revalidate=${revalidate}`),

  getActivityRecommendations: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_acr_connections?paginate=${paginate}&revalidate=${revalidate}`),

  getRoleRecommendations: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_rcr_connections?paginate=${paginate}&revalidate=${revalidate}`),

  getPopularRecommendations: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_pcr_connections?paginate=${paginate}&revalidate=${revalidate}`),

  getBusinessRecommendations: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_bcr_connections?paginate=${paginate}&revalidate=${revalidate}`),

  getConnections: (paginate = 0, revalidate = false) => 
    _get(`/connection/get_connections?paginate=${paginate}&revalidate=${revalidate}`),

  connectionRequest: (requestUserId) => 
    _post('/connection/connection_request', { requestUserId }),

  acceptRequest: (requesterUserId) => 
    _post('/connection/accept_connection_request', { requesterUserId }),

  rejectRequest: (requesterUserId) => 
    _post('/connection/reject_connection_request', { requesterUserId }),
};

/* ================================================================
   SEARCH
   ================================================================ */
export const search = {
  searchActivity: (searchTerm) => 
    _post('/search/search_activity', { searchTerm }),
};

export default { auth, feed, comments, connections, search };