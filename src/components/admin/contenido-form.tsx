"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";

import {
  AdminHeader,
  ContenidoSkeleton,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_SITE_CONTENT,
  withSiteContentDefaults,
  type SiteContent,
} from "@/lib/site-content";

export function ContenidoForm() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contenido")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar.");
        setContent(withSiteContentDefaults(data.content ?? {}));
      })
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function persist(next: SiteContent, okMessage: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contenido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      setContent(withSiteContentDefaults(data.content ?? next));
      setMessage(okMessage);
    } catch (err) {
      setContent(next);
      setMessage(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    await persist(content, "Landing actualizada. Recargá / para ver los cambios.");
  }

  if (loading || !content) {
    return (
      <div>
        <AdminHeader
          title="Sitio"
          description="Textos y colores de la página. Tocá Guardar landing al final."
        />
        <ContenidoSkeleton />
      </div>
    );
  }

  const defaults = DEFAULT_SITE_CONTENT;

  return (
    <div>
      <AdminHeader
        title="Sitio"
        description="Editá textos y colores de la página. Tocá Guardar landing al final."
      />

      <form onSubmit={onSubmit} className="grid gap-5">
        <Section
          title="Marca y colores"
          onReset={() =>
            setContent({
              ...content,
              brand: defaults.brand,
              theme: defaults.theme,
            })
          }
        >
          <Field label="Nombre">
            <Input
              className="h-11 rounded-xl"
              value={content.brand.name}
              onChange={(e) =>
                setContent({
                  ...content,
                  brand: { ...content.brand, name: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Tagline">
            <Input
              className="h-11 rounded-xl"
              value={content.brand.tagline}
              onChange={(e) =>
                setContent({
                  ...content,
                  brand: { ...content.brand, tagline: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Color principal">
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="size-11 cursor-pointer rounded-xl border border-input bg-transparent"
                value={content.theme.primary}
                onChange={(e) =>
                  setContent({
                    ...content,
                    theme: { ...content.theme, primary: e.target.value },
                  })
                }
              />
              <Input
                className="h-11 rounded-xl"
                value={content.theme.primary}
                onChange={(e) =>
                  setContent({
                    ...content,
                    theme: { ...content.theme, primary: e.target.value },
                  })
                }
              />
            </div>
          </Field>
          <Field label="Fondo">
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="size-11 cursor-pointer rounded-xl border border-input bg-transparent"
                value={content.theme.background}
                onChange={(e) =>
                  setContent({
                    ...content,
                    theme: { ...content.theme, background: e.target.value },
                  })
                }
              />
              <Input
                className="h-11 rounded-xl"
                value={content.theme.background}
                onChange={(e) =>
                  setContent({
                    ...content,
                    theme: { ...content.theme, background: e.target.value },
                  })
                }
              />
            </div>
          </Field>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-fit rounded-xl"
            onClick={() => setContent({ ...content, theme: defaults.theme })}
          >
            <RotateCcw className="size-4" />
            Reiniciar colores
          </Button>
        </Section>

        <Section
          title="Hero"
          onReset={() => setContent({ ...content, hero: defaults.hero })}
        >
          <Field label="Título">
            <Textarea
              className="rounded-xl"
              value={content.hero.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, title: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Subtítulo">
            <Textarea
              className="rounded-xl"
              value={content.hero.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value },
                })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Botón principal">
              <Input
                className="h-11 rounded-xl"
                value={content.hero.ctaPrimary}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, ctaPrimary: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Botón secundario">
              <Input
                className="h-11 rounded-xl"
                value={content.hero.ctaSecondary}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, ctaSecondary: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Qué lo hace diferente"
          onReset={() =>
            setContent({
              ...content,
              difference: defaults.difference,
              pillars: defaults.pillars,
            })
          }
        >
          <Field label="Kicker">
            <Input
              className="h-11 rounded-xl"
              value={content.difference.kicker}
              onChange={(e) =>
                setContent({
                  ...content,
                  difference: { ...content.difference, kicker: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Título">
            <Input
              className="h-11 rounded-xl"
              value={content.difference.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  difference: { ...content.difference, title: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Texto">
            <Textarea
              className="min-h-24 rounded-xl"
              value={content.difference.text}
              onChange={(e) =>
                setContent({
                  ...content,
                  difference: { ...content.difference, text: e.target.value },
                })
              }
            />
          </Field>
          <p className="text-sm text-muted-foreground">
            Las tres tarjetas de la home (problema, solución y resultado).
          </p>
          {content.pillars.map((pillar, index) => (
            <div
              key={index}
              className="grid gap-4 rounded-xl border border-border p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-medium">
                  {defaults.pillars[index]?.title || pillar.title}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => {
                    const pillars = [...content.pillars];
                    pillars[index] = defaults.pillars[index];
                    setContent({ ...content, pillars });
                  }}
                >
                  <RotateCcw className="size-3.5" />
                  Reiniciar tarjeta
                </Button>
              </div>
              <Field label="Título">
                <Input
                  className="h-11 rounded-xl"
                  value={pillar.title}
                  onChange={(e) => {
                    const pillars = [...content.pillars];
                    pillars[index] = { ...pillar, title: e.target.value };
                    setContent({ ...content, pillars });
                  }}
                />
              </Field>
              <Field label="Texto">
                <Textarea
                  className="min-h-24 rounded-xl"
                  value={pillar.text}
                  onChange={(e) => {
                    const pillars = [...content.pillars];
                    pillars[index] = { ...pillar, text: e.target.value };
                    setContent({ ...content, pillars });
                  }}
                />
              </Field>
              <Field label="CTA">
                <Input
                  className="h-11 rounded-xl"
                  value={pillar.cta}
                  onChange={(e) => {
                    const pillars = [...content.pillars];
                    pillars[index] = { ...pillar, cta: e.target.value };
                    setContent({ ...content, pillars });
                  }}
                />
              </Field>
            </div>
          ))}
        </Section>

        <Section
          title="Testimonios"
          onReset={() =>
            setContent({ ...content, testimonials: defaults.testimonials })
          }
          extra={
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={content.testimonials.visible}
                onCheckedChange={(checked) =>
                  setContent({
                    ...content,
                    testimonials: { ...content.testimonials, visible: checked },
                  })
                }
              />
              Mostrar en la landing
            </label>
          }
        >
          <Field label="Título de la sección">
            <Input
              className="h-11 rounded-xl"
              value={content.testimonials.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  testimonials: { ...content.testimonials, title: e.target.value },
                })
              }
            />
          </Field>
          {content.testimonials.items.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-border p-3">
              <Field label="Nombre">
                <Input
                  className="h-11 rounded-xl"
                  value={item.name}
                  onChange={(e) => {
                    const items = [...content.testimonials.items];
                    items[index] = { ...item, name: e.target.value };
                    setContent({
                      ...content,
                      testimonials: { ...content.testimonials, items },
                    });
                  }}
                />
              </Field>
              <Field label="Rol">
                <Input
                  className="h-11 rounded-xl"
                  value={item.role}
                  onChange={(e) => {
                    const items = [...content.testimonials.items];
                    items[index] = { ...item, role: e.target.value };
                    setContent({
                      ...content,
                      testimonials: { ...content.testimonials, items },
                    });
                  }}
                />
              </Field>
              <Field label="Cita">
                <Textarea
                  className="rounded-xl"
                  value={item.quote}
                  onChange={(e) => {
                    const items = [...content.testimonials.items];
                    items[index] = { ...item, quote: e.target.value };
                    setContent({
                      ...content,
                      testimonials: { ...content.testimonials, items },
                    });
                  }}
                />
              </Field>
            </div>
          ))}
        </Section>

        <Section
          title="Llamados a la acción"
          onReset={() =>
            setContent({
              ...content,
              midCta: defaults.midCta,
              finalCta: defaults.finalCta,
            })
          }
        >
          <Field label="CTA del medio · título">
            <Input
              className="h-11 rounded-xl"
              value={content.midCta.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  midCta: { ...content.midCta, title: e.target.value },
                })
              }
            />
          </Field>
          <Field label="CTA del medio · texto">
            <Textarea
              className="rounded-xl"
              value={content.midCta.text}
              onChange={(e) =>
                setContent({
                  ...content,
                  midCta: { ...content.midCta, text: e.target.value },
                })
              }
            />
          </Field>
          <Field label="CTA final · título">
            <Input
              className="h-11 rounded-xl"
              value={content.finalCta.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, title: e.target.value },
                })
              }
            />
          </Field>
          <Field label="CTA final · texto">
            <Textarea
              className="rounded-xl"
              value={content.finalCta.text}
              onChange={(e) =>
                setContent({
                  ...content,
                  finalCta: { ...content.finalCta, text: e.target.value },
                })
              }
            />
          </Field>
        </Section>

        <Section
          title="Footer"
          onReset={() => setContent({ ...content, footer: defaults.footer })}
        >
          <Field label="Texto">
            <Textarea
              className="rounded-xl"
              value={content.footer.blurb}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, blurb: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Instagram">
            <Input
              className="h-11 rounded-xl"
              value={content.footer.instagram}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, instagram: e.target.value },
                })
              }
            />
          </Field>
          <Field label="Email">
            <Input
              className="h-11 rounded-xl"
              value={content.footer.email}
              onChange={(e) =>
                setContent({
                  ...content,
                  footer: { ...content.footer, email: e.target.value },
                })
              }
            />
          </Field>
        </Section>

        <Button type="submit" className="h-11 w-fit rounded-xl" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Guardar landing
        </Button>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </form>
    </div>
  );
}

function Section({
  title,
  onReset,
  extra,
  children,
}: {
  title: string;
  onReset?: () => void | Promise<void>;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-lg font-semibold tracking-tight">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {extra}
          {onReset ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => onReset()}
            >
              <RotateCcw className="size-3.5" />
              Reiniciar sección
            </Button>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

