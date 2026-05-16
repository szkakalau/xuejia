import { TabBar } from "@/components/TabBar";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-dvh pb-20">{children}</main>
      <TabBar />
    </>
  );
}
