export function getDbErrorMessage(error: unknown): string {
  if (!process.env.DATABASE_URL) {
    return "未配置 DATABASE_URL，请在 Render 環境變量中設置 Postgres 連接串";
  }

  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes("P1001") ||
    message.includes("Can't reach database") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Connection refused")
  ) {
    return "無法連接資料庫，請確認 DATABASE_URL 為 Postgres Internal URL 且與 Web 服務同區域";
  }

  if (
    message.includes("P2021") ||
    message.includes("does not exist") ||
    message.includes("P3009") ||
    message.includes("migrate")
  ) {
    return "資料表尚未建立，請在 Shell 執行：npx prisma migrate deploy";
  }

  if (message.includes("Authentication failed") || message.includes("password")) {
    return "資料庫帳號或密碼錯誤，請檢查 DATABASE_URL";
  }

  return "資料庫錯誤，請確認 migrate 與 seed 已執行";
}
