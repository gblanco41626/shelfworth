import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle, Loader2, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info" | "warning" | "loading";
type ToastPosition = "bottom-right" | "bottom" | "top-right" | "top";

export type ShowToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;          // ms; ignored for 'loading'
  position?: ToastPosition;   // defaults to 'bottom-right'
  id?: string;                // optional custom id to dedupe/update
};

type ToastItem = Required<ShowToastOptions> & { id: string };

type ToastContextValue = {
  show: (opts: ShowToastOptions) => string;
  hide: (id: string) => void;
  clear: () => void;
  success: (msg: string | Partial<ShowToastOptions>) => string;
  error: (msg: string | Partial<ShowToastOptions>) => string;
  info: (msg: string | Partial<ShowToastOptions>) => string;
  warning: (msg: string | Partial<ShowToastOptions>) => string;
  loading: (msg?: string | Partial<ShowToastOptions>) => string; // persists until hide()
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, { wrap: string; icon: React.ElementType }> = {
  success: { wrap: "bg-emerald-600 text-white", icon: CheckCircle2 },
  error:   { wrap: "bg-rose-600 text-white",    icon: XCircle },
  info:    { wrap: "bg-sky-600 text-white",     icon: Info },
  warning: { wrap: "bg-amber-600 text-white",   icon: AlertTriangle },
  loading: { wrap: "bg-neutral-800 text-white", icon: Loader2 },
};

function positionClass(pos: ToastPosition) {
  switch (pos) {
    case "top":         return "top-4 left-1/2 -translate-x-1/2";
    case "top-right":   return "top-4 right-4";
    case "bottom":      return "bottom-4 left-1/2 -translate-x-1/2";
    case "bottom-right":
    default:            return "bottom-4 right-4";
  }
}

function ToastCard({ t, onClose }: { t: ToastItem; onClose: (id: string) => void }) {
  const Icon = VARIANT_STYLES[t.variant].icon;

  useEffect(() => {
    if (t.variant === "loading") return;
    const id = window.setTimeout(() => onClose(t.id), t.duration);
    return () => window.clearTimeout(id);
  }, [t, onClose]);

  return (
    <div
      className={`group flex max-w-[92vw] sm:max-w-md items-start gap-3 rounded-2xl px-4 py-3 shadow-xl ring-1 ring-black/5 ${VARIANT_STYLES[t.variant].wrap} animate-toast-slide`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <Icon className={`mt-0.5 h-5 w-5 flex-none ${t.variant === "loading" ? "animate-spin" : ""}`} aria-hidden />
      <div className="min-w-0 flex-1">
        {t.title ? <div className="text-sm font-semibold leading-5 truncate">{t.title}</div> : null}
        {t.description ? <div className="text-sm/5 opacity-90 break-words">{t.description}</div> : null}
      </div>
      <button
        onClick={() => onClose(t.id)}
        className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full/95 bg-white/10 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((opts: ShowToastOptions) => {
    const id = opts.id ?? `t_${++idRef.current}`;
    setToasts((prev) => {
      // if same id exists, replace it (handy for upgrading loading -> success)
      const next: ToastItem = {
        id,
        title: opts.title ?? "",
        description: opts.description ?? "",
        variant: opts.variant ?? "success",
        duration: opts.duration ?? 3000,
        position: opts.position ?? "bottom-right",
      };
      const has = prev.some((p) => p.id === id);
      return has ? prev.map((p) => (p.id === id ? next : p)) : [...prev, next];
    });
    return id;
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  // sugar helpers
  const mk = useCallback(
    (variant: ToastVariant, input: string | Partial<ShowToastOptions>) => {
      const base: Partial<ShowToastOptions> =
        typeof input === "string" ? { title: input } : input;
      return show({ variant, ...base });
    },
    [show]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      hide,
      clear,
      success: (m) => mk("success", m),
      error:   (m) => mk("error", m),
      info:    (m) => mk("info", m),
      warning: (m) => mk("warning", m),
      loading: (m = {}) => {
        const base = typeof m === "string" ? { title: m } : m;
        return show({ variant: "loading", duration: 0, ...base });
      },
    }),
    [show, hide, clear, mk]
  );

  // Local keyframes (kept here for easy copy-paste)
  // You can move these to your globals if you want.
  return (
    <ToastContext.Provider value={value}>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes toast-slide { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
          .animate-toast-slide { animation: toast-slide .25s ease-out both }
        }
      `}</style>

      {children}

      {/* Viewports grouped by position so multiple stacks look tidy */}
      {(["bottom-right","bottom","top-right","top"] as ToastPosition[]).map((pos) => {
        const stack = toasts.filter((t) => t.position === pos);
        if (!stack.length) return null;
        return (
          <div key={pos} className={`fixed z-[100] ${positionClass(pos)} space-y-2 print:hidden`}>
            {stack.map((t) => (
              <ToastCard key={t.id} t={t} onClose={hide} />
            ))}
          </div>
        );
      })}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
