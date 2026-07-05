import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palleter",
  description: "Portal agricola para descubrir, publicar y gestionar producto local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
