import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nishchinto Dashboard",
  description: "ব্যবসা হোক নিশ্চিন্তে — Seller Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={inter.variable}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
