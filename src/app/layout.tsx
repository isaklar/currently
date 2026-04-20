import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Currently – Dagens elpriser i Sverige",
  description:
    "Se dagens elpriser timme för timme för alla svenska elprisområden: SE1, SE2, SE3 och SE4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
