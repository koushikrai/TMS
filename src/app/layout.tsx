import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TMS-365 | CJSC Transport & Logistics Command Center",
  description: "Enterprise Transport & Logistics Execution Platform for Expertise Company CJSC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-body bg-background text-ink">
        {children}
      </body>
    </html>
  );
}
