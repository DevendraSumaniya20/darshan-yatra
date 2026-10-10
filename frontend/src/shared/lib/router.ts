import { useSyncExternalStore } from 'react';

/*
 * A small History API router. The site has three routes; a routing library
 * would be more code to load than this file.
 */

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

function currentUrl(): string {
  return window.location.pathname + window.location.search + window.location.hash;
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  if (to === currentUrl()) return;
  if (options.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  for (const listener of listeners) listener();
}

export type Location = { pathname: string; search: string; hash: string };

export function useLocation(): Location {
  const url = useSyncExternalStore(subscribe, currentUrl);
  const parsed = new URL(url, window.location.origin);
  return { pathname: parsed.pathname, search: parsed.search, hash: parsed.hash };
}

/** Matches `/yatras/:slug` style patterns. Returns the captured params, or null. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (const [index, part] of patternParts.entries()) {
    const value = pathParts[index];
    if (value === undefined) return null;
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(value);
    else if (part !== value) return null;
  }
  return params;
}
