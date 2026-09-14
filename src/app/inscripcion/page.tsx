import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { RegistrationForm } from "@/components/inscripcion/registration-form";
import { readSiteContent } from "@/lib/site-content-server";
import { publicThemeStyle } from "@/lib/theme-style";

export const dynamic = "force-dynamic";

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
        <RegistrationForm />
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
