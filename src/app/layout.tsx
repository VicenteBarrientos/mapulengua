import { Nunito } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Mapulengua — Viaje por Chile",
  description:
    "Viaja por Chile con Küme y aprende mapudungun en cada región del camino sur.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mapulengua",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf6f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} font-body antialiased`}>{children}</body>
    </html>
  );
}
