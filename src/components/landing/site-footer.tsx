import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

import { BrandMark } from "@/components/brand/animated-logo";
import { WHATSAPP_NUMBER } from "@/lib/config";
import type { SiteContent } from "@/lib/site-content";

export function SiteFooter({
  content,
}: {
  content?: Pick<SiteContent, "brand" | "footer" | "testimonials">;
}) {
  const name = content?.brand.name ?? "MiniMima!";
  const blurb =
    content?.footer.blurb ??
    "Taller de costura creativa para chicas y chicos de 8 a 14 años. Aprender a crear, no solo a coser.";
  const instagram = content?.footer.instagram || "https://instagram.com";
  const email = content?.footer.email || "hola@minimima.com";
  const showTestimonials = content?.testimonials?.visible !== false;

  const columns = [
    {
      title: "Curso",
      links: [
        { href: "/#curso", label: "Qué van a aprender" },
        { href: "/#diferencia", label: "Cómo es una clase" },
        { href: "/inscripcion", label: "Inscripción" },
      ],
    },
    {
      title: "MiniMima",
      links: [
        ...(showTestimonials
          ? [{ href: "/#testimonios", label: "Testimonios" }]
          : []),
        { href: "/#cupos", label: "Cupos y horarios" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
        <div>
          <BrandMark name={name} className="text-2xl" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {blurb}
          </p>
          <div className="mt-5 flex items-center gap-3 text-muted-foreground">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border p-2 transition-colors hover:text-foreground"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border p-2 transition-colors hover:text-foreground"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href={`mailto:${email}`}
              className="rounded-full border border-border p-2 transition-colors hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-medium">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-4 text-xs text-muted-foreground md:flex-row md:justify-between md:px-8">
          <span>
            © {new Date().getFullYear()} {name}. Todos los derechos reservados.
          </span>
          <span>Taller de moda para infancias.</span>
        </div>
      </div>
    </footer>
  );
}
