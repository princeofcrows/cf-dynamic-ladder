import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import AppLayout from "@/src/components/wrappers/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CF Analytics",
  description: "Codeforces analytics and suggestion tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          <AppLayout>{children}</AppLayout>
        </main>
      </body>
    </html>
  );
}
