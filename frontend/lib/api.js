const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Clean the base URL by stripping any trailing slashes to prevent duplicate slashes
const cleanBase = BASE.replace(/\/+$/, '');

async function apiFetch(path, options = {}) {
  // Safely extract token from window storage environment
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure the requested endpoint starts with a single slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const res = await fetch(`${cleanBase}${cleanPath}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API error');
  }
  return data;
}

export const api = {
  login: (password) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  getJobs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiFetch(`/api/jobs${qs ? '?' + qs : ''}`);
  },
  getJob: (id) => apiFetch(`/api/jobs/${id}`),
  createJob: (body) => apiFetch('/api/jobs', { method: 'POST', body: JSON.stringify(body) }),
  updateStatus: (id, status) => apiFetch(`/api/jobs/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateJob: (id, body) => apiFetch(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteJob: (id) => apiFetch(`/api/jobs/${id}`, { method: 'DELETE' }),
};