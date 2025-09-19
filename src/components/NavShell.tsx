"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const item = (href: string, label: string) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={[
          "block rounded-lg px-3 py-2 text-sm font-medium",
          active
            ? "bg-sky-50 text-sky-700"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="space-y-1">
      {item("/dashboard", "Dashboard")}
      {item("/admin", "Admin")}
    </nav>
  );
}

export default function NavShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  return (
    <div className="min-h-screen">
      {/* Top bar (mobile) */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
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
          <div className="w-10" /> {/* spacer */}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
          <div className="px-4 py-5 border-b border-slate-200">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white font-bold shadow-sm">
              S
            </span>
            <h1 className="mt-3 text-lg font-semibold">Shelfworth</h1>
          </div>
          <div className="p-4">
            <NavLinks />
          </div>
        </aside>

        {/* Drawer (mobile) */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div
              ref={drawerRef}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform bg-white shadow-xl ring-1 ring-slate-200 transition-transform duration-200 data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full"
              data-state={open ? "open" : "closed"}
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
              <div className="p-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
