// SUBTAB (icons-only on small; labels visible from sm+)
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export type SubTab = { href: string; label: string; icon: LucideIcon };

export function SubTabBar({ subTabs = [] }: { subTabs: SubTab[] }) {
  const pathname = usePathname();
  if (!subTabs.length) return null;

  return (
    <div
      className="sticky z-40 bg-white/80 backdrop-blur border-b border-slate-200"
      style={{ top: "var(--main-nav-h,56px)" }} // sits right under main nav
      role="navigation"
      aria-label="Section navigation"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-2">
        <nav className="flex items-center gap-1">
          {subTabs.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                aria-label={label}
                className={[
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
