import { useEffect, type ReactNode } from 'react';
import { matchPath, useLocation } from '../shared/lib/router';
import { NotFoundPage } from './pages/NotFoundPage';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

function resolvePage(pathname: string): ReactNode {
  void matchPath;
  void pathname;
  return <NotFoundPage />;
}

export function App() {
  const { pathname, hash } = useLocation();

  // On a new page, start at the top and move keyboard focus to the content,
  // unless the address points at a section.
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    // Sections can render after data loads; try again on the next frame.
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        {resolvePage(pathname)}
      </main>
      <SiteFooter />
    </>
  );
}
