import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Heart,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";

import { AnimatedLogo } from "@/components/brand/animated-logo";
import { MediaPlaceholder } from "@/components/landing/media-placeholder";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { buttonVariants } from "@/components/ui/button";
import type { SiteContent } from "@/lib/site-content";
import { publicThemeStyle } from "@/lib/theme-style";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "8–14", label: "Años, el rango del taller" },
  { value: "2 h", label: "Por clase, mañana o tarde" },
  { value: "Cupos", label: "Reducidos, para poder crear" },
];

export function LandingPage({ content }: { content: SiteContent }) {
  return (
    <div className="min-h-svh bg-background" style={publicThemeStyle(content.theme)}>
      <SiteHeader
        name={content.brand.name}
        cta={content.hero.ctaPrimary}
        showTestimonials={content.testimonials.visible}
      />
      <main>
        <section className="px-5 pt-10 pb-8 md:px-8 md:pt-16 md:pb-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <AnimatedLogo />
            <h2 className="mt-8 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              {content.hero.title}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
              {content.hero.subtitle}
            </p>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/inscripcion"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-xl px-6 text-base"
                )}
              >
                {content.hero.ctaPrimary}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/#curso"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-xl px-6 text-base"
                )}
              >
                {content.hero.ctaSecondary}
              </Link>
            </div>
            <MediaPlaceholder
              label={content.hero.image ? "Taller" : "Video o foto del taller"}
              play={!content.hero.image}
              src={content.hero.image}
              className="mt-10 w-full max-w-4xl"
            />
          </div>
        </section>

        <section className="border-y border-border/70 bg-card/40 py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-6 px-5 text-muted-foreground md:gap-10 md:px-8">
            {[
              { icon: Scissors, label: "Costura" },
              { icon: Sparkles, label: "Diseño" },
              { icon: Heart, label: "Crear" },
              { icon: Users, label: "Grupo chico" },
              { icon: Clock, label: "2 horas" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]"
              >
                <item.icon className="size-4 text-primary" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section id="diferencia" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              {content.difference.kicker}
            </p>
            <h3 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {content.difference.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
              {content.difference.text}
            </p>
          </div>
        </section>

        <section id="curso" className="scroll-mt-20 px-5 pb-8 md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-16">
            {content.pillars.map((item, index) => {
              const reverse = index === 1;
              return (
                <article
                  key={`${item.title}-${index}`}
                  className={cn(
                    "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                    reverse && "md:[&>div:first-child]:order-2"
                  )}
                >
                  <MediaPlaceholder
                    label={item.image ? item.title : "Imagen del taller"}
                    src={item.image}
                  />
                  <div className={cn(reverse && "md:text-right")}>
                    <h3 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
                      {item.text}
                    </p>
                    {index === 1 ? (
                      <Link
                        href="/inscripcion"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        {item.cta}
                        <ArrowRight className="size-4" />
                      </Link>
                    ) : (
                      <p className="mt-5 text-sm font-medium text-foreground/80">
                        {item.cta}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-12 md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-3xl bg-foreground px-6 py-8 text-background md:flex-row md:items-center md:px-10">
            <div className="max-w-xl">
              <h3 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
                {content.midCta.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-background/75 md:text-base">
                {content.midCta.text}
              </p>
            </div>
            <Link
              href="/inscripcion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 shrink-0 rounded-xl bg-background px-6 text-base text-foreground hover:bg-background/90"
              )}
            >
              {content.midCta.cta}
            </Link>
          </div>
        </section>

        {content.testimonials.visible && content.testimonials.items.length > 0 ? (
          <section id="testimonios" className="scroll-mt-20 px-5 py-16 md:px-8">
            <div className="mx-auto max-w-5xl">
              <h3 className="text-center font-serif text-3xl font-semibold tracking-tight">
                {content.testimonials.title}
              </h3>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {content.testimonials.items.map((review) => (
                  <figure
                    key={review.name}
                    className="rounded-3xl bg-secondary/80 p-6"
                  >
                    <blockquote className="text-sm leading-relaxed text-pretty">
                      “{review.quote}”
                    </blockquote>
                    <figcaption className="mt-5">
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="cupos" className="scroll-mt-20 px-5 pb-8 md:px-8">
          <div className="mx-auto grid max-w-5xl gap-8 border-y border-border py-12 md:grid-cols-3 md:gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-16 md:px-8 md:pb-24">
          <div className="mx-auto max-w-5xl rounded-3xl bg-foreground px-6 py-12 text-center text-background md:px-12">
            <h3 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
              {content.finalCta.title}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-background/75 md:text-base">
              {content.finalCta.text}
            </p>
            <Link
              href="/inscripcion"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-12 rounded-xl bg-background px-6 text-base text-foreground hover:bg-background/90"
              )}
            >
              {content.finalCta.cta}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </div>
  );
}
