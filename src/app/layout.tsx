import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_TC } from "next/font/google";
import { AgeGate } from "@/components/AgeGate";
import { CartProvider } from "@/context/CartContext";
import { Footer } from "@/components/Footer";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "古巴雪茄 · 精品零售",
  description: "精品古巴雪茄 — 品牌分類、線上選購 · 港幣標價",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0907",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${display.variable} ${sans.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <AgeGate />
          <div className="shop-ambient mx-auto min-h-dvh max-w-lg shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            {children}
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
