import { TabBar } from "@/components/TabBar";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-dvh pb-bottom-nav">{children}</main>
      <TabBar />
    </>
  );
}
