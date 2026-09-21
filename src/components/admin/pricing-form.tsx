"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, Loader2 } from "lucide-react";

import { AdminHeader, ContenidoSkeleton } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { COUPON_DISCOUNT_PERCENT, formatArs } from "@/lib/pricing";
import {
  DEFAULT_SITE_CONTENT,
  withSiteContentDefaults,
  type SiteContent,
  type SitePricing,
} from "@/lib/site-content";

export function PricingForm() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [couponConfigured, setCouponConfigured] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponVisible, setCouponVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contenido")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar.");
        setContent(withSiteContentDefaults(data.content ?? {}));
        setCouponConfigured(Boolean(data.couponConfigured));
        setCouponCode(String(data.couponCode ?? "").trim());
      })
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  function setPricing(patch: Partial<SitePricing>) {
    if (!content) return;
    setContent({
      ...content,
      pricing: { ...content.pricing, ...patch },
    });
  }

  async function persist(next: SiteContent, okMessage: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/contenido", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar.");
      setContent(withSiteContentDefaults(data.content ?? next));
      setMessage(okMessage);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;
    await persist(
      content,
      "Precio actualizado. Recargá /inscripcion para verlo."
    );
  }

  async function resetPricing() {
    if (!content) return;
    await persist(
      {
        ...content,
        pricing: { ...DEFAULT_SITE_CONTENT.pricing },
      },
      "Precio restablecido a $50.000 sin oferta. Recargá /inscripcion."
    );
  }

  if (loading || !content) {
    return (
      <div>
        <AdminHeader
          title="Precio"
          description="Valor de la inscripción, oferta y cupón."
        />
        <ContenidoSkeleton />
        {message ? <p className="mt-4 text-sm text-destructive">{message}</p> : null}
      </div>
    );
  }

  const pricing = content.pricing;
  const preview = pricing.offerEnabled
    ? pricing.offerAmount
    : pricing.amount;

  return (
    <div>
      <AdminHeader
        title="Precio de inscripción"
        description="Este valor se muestra en /inscripcion y en el mensaje de WhatsApp."
      />

      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Precio</Label>
          <Input
            id="amount"
            className="h-11 rounded-xl"
            type="number"
            min={1}
            step={1}
            value={pricing.amount}
            onChange={(e) => setPricing({ amount: Number(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            Vista previa: {formatArs(Number(pricing.amount) || 0)}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Moneda</Label>
          <Input
            id="currency"
            className="h-11 rounded-xl"
            value="ARS — peso argentino"
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            Por ahora el taller cobra solo en pesos argentinos.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Switch
            checked={pricing.offerEnabled}
            onCheckedChange={(checked) => setPricing({ offerEnabled: checked })}
          />
          Activar oferta / descuento
        </label>

        {pricing.offerEnabled ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offerAmount">Precio de oferta</Label>
              <Input
                id="offerAmount"
                className="h-11 rounded-xl"
                type="number"
                min={0}
                step={1}
                value={pricing.offerAmount}
                onChange={(e) =>
                  setPricing({ offerAmount: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offerLabel">Nombre de la oferta</Label>
              <Input
                id="offerLabel"
                className="h-11 rounded-xl"
                value={pricing.offerLabel}
                onChange={(e) => setPricing({ offerLabel: e.target.value })}
                placeholder="Promo"
              />
            </div>
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="text-sm font-medium">
            Cupón {COUPON_DISCOUNT_PERCENT}%
          </p>
          {couponConfigured && couponCode ? (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                Aplica sobre el precio vigente. Tocá Ver cupón para
                copiarlo y compartirlo.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-border bg-background px-3">
                  <code
                    aria-hidden={!couponVisible}
                    className={
                      couponVisible
                        ? "truncate font-mono text-sm tracking-wide"
                        : "truncate font-mono text-sm tracking-[0.18em] text-muted-foreground select-none blur-[6px]"
                    }
                  >
                    {couponCode}
                  </code>
                  {!couponVisible ? (
                    <span className="sr-only">Cupón oculto</span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={() => setCouponVisible((open) => !open)}
                  >
                    {couponVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    {couponVisible ? "Ocultar" : "Ver cupón"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(couponCode);
                        setCopied(true);
                        setCouponVisible(true);
                        window.setTimeout(() => setCopied(false), 1600);
                      } catch {
                        setCouponVisible(true);
                      }
                    }}
                  >
                    {copied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Definí INSCRIPTION_COUPON_CODE en el .env y en Vercel, y
              reiniciá el servidor para poder revelar el código acá.
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          En la web se va a mostrar{" "}
          <span className="font-medium text-foreground">{formatArs(preview)}</span>
          {pricing.offerEnabled ? (
            <>
              {" "}
              (lista {formatArs(pricing.amount)})
            </>
          ) : null}
          .
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="h-11 rounded-xl" disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Guardar precio
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl"
            disabled={saving}
            onClick={resetPricing}
          >
            Restablecer
          </Button>
        </div>
        {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      </form>
    </div>
  );
}
