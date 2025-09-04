import type React from "react";
import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Providers } from "@/hooks/Providers";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend-deca",
});

export const metadata: Metadata = {
  title: "StableSafe - Decentralized Savings dApp",
  description:
    "Save smarter with lockable stablecoins and community savings pots on-chain",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${lexendDeca.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster richColors position="bottom-right" />
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
