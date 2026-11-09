export type SiteTheme = {
  primary: string;
  background: string;
};

export type SiteTestimonial = {
  name: string;
  role: string;
  quote: string;
};

export type SitePillar = {
  title: string;
  text: string;
  cta: string;
};

export const SITE_IMAGES = {
  hero: "/img_01.jpeg",
  pillars: ["/img_02.jpeg", "/img_03.jpeg", "/img_04.jpeg"],
} as const;

export type SitePricing = {
  amount: number;
  offerEnabled: boolean;
  offerAmount: number;
  offerLabel: string;
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
  };
  theme: SiteTheme;
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  difference: {
    kicker: string;
    title: string;
    text: string;
  };
  pillars: SitePillar[];
  midCta: {
    title: string;
    text: string;
    cta: string;
  };
  testimonials: {
    visible: boolean;
    title: string;
    items: SiteTestimonial[];
  };
  finalCta: {
    title: string;
    text: string;
    cta: string;
  };
  footer: {
    blurb: string;
    instagram: string;
    email: string;
  };
  pricing: SitePricing;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: "MiniMima!",
    tagline: "couture",
  },
  theme: {
    primary: "#d9898a",
    background: "#f7f3ef",
  },
  hero: {
    title: "No solo van a aprender a coser. Van a aprender a crear.",
    subtitle:
      "Taller de costura creativa MiniMima! para chicas y chicos de 8 a 14 años. Completá la inscripción y coordinamos el resto por WhatsApp.",
    ctaPrimary: "Inscribirme",
    ctaSecondary: "Conocé el curso",
  },
  difference: {
    kicker: "MiniMima!",
    title: "¿Qué hace diferente a este taller?",
    text: "No es una clase de costura rígida. Es un espacio para inventar, equivocarse, volver a intentar y terminar algo que pueden ponerse. Con acompañamiento real y grupos chicos.",
  },
  pillars: [
    {
      title: "El problema",
      text: "Pantallas, contenidos listos para consumir y pocas chances de hacer algo con las propias manos. A esa edad, crear también es una forma de crecer.",
      cta: "Por eso existe MiniMima!",
    },
    {
      title: "La solución",
      text: "Un taller de costura creativa, con cupos reducidos. Diseñan, cortan y cosen. Cada clase dura 2 horas y está pensada para que nadie quede afuera.",
      cta: "Inscribirme",
    },
    {
      title: "El resultado",
      text: "Se llevan una prenda hecha por ellos. Y algo más duradero: la confianza de haberla imaginado, armado y terminado.",
      cta: "Ver testimonios",
    },
  ],
  midCta: {
    title: "Anotate ahora y reservamos el lugar",
    text: "Completá los datos del tutor y del alumno. Te llega el mensaje por WhatsApp para coordinar el resto.",
    cta: "Ir a inscribirme",
  },
  testimonials: {
    visible: true,
    title: "Familias que ya pasaron por el taller",
    items: [
      {
        name: "Florencia M.",
        role: "Mamá de Martina, 10",
        quote:
          "Llegó a casa contando cada puntada. No era un taller más: se sentía diseñadora.",
      },
      {
        name: "Diego R.",
        role: "Papá de Benjamín, 12",
        quote:
          "Por fin una actividad donde no hay pantalla. Sale orgulloso de lo que hizo.",
      },
      {
        name: "Carolina S.",
        role: "Mamá de Emma, 9",
        quote:
          "El grupo es chico y se nota. La acompañan de verdad, no es una clase masiva.",
      },
    ],
  },
  finalCta: {
    title: "¿Listos para el primer corte?",
    text: "Inscribí a tu hijo o hija y coordinamos horarios, materiales y el primer día de clase por WhatsApp.",
    cta: "Completar inscripción",
  },
  footer: {
    blurb:
      "Taller de costura creativa para chicas y chicos de 8 a 14 años. Aprender a crear, no solo a coser.",
    instagram: "https://instagram.com",
    email: "hola@minimima.com",
  },
  pricing: {
    amount: 50000,
    offerEnabled: false,
    offerAmount: 45000,
    offerLabel: "Promo",
  },
};

export function withSiteContentDefaults(raw: Partial<SiteContent> & {
  brand?: Partial<SiteContent["brand"]> & { logo?: string };
  pricing?: Partial<SitePricing>;
  pillars?: Partial<SitePillar>[];
}): SiteContent {
  const d = DEFAULT_SITE_CONTENT;
  const sourcePillars = raw.pillars?.length === 3 ? raw.pillars : d.pillars;
  const amount = Number(raw.pricing?.amount);
  const offerAmount = Number(raw.pricing?.offerAmount);
  return {
    brand: { ...d.brand, ...raw.brand, name: raw.brand?.name || d.brand.name },
    theme: { ...d.theme, ...raw.theme },
    hero: {
      title: raw.hero?.title ?? d.hero.title,
      subtitle: raw.hero?.subtitle ?? d.hero.subtitle,
      ctaPrimary: raw.hero?.ctaPrimary ?? d.hero.ctaPrimary,
      ctaSecondary: raw.hero?.ctaSecondary ?? d.hero.ctaSecondary,
    },
    difference: { ...d.difference, ...raw.difference },
    pillars: sourcePillars.map((pillar, index) => ({
      title: pillar.title ?? d.pillars[index].title,
      text: pillar.text ?? d.pillars[index].text,
      cta: pillar.cta ?? d.pillars[index].cta,
    })),
    midCta: { ...d.midCta, ...raw.midCta },
    testimonials: {
      ...d.testimonials,
      ...raw.testimonials,
      visible: raw.testimonials?.visible ?? d.testimonials.visible,
      items: raw.testimonials?.items ?? d.testimonials.items,
    },
    finalCta: { ...d.finalCta, ...raw.finalCta },
    footer: { ...d.footer, ...raw.footer },
    pricing: {
      ...d.pricing,
      ...raw.pricing,
      amount: Number.isFinite(amount) && amount > 0 ? amount : d.pricing.amount,
      offerEnabled: Boolean(raw.pricing?.offerEnabled),
      offerAmount:
        Number.isFinite(offerAmount) && offerAmount >= 0
          ? offerAmount
          : d.pricing.offerAmount,
      offerLabel: raw.pricing?.offerLabel?.trim() || d.pricing.offerLabel,
    },
  };
}
