import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user;
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; isPublic?: boolean }) => {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },
};

// ─── Entries ─────────────────────────────────────────────────────────────────

export const entriesApi = {
  getAll: async (params: Record<string, unknown> = {}) => {
    const res = await api.get('/entries', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/entries/${id}`);
    return res.data;
  },
  create: async (data: Record<string, unknown>) => {
    const res = await api.post('/entries', data);
    return res.data;
  },
  update: async (id: string, data: Record<string, unknown>) => {
    const res = await api.put(`/entries/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/entries/${id}`);
    return res.data;
  },
  getTags: async () => {
    const res = await api.get('/entries/tags');
    return res.data;
  },
};
