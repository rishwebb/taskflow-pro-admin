import { STORAGE_KEYS } from '../lib/config';
import { apiClient } from './apiClient';
import type { LoginResponse, User } from '../types/api';

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', { email, password }, false);
    const token = response.data.accessToken || response.data.token;

    if (!token) {
      throw new Error('Login response did not include an access token');
    }

    if (response.data.user.role !== 'admin') {
      throw new Error('This account does not have admin access');
    }

    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data.user));

    return response.data;
  },

  async me() {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');

    if (response.data.user.role !== 'admin') {
      this.logout();
      throw new Error('This account does not have admin access');
    }

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.data.user));
    return response.data.user;
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (_error) {
      // JWT logout is client-side; the server call is best effort.
    } finally {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch (_error) {
      localStorage.removeItem(STORAGE_KEYS.user);
      return null;
    }
  },

  hasToken() {
    return Boolean(localStorage.getItem(STORAGE_KEYS.token));
  }
};
