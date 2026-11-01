import { useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, type Location, NavLink, useLocation } from 'react-router';
import { ThemeToggle } from '@/components/theme-toggle';
import { driftSpiral, gsap, jumpToTop, useMotion, useSmoothScroll } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { studio } from '@/lib/studio';

const nav = [
  { to: '/work', label: 'Work' },
  { to: '/studio', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Routes render from `shown`, not from the live location, so the old page stays on screen until
 * the curtain covers it. Only a change of path gets the curtain: filters change the query string.
 */
export function Layout({ children }: { children: (location: Location) => ReactNode }) {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(location);
  const curtain = useRef<HTMLDivElement>(null);
  const covered = useRef(false);
  const spiral = useRef<HTMLDivElement>(null);

  if (location.key !== shown.key && (reducedMotion || location.pathname === shown.pathname)) {
    setShown(location);
  }

  useSmoothScroll();
  useMotion(spiral, driftSpiral);

  useLayoutEffect(() => {
    gsap.set(curtain.current, { yPercent: 100 });
  }, []);

  useEffect(() => {
    if (location.pathname === shown.pathname) return;
    const tween = gsap.to(curtain.current, {
      yPercent: 0,
      visibility: 'visible',
      duration: 0.5,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => {
        covered.current = true;
        setShown(location);
      },
    });
    return () => {
      tween.kill();
    };
  }, [location, shown.pathname]);

  useLayoutEffect(() => {
    jumpToTop();
    if (!covered.current) return;
    covered.current = false;
    const element = curtain.current;
    gsap.to(element, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
      overwrite: true,
      onComplete: () => {
        gsap.set(element, { yPercent: 100, visibility: 'hidden' });
      },
    });
  }, [shown.pathname]);

  const overHero = shown.pathname === '/';

  return (
    <div className="relative isolate flex min-h-svh flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div ref={spiral} className="spiral" />
      </div>

      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-50 bg-accent"
      />

      <header
        className={cn(
          'gutter z-20 flex items-center justify-between py-3 md:py-5',
          overHero ? 'absolute inset-x-0 top-0 text-paper' : 'relative',
        )}
      >
        <Link to="/" className="display text-xl tracking-tight md:text-2xl">
          Northwind
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 md:gap-8">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn('label py-3 text-[0.9375rem] transition-colors hover:text-accent', isActive && 'text-accent')
              }
            >
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </header>

      <main key={shown.pathname} className="flex-1">
        {children(shown)}
      </main>

      <footer className="gutter grid gap-4 border-t border-border/40 py-6 md:grid-cols-12">
        <p className="label m-0 md:col-span-3">Northwind Design Studio</p>
        <address className="label not-italic text-muted-foreground md:col-span-4">
          {studio.address.join(', ')}
        </address>
        <p className="label m-0 text-muted-foreground md:col-span-5 md:text-right">
          Northwind Design Studio is a fictional company built for a DevOps training project.
        </p>
      </footer>
    </div>
  );
}
