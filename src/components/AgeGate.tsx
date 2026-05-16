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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur-md">
      <div className="animate-fade-up w-full max-w-sm overflow-hidden rounded-3xl border border-surface-border/80 bg-surface-elevated shadow-gold-lg">
        <div className="border-b border-surface-border/50 bg-gradient-to-b from-gold/10 to-transparent px-8 py-6 text-center">
          <div className="gold-rule mx-auto mb-4" />
          <h2 className="font-display text-3xl font-semibold tracking-wide text-gold">年齡確認</h2>
          <p className="mt-1 text-[10px] uppercase tracking-luxury text-cream/40">Age Verification</p>
        </div>
        <div className="px-8 py-7 text-center">
          <p className="text-sm leading-relaxed text-foreground/70">
            本網站銷售雪茄產品。您必須年滿 <strong className="text-gold">18 歲</strong>
            （或您所在地區規定的法定吸煙年齡）方可瀏覽與購買。
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" onClick={confirm} className="btn-primary w-full">
              我已滿 18 歲
            </button>
            <button
              type="button"
              onClick={deny}
              className="w-full rounded-full border border-surface-border py-3 text-sm text-foreground/50 transition hover:border-gold/30 hover:text-foreground/70"
            >
              離開網站
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
