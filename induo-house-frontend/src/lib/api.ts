export const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
export const API_BASE = `${API_ORIGIN}/api`;

type RequestOptions = RequestInit & {
  json?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const init: RequestInit = {
    ...options,
    credentials: 'include',
    headers,
  };

  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(options.json);
  }

  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      // Response is not JSON.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function assetUrl(path?: string | null) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
