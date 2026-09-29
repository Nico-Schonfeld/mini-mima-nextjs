export const SITE_NAME = "MiniMima!";
export const SITE_TAGLINE = "couture";
export const DEFAULT_TITLE = "MiniMima! — Taller de costura creativa para chicas y chicos";
export const DEFAULT_DESCRIPTION =
  "Taller de costura creativa MiniMima! para niñas y niños de 8 a 14 años. Aprenden a diseñar, cortar y coser en grupos chicos. Inscribite online y coordinamos por WhatsApp.";

export const SEO_KEYWORDS = [
  "MiniMima",
  "taller de costura para niños",
  "curso de costura infantil",
  "costura creativa",
  "taller de moda para niñas",
  "aprender a coser niños",
  "taller de costura 8 a 14 años",
  "couture infantil",
  "curso de moda para chicos",
  "inscripción taller de costura",
];

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
