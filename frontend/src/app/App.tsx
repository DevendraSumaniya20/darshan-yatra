import { useEffect, type ReactNode } from 'react';
import { matchPath, useLocation } from '../shared/lib/router';
import { jumpToTop, scrollToElement, useSmoothScroll } from '../shared/motion/smoothScroll';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { YatraDetailPage } from './pages/YatraDetailPage';
import { YatrasPage } from './pages/YatrasPage';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

function resolvePage(pathname: string): ReactNode {
  if (pathname === '/') return <HomePage />;
  if (pathname === '/yatras' || pathname === '/yatras/') return <YatrasPage />;

  const detail = matchPath('/yatras/:slug', pathname);
  // The key resets the chosen departure when moving between yatras.
  if (detail?.slug) return <YatraDetailPage key={detail.slug} slug={detail.slug} />;

  return <NotFoundPage />;
}

export function App() {
  const { pathname, hash } = useLocation();
  useSmoothScroll();

  // On a new page, start at the top and move keyboard focus to the content,
  // unless the address points at a section.
  useEffect(() => {
    if (hash) return;
    jumpToTop();
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  useEffect(() => {
    if (!hash) return;
    // Sections can render after data loads; try again on the next frame.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      if (target) scrollToElement(target);
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
