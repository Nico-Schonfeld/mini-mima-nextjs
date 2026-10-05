import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { AppToaster } from "@/components/ui/sonner";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SEO_KEYWORDS,
  SITE_NAME,
  getSiteUrl,
} from "@/lib/seo";

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

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "es-AR": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f3ef",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${siteUrl}/#org`,
      name: SITE_NAME,
      url: siteUrl,
      description: DEFAULT_DESCRIPTION,
      email: "hola@minimima.com",
    },
    {
      "@type": "Course",
      name: "Taller de costura creativa MiniMima!",
      description: DEFAULT_DESCRIPTION,
      provider: { "@id": `${siteUrl}/#org` },
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Niñas y niños de 8 a 14 años",
      },
      inLanguage: "es-AR",
      isAccessibleForFree: false,
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
      inLanguage: "es-AR",
      potentialAction: {
        "@type": "RegisterAction",
        target: `${siteUrl}/inscripcion`,
        name: "Inscribirse al taller",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`light ${inter.variable} ${fraunces.variable} h-full bg-background`}
    >
      <body className="min-h-full font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
