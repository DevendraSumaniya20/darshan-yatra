const API_BASE: string = import.meta.env.VITE_API_URL ?? '/api/v1';

type ErrorBody = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  /** Per-field messages when the server rejected a form. */
  readonly fields: Record<string, string>;

  constructor(code: string, message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export type Envelope<T, M = undefined> = { data: T; meta: M };

export async function request<T, M = undefined>(
  path: string,
  init: RequestInit = {},
): Promise<Envelope<T, M>> {
  let response: Response;
  try {
    response = await fetch(API_BASE + path, {
      ...init,
      headers: { Accept: 'application/json', ...init.headers },
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new ApiError(
      'NETWORK',
      'We could not reach the server. Check your connection and try again.',
      0,
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (body as ErrorBody | null)?.error;
    throw new ApiError(
      error?.code ?? 'UNKNOWN',
      error?.message ?? 'Something went wrong. Please try again.',
      response.status,
      toFieldMessages(error?.details),
    );
  }

  return body as Envelope<T, M>;
}

export function postJson<T>(path: string, payload: unknown): Promise<Envelope<T>> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

function toFieldMessages(details: unknown): Record<string, string> {
  if (!Array.isArray(details)) return {};
  const fields: Record<string, string> = {};
  for (const item of details) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'field' in item &&
      'message' in item &&
      typeof item.field === 'string' &&
      typeof item.message === 'string'
    ) {
      fields[item.field] ??= item.message;
    }
  }
  return fields;
}
