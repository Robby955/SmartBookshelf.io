// my-app/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";  // Update this path to point to the correct location

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartShelf",
  description: "Upload a book image and extract text",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
