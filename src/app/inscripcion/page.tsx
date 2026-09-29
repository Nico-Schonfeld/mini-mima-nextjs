import type { Metadata } from "next";

import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { RegistrationForm } from "@/components/inscripcion/registration-form";
import { SITE_NAME } from "@/lib/seo";
import { readSiteContent } from "@/lib/site-content-server";
import { publicThemeStyle } from "@/lib/theme-style";

export const metadata: Metadata = {
  title: "Inscripción",
  description: `Completá la inscripción al taller de costura creativa ${SITE_NAME} para chicas y chicos de 8 a 14 años. Reservá el cupo online y coordinamos el resto por WhatsApp.`,
  keywords: [
    "inscripción taller de costura",
    "inscribirse MiniMima",
    "anotar taller de moda infantil",
    "cupos taller de costura niños",
  ],
  alternates: { canonical: "/inscripcion" },
  openGraph: {
    title: `Inscripción · ${SITE_NAME}`,
    description:
      "Reservá un lugar en el taller de costura creativa para niñas y niños de 8 a 14 años.",
    url: "/inscripcion",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InscripcionPage() {
  const content = await readSiteContent();
  return (
    <div className="min-h-svh bg-background" style={publicThemeStyle(content.theme)}>
      <SiteHeader
        name={content.brand.name}
        cta={content.hero.ctaPrimary}
        showTestimonials={content.testimonials.visible}
      />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 py-10 md:py-16">
        <RegistrationForm
          pricing={content.pricing}
          couponEnabled={Boolean(process.env.INSCRIPTION_COUPON_CODE?.trim())}
        />
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
