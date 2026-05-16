"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("密碼錯誤");
      return;
    }
    const from = searchParams.get("from") || "/admin/products";
    router.push(from);
    router.refresh();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--background)] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-surface-border bg-surface-elevated p-8"
      >
        <h1 className="font-display text-center text-xl text-gold">後台登入</h1>
        <p className="mt-2 text-center text-xs text-foreground/50">古巴雪茄零售管理</p>
        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="管理密碼"
          className="mt-6 w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-gold/50"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-full bg-gold py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? "登入中…" : "登入"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--background)]" />}>
      <LoginForm />
    </Suspense>
  );
}
