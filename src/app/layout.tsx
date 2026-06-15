import { Nunito } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://mapulengua.app"
  ),
  title: "Mapulengua — Viaje por Chile",
  description:
    "Viaja por Chile con Pudu y aprende mapudungun en cada región del camino sur.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mapulengua",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Mapulengua",
    title: "Mapulengua — Viaje por Chile",
    description:
      "Viaja por Chile con Pudu y aprende mapudungun en cada región del camino sur.",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapulengua — Viaje por Chile",
    description:
      "Viaja por Chile con Pudu y aprende mapudungun en cada región del camino sur.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c8542a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} font-body antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
