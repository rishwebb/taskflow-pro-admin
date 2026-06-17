import { API_BASE_URL, STORAGE_KEYS } from '../lib/config';
import type { ApiErrorEnvelope, ApiEnvelope } from '../types/api';

export class ApiError extends Error {
  status: number;
  details?: ApiErrorEnvelope['errors'];

  constructor(status: number, message: string, details?: ApiErrorEnvelope['errors']) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

const getToken = () => localStorage.getItem(STORAGE_KEYS.token);

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.message || `Request failed with status ${response.status}`,
      payload?.errors
    );
  }

  return payload as T;
};

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    if (options.auth !== false) {
      const token = getToken();
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    return parseResponse<T>(response);
  },

  async get<T>(path: string, auth = true) {
    return this.request<ApiEnvelope<T>>(path, { method: 'GET', auth });
  },

  async post<T>(path: string, body?: unknown, auth = true) {
    return this.request<ApiEnvelope<T>>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      auth
    });
  },

  async patch<T>(path: string, body?: unknown, auth = true) {
    return this.request<ApiEnvelope<T>>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      auth
    });
  },

  async delete<T>(path: string, auth = true) {
    return this.request<ApiEnvelope<T>>(path, { method: 'DELETE', auth });
  }
};
