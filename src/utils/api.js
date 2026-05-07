// API Base URL - gunakan env variable atau fallback ke Vercel production
const API_BASE = import.meta.env.VITE_API_URL || 'https://scout-moniergrad.vercel.app';

// Helper untuk get token dari localStorage
const getToken = () => localStorage.getItem('cms_token');

// Helper untuk headers dengan auth
const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: authHeaders(),
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ============================================
// AUTH
// ============================================
export const authAPI = {
  login: (username, password) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => apiFetch('/api/auth/me'),
  setup: (data) =>
    apiFetch('/api/auth/setup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// HERO
// ============================================
export const heroAPI = {
  getAll: () => apiFetch('/api/hero'),
  getAllAdmin: () => apiFetch('/api/hero/all'),
  getById: (id) => apiFetch(`/api/hero/${id}`),
  create: (data) => apiFetch('/api/hero', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/hero/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/hero/${id}`, { method: 'DELETE' }),
};

// ============================================
// ABOUT
// ============================================
export const aboutAPI = {
  get: () => apiFetch('/api/about'),
  update: (data) => apiFetch('/api/about', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// STATS
// ============================================
export const statsAPI = {
  getBySection: (section) => apiFetch(`/api/stats?section=${section}`),
  getAll: () => apiFetch('/api/stats/all'),
  create: (data) => apiFetch('/api/stats', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/stats/${id}`, { method: 'DELETE' }),
};

// ============================================
// ANGKATAN
// ============================================
export const angkatanAPI = {
  getAll: () => apiFetch('/api/angkatan'),
  getAllAdmin: () => apiFetch('/api/angkatan/all'),
  getById: (id) => apiFetch(`/api/angkatan/${id}`),
  create: (data) => apiFetch('/api/angkatan', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/angkatan/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/angkatan/${id}`, { method: 'DELETE' }),
  // Members
  getMembers: (angkatanId) => apiFetch(`/api/angkatan/${angkatanId}/members`),
  addMember: (angkatanId, data) =>
    apiFetch(`/api/angkatan/${angkatanId}/members`, { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (memberId, data) =>
    apiFetch(`/api/members/${memberId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (memberId) => apiFetch(`/api/members/${memberId}`, { method: 'DELETE' }),
};

// ============================================
// STRUKTUR
// ============================================
export const strukturAPI = {
  getAll: () => apiFetch('/api/struktur'),
  getAllAdmin: () => apiFetch('/api/struktur/all'),
  getById: (id) => apiFetch(`/api/struktur/${id}`),
  create: (data) => apiFetch('/api/struktur', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/struktur/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/struktur/${id}`, { method: 'DELETE' }),
};

// ============================================
// PURNA
// ============================================
export const purnaAPI = {
  getAll: () => apiFetch('/api/purna'),
  getAllAdmin: () => apiFetch('/api/purna/all'),
  getById: (id) => apiFetch(`/api/purna/${id}`),
  create: (data) => apiFetch('/api/purna', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/purna/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/purna/${id}`, { method: 'DELETE' }),
};

// ============================================
// PROGRAM
// ============================================
export const programAPI = {
  getAll: () => apiFetch('/api/program'),
  getAllAdmin: () => apiFetch('/api/program/all'),
  getById: (id) => apiFetch(`/api/program/${id}`),
  create: (data) => apiFetch('/api/program', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/program/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/api/program/${id}`, { method: 'DELETE' }),
};

// ============================================
// FOOTER
// ============================================
export const footerAPI = {
  get: () => apiFetch('/api/footer'),
  update: (data) => apiFetch('/api/footer', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// SETTINGS
// ============================================
export const settingsAPI = {
  get: () => apiFetch('/api/settings'),
  update: (data) => apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// CTA
// ============================================
export const ctaAPI = {
  get: () => apiFetch('/api/cta'),
  update: (data) => apiFetch('/api/cta', { method: 'PUT', body: JSON.stringify(data) }),
};

// ============================================
// UPLOAD
// ============================================
export const uploadAPI = {
  upload: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getToken();
    if (!token) throw new Error('Tidak ada token. Silakan login ulang.');

    const res = await fetch(`${API_BASE}/api/upload?folder=${folder}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    if (!res.ok) throw new Error(data.error || `Upload gagal (${res.status})`);
    return data;
  },
};
