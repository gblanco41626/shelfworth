// components/NavShell.tsx
'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { ToastProvider } from '@/hooks/use-toast';

import { SubTabBar } from './subtab-bar';
import { IconButton } from './tokens';

import type { SubTab } from './subtab-bar';

type Tab = { href: string; label: string };

function NavLinks({
  tabs,
  onNavigate,
  orientation = 'horizontal',
}: {
  tabs: Tab[];
  onNavigate?: () => void;
  orientation?: 'horizontal' | 'vertical';
}) {
  const pathname = usePathname();
  return (
    <nav
      className={
        orientation === 'horizontal'
          ? 'flex items-center gap-1'
          : 'flex flex-col gap-1'
      }
    >
      {tabs.map(({ href, label }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavShell({
  children,
  subTabs = [],
}: {
  children: React.ReactNode;
  /** optional sub-tabs; pass [] if none */
  subTabs?: SubTab[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // measure the visible header and store height in a CSS var
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () =>
      document.documentElement.style.setProperty(
        '--main-nav-h',
        `${el.offsetHeight}px`,
      );

    apply(); // initial
    const ro = new ResizeObserver(apply);
    ro.observe(el);

    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const mainTabs: Tab[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        {/* ONE sticky header for both mobile + desktop layouts */}
        <header
          ref={headerRef}
          className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200"
        >
          {/* mobile bar */}
          <div className="lg:hidden mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
            <button
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                <span className="text-lg font-bold">S</span>
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Shelfworth</p>
                <p className="text-xs text-slate-500">Pantry Admin</p>
              </div>
            </div>
            <div className="w-10" />
          </div>

          {/* desktop top nav */}
          <div className="hidden lg:flex mx-auto px-6 py-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                <span className="text-lg font-bold">S</span>
              </span>
              <span className="text-sm font-semibold">Shelfworth</span>
              <NavLinks tabs={mainTabs} orientation="horizontal" />
            </div>
            <div className="flex items-center gap-2" />
            <IconButton.Logout onClick={() => signOut({ callbackUrl: '/' })} />
          </div>
        </header>

        {/* optional SUBTAB sticky bar; appears only when subTabs provided */}
        {subTabs.length > 0 && (
          <SubTabBar subTabs={subTabs}/>
        )}

        {/* mobile drawer */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform bg-white shadow-xl ring-1 ring-slate-200 transition-transform duration-200 data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full
                        flex flex-col"
              data-state={open ? 'open' : 'closed'}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                    <span className="text-lg font-bold">S</span>
                  </span>
                  <span className="text-sm font-semibold">Shelfworth</span>
                </div>
                <button
                  aria-label="Close navigation"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* content scrolls, takes remaining height */}
              <div className="p-4 flex-1 overflow-y-auto">
                <NavLinks tabs={mainTabs} orientation="vertical" onNavigate={() => setOpen(false)} />
                {subTabs.length > 0 && (
                  <>
                    <div className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Section
                    </div>
                    <NavLinks tabs={subTabs} orientation="vertical" onNavigate={() => setOpen(false)} />
                  </>
                )}
              </div>

              {/* footer pinned to bottom, logout aligned right */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex justify-end">
                  <IconButton.Logout onClick={() => signOut({ callbackUrl: '/' })} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* content */}
        <main className="mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
