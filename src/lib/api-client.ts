export async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    return { ok: false, status: 0, error: "網絡錯誤，請檢查連線" };
  }

  const text = await res.text();
  if (!text.trim()) {
    return {
      ok: false,
      status: res.status,
      error:
        res.status >= 500
          ? `伺服器錯誤 (${res.status})，請檢查 DATABASE_URL 與 Render 日誌`
          : `伺服器無回應 (${res.status})`,
    };
  }

  let data: T & { error?: string };
  try {
    data = JSON.parse(text) as T & { error?: string };
  } catch {
    return {
      ok: false,
      status: res.status,
      error: "伺服器回應格式錯誤（可能資料庫未配置）",
    };
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data.error || `請求失敗 (${res.status})`,
    };
  }

  return { ok: true, data: data as T };
}
