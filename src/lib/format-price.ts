export function formatPrice(hkd: number): string {
  if (!hkd) return "詢價";
  return `HK$${hkd.toLocaleString("zh-HK")}`;
}
