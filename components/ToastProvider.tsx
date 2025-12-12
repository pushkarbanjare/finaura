"use client";

import React, { useEffect, useState } from "react";

type ToastItem = {
  id: number;
  message: string;
  duration?: number;
};

const EVENT_NAME = "finaura:toast";

export function toast(message: string, duration = 3000) {
  if (typeof window === "undefined") return;
  const detail: ToastItem = { id: Date.now(), message, duration };
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onShow(e: Event) {
      const custom = e as CustomEvent<ToastItem>;
      const t = custom.detail;
      setToasts((s) => [t, ...s]);
      // auto remove
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== t.id));
      }, t.duration ?? 3000);
    }

    window.addEventListener(EVENT_NAME, onShow as EventListener);
    return () =>
      window.removeEventListener(EVENT_NAME, onShow as EventListener);
  }, []);

  return (
    <>
      {children}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#111827",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              minWidth: 180,
              maxWidth: 320,
              animation: "fadeIn .12s ease-out",
              fontSize: 14,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { transform: translateY(6px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
      `}</style>
    </>
  );
}
