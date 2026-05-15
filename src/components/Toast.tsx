import { useEffect, useState, useCallback } from "react";

type Toast = { id: number; type: "success" | "error" | "info" | "achievement"; title: string; body?: string };

let listeners: Array<(t: Toast) => void> = [];
let nextId = 1;

export function pushToast(t: Omit<Toast, "id">) {
  const toast: Toast = { id: nextId++, ...t };
  listeners.forEach((l) => l(toast));
}

export function ToastViewport() {
  const [items, setItems] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setItems((arr) => arr.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (t: Toast) => {
      setItems((arr) => [...arr, t]);
      setTimeout(() => remove(t.id), 3500);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, [remove]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto min-w-[260px] max-w-[360px] rounded-xl px-4 py-3 shadow-lg animate-slide-up backdrop-blur-md border ${
            t.type === "success"
              ? "bg-success-grad border-cyan-400/40 text-bg-primary"
              : t.type === "error"
                ? "bg-danger-grad border-pink-400/40 text-white"
                : t.type === "achievement"
                  ? "bg-streak-grad border-yellow-400/40 text-bg-primary"
                  : "bg-card-grad border-purple-500/40 text-text-primary"
          }`}
        >
          <p className="font-display font-semibold text-sm leading-tight">{t.title}</p>
          {t.body && <p className="text-xs opacity-80 mt-0.5">{t.body}</p>}
        </div>
      ))}
    </div>
  );
}
