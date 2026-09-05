const BASE = '/api';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldMessages: string[] = [],
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

interface ErrorBody {
  message?: string | string[];
}

async function toError(response: Response): Promise<HttpError> {
  const body = (await response.json().catch(() => null)) as ErrorBody | null;
  const raw = body?.message;
  const messages = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return new HttpError(
    response.status,
    messages[0] ?? 'Não foi possível concluir. Tente de novo.',
    messages,
  );
}

let refreshing: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  refreshing ??= fetch(`${BASE}/auth/refresh`, { method: 'POST', credentials: 'include' })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  retryOnUnauthorized?: boolean;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, retryOnUnauthorized = true } = options;

  const send = () =>
    fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  let response = await send();

  if (response.status === 401 && retryOnUnauthorized && (await refreshSession())) {
    response = await send();
  }

  if (!response.ok) throw await toError(response);
  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
