import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palleter | Mercado agrícola local",
  description:
    "Portal agrícola de proximidad para descubrir producto local, con fichas SEO, reparto por zona y panel para agricultores.",
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
