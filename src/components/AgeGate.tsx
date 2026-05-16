"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "age-verified";

export function AgeGate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    if (!verified) setVisible(true);
  }, []);

  const confirm = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const deny = () => {
    window.location.href = "https://www.google.com";
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface-elevated p-8 text-center shadow-2xl">
        <h2 className="font-display text-2xl font-semibold text-gold">年齡確認</h2>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
          本網站銷售雪茄產品。您必須年滿 18 歲（或您所在地區規定的法定吸煙年齡）方可瀏覽與購買。
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={confirm}
            className="rounded-full bg-gold py-3 text-sm font-medium text-background transition hover:bg-gold-light"
          >
            我已滿 18 歲
          </button>
          <button
            type="button"
            onClick={deny}
            className="rounded-full border border-surface-border py-3 text-sm text-foreground/60 transition hover:border-gold/40"
          >
            離開網站
          </button>
        </div>
      </div>
    </div>
  );
}
