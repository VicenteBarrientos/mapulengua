import { Nunito } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mapulengua — Aprende mapudungun",
  description:
    "Aprende mapudungun desde el español con Küme, tu guía condor. Un camino respetuoso hacia la lengua mapuche.",
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
