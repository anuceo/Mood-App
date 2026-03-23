/**
 * Mood API Service
 *
 * Centralised fetch wrapper. All requests go through `request()` which:
 *   - Prepends the base URL
 *   - Injects the Authorization header when a token is available
 *   - Throws a structured ApiError on non-2xx responses
 */

// Swap for your deployed URL in production
const BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://api.moodapp.io/api';

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors ?? [];
  }
}

let _token = null;
let _onUnauthorized = null;

/** Called by AppContext after login/signup to inject the token. */
export const setAuthToken = (token) => {
  _token = token;
};

/** Called on logout to clear the token. */
export const clearAuthToken = () => {
  _token = null;
};

/**
 * Register a callback that fires when any request receives a 401.
 * AppContext uses this to auto-logout on expired/invalid tokens.
 */
export const setUnauthorizedHandler = (handler) => {
  _onUnauthorized = handler;
};

const request = async (method, path, body = null, extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && _onUnauthorized) {
      _onUnauthorized();
    }
    throw new ApiError(data.message ?? 'Request failed', res.status, data.errors);
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (handle, email, password, primaryMood = null) =>
    request('POST', '/auth/signup', { handle, email, password, ...(primaryMood && { primaryMood }) }),

  login: (email, password) =>
    request('POST', '/auth/login', { email, password }),

  getMe: () =>
    request('GET', '/auth/me'),

  updateMe: (updates) =>
    request('PATCH', '/auth/me', updates),
};

// ─── Content ──────────────────────────────────────────────────────────────────

export const contentApi = {
  getFeed: ({ mood, page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (mood) params.set('mood', mood);
    return request('GET', `/content?${params}`);
  },

  getContent: (id) =>
    request('GET', `/content/${id}`),

  createContent: ({ videoUrl, thumbnailUrl, moodTags, caption, attributionUrl, isOriginal }) =>
    request('POST', '/content', { videoUrl, thumbnailUrl, moodTags, caption, attributionUrl, isOriginal }),

  deleteContent: (id) =>
    request('DELETE', `/content/${id}`),

  toggleResonate: (contentId, boardId = null) =>
    request('POST', `/content/${contentId}/resonate`, { boardId }),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const userApi = {
  getProfile: (handle) =>
    request('GET', `/users/${encodeURIComponent(handle)}`),

  getResonances: (handle, { page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    return request('GET', `/users/${encodeURIComponent(handle)}/resonances?${params}`);
  },
};

// ─── Boards ───────────────────────────────────────────────────────────────────

export const boardApi = {
  getMyBoards: () =>
    request('GET', '/boards'),

  getBoard: (id) =>
    request('GET', `/boards/${id}`),

  createBoard: ({ name, primaryMood, description, isPublic }) =>
    request('POST', '/boards', { name, primaryMood, description, isPublic }),

  updateBoard: (id, updates) =>
    request('PATCH', `/boards/${id}`, updates),

  deleteBoard: (id) =>
    request('DELETE', `/boards/${id}`),

  addContent: (boardId, contentId) =>
    request('POST', `/boards/${boardId}/content/${contentId}`),

  removeContent: (boardId, contentId) =>
    request('DELETE', `/boards/${boardId}/content/${contentId}`),
};

export { ApiError };
