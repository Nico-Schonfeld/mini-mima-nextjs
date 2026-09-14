import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "MiniMima! — Curso de moda para niñas y niños",
  description:
    "Taller de costura creativa MiniMima! para chicas y chicos de 8 a 14 años. Inscribite online y coordinamos por WhatsApp.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f3ef",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`light ${inter.variable} ${fraunces.variable} h-full bg-background`}
    >
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
