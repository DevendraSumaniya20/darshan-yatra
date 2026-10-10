import { useCallback, useEffect, useState } from 'react';
import { ApiError } from './http';

export type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'error'; data: null; error: ApiError }
  | { status: 'ready'; data: T; error: null };

type Stored<T> = { key: string; state: AsyncState<T> };

const LOADING = { status: 'loading', data: null, error: null } as const;

/**
 * Loads data for `key` and reloads when the key changes.
 * `load` may change identity between renders; only `key` decides when to fetch.
 */
export function useAsync<T>(
  key: string,
  load: (signal: AbortSignal) => Promise<T>,
): AsyncState<T> & { reload: () => void } {
  const [stored, setStored] = useState<Stored<T>>({ key, state: LOADING });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal).then(
      (data) => setStored({ key, state: { status: 'ready', data, error: null } }),
      (cause: unknown) => {
        if (controller.signal.aborted) return;
        const error =
          cause instanceof ApiError
            ? cause
            : new ApiError('UNKNOWN', 'Something went wrong. Please try again.', 0);
        setStored({ key, state: { status: 'error', data: null, error } });
      },
    );
    return () => controller.abort();
    // `load` is intentionally left out: callers pass inline functions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  // A result for a previous key is stale; show loading until the new one arrives.
  const state = stored.key === key ? stored.state : LOADING;
  return { ...state, reload };
}
