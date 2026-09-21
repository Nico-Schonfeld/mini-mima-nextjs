"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { FormScheduleSkeleton } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AGES, SCHEDULE_LABELS, type Schedule } from "@/lib/config";
import {
  COUPON_DISCOUNT_PERCENT,
  basePrice,
  formatArs,
  payableAmount,
} from "@/lib/pricing";
import type { SitePricing } from "@/lib/site-content";
import type { CourseConfig, Occupancy } from "@/lib/types";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<string, string>>;

const fieldClass = "h-11 rounded-xl text-base";

export function RegistrationForm({
  pricing: initialPricing,
  couponEnabled: initialCouponEnabled,
}: {
  pricing: SitePricing;
  couponEnabled: boolean;
}) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guardian, setGuardian] = useState("");
  const [student, setStudent] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Schedule | "">("");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponChecking, setCouponChecking] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [occupancy, setOccupancy] = useState<Occupancy | null>(null);
  const [config, setConfig] = useState<Partial<CourseConfig> | null>(null);
  const [loadingCupos, setLoadingCupos] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pricing, setPricing] = useState(initialPricing);
  const [couponEnabled, setCouponEnabled] = useState(initialCouponEnabled);
  const currentTotal = payableAmount(pricing, couponApplied);
  const listPrice = pricing.amount;
  const salePrice = basePrice(pricing);

  useEffect(() => {
    fetch("/api/precio", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.pricing) setPricing(data.pricing);
        if (typeof data?.couponEnabled === "boolean") {
          setCouponEnabled(data.couponEnabled);
        }
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    fetch("/api/cupos")
      .then((res) => res.json())
      .then((data) => {
        if (data?.occupancy) setOccupancy(data.occupancy);
        if (data?.config) setConfig(data.config);
      })
      .catch(() => null)
      .finally(() => setLoadingCupos(false));
  }, []);

  function validate(): boolean {
    const next: Errors = {};
    if (!guardian.trim()) next.guardian = "Ingresá el nombre del tutor/a.";
    if (!student.trim()) next.student = "Ingresá el nombre del alumno/a.";
    if (age === null) next.age = "Elegí la edad.";
    if (!schedule) next.schedule = "Elegí un horario.";
    if (!/^[\d\s+()-]{6,}$/.test(phone.trim()))
      next.phone = "Ingresá un teléfono válido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Ingresá un email válido.";
    if (schedule && occupancy && occupancy[schedule].disponibles <= 0) {
      next.schedule = "Ese turno no tiene cupos disponibles.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || age === null || !schedule) return;
    setSubmitting(true);
    setFeedback(null);

    const payload = {
      tutor: guardian.trim(),
      alumno: student.trim(),
      edad: age,
      telefono: phone.trim(),
      email: email.trim(),
      horario: schedule,
      cupon: couponApplied ? couponInput.trim() : "",
    };

    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.whatsappUrl) {
        setFeedback(data.error || "No se pudo enviar la inscripción.");
        setSubmitting(false);
        return;
      }
      if (!data.saved) {
        setFeedback(
          "Abrimos WhatsApp para completar la inscripción. La planilla se sincroniza cuando Sheets esté conectado."
        );
      }
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch {
      setFeedback("Hubo un problema de conexión. Probá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>

      <div className="mb-7">
        <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
          Inscripción
        </h1>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
          Completá los datos. Guardamos la solicitud y coordinamos el resto por
          WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          label="Nombre completo del tutor/a"
          htmlFor="guardian"
          error={errors.guardian}
        >
          <Input
            id="guardian"
            className={fieldClass}
            value={guardian}
            onChange={(e) => setGuardian(e.target.value)}
            placeholder="Ej. María González"
            autoComplete="name"
          />
        </Field>

        <Field
          label="Nombre completo del alumno/a"
          htmlFor="student"
          error={errors.student}
        >
          <Input
            id="student"
            className={fieldClass}
            value={student}
            onChange={(e) => setStudent(e.target.value)}
            placeholder="Ej. Lucía González"
          />
        </Field>

        <Field label="Edad del alumno/a" error={errors.age}>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAge(a)}
                aria-pressed={age === a}
                className={cn(
                  "h-11 w-11 rounded-xl border text-sm font-medium transition-colors",
                  age === a
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-transparent text-foreground hover:border-primary/50 hover:bg-accent"
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Teléfono" htmlFor="phone" error={errors.phone}>
          <Input
            id="phone"
            className={fieldClass}
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. 3549 123456"
            autoComplete="tel"
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            className={fieldClass}
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej. maria@email.com"
            autoComplete="email"
          />
        </Field>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Valor de la inscripción
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            {pricing.offerEnabled || couponApplied ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatArs(listPrice)}
              </span>
            ) : null}
            <span className="font-serif text-3xl font-semibold tracking-tight">
              {formatArs(currentTotal)}
            </span>
          </div>
          {pricing.offerEnabled && !couponApplied ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {pricing.offerLabel || "Oferta"}: {formatArs(salePrice)}
            </p>
          ) : null}
          {couponApplied ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Cupón {COUPON_DISCOUNT_PERCENT}% aplicado sobre{" "}
              {formatArs(salePrice)}.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Precio en pesos argentinos. Coordinamos el pago por WhatsApp.
            </p>
          )}

          {couponEnabled ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input
                className={fieldClass}
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  setCouponApplied(false);
                  setErrors((prev) => ({ ...prev, coupon: undefined }));
                }}
                placeholder="Código de cupón"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl"
                disabled={couponChecking || !couponInput.trim()}
                onClick={async () => {
                  setCouponChecking(true);
                  setErrors((prev) => ({ ...prev, coupon: undefined }));
                  try {
                    const res = await fetch("/api/cupon", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ code: couponInput }),
                    });
                    const data = await res.json();
                    if (data.valid) {
                      setCouponApplied(true);
                    } else {
                      setCouponApplied(false);
                      setErrors((prev) => ({
                        ...prev,
                        coupon: "El código no es válido.",
                      }));
                    }
                  } catch {
                    setErrors((prev) => ({
                      ...prev,
                      coupon: "No se pudo validar el cupón.",
                    }));
                  } finally {
                    setCouponChecking(false);
                  }
                }}
              >
                {couponChecking ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>
          ) : null}
          {errors.coupon ? (
            <p className="mt-1 text-xs text-destructive">{errors.coupon}</p>
          ) : null}
        </div>

        <Field label="Horario disponible" error={errors.schedule}>
          <p className="mb-2 text-xs text-muted-foreground">
            El curso dura 2 horas. Elegí un turno. Los cupos se leen de la
            planilla.
          </p>
          {loadingCupos ? (
            <FormScheduleSkeleton />
          ) : (
            <RadioGroup
              value={schedule}
              onValueChange={(value) => setSchedule(value as Schedule)}
              className="grid grid-cols-2 gap-3"
            >
              {(Object.keys(SCHEDULE_LABELS) as Schedule[]).map((key) => {
                const slot = occupancy?.[key];
                const full = slot ? slot.disponibles <= 0 : false;
                const time =
                  key === "manana"
                    ? config?.horario_manana
                    : config?.horario_tarde;
                return (
                  <Label
                    key={key}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors",
                      schedule === key
                        ? "border-primary bg-accent"
                        : "border-input hover:bg-accent/60",
                      full && "opacity-50"
                    )}
                  >
                    <RadioGroupItem value={key} disabled={full} />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium">
                        {SCHEDULE_LABELS[key]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {time || (key === "manana" ? "Por la mañana" : "Por la tarde")}
                      </span>
                      <span className="text-xs font-medium text-foreground/80">
                        {full
                          ? "Sin cupos"
                          : slot
                            ? `${slot.disponibles} de ${slot.max} cupos`
                            : "Cupos a confirmar"}
                      </span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          )}
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-2 h-12 rounded-xl text-base"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Enviar por WhatsApp
        </Button>
        {feedback ? (
          <p className="text-center text-xs text-muted-foreground">{feedback}</p>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            Se abre WhatsApp con tus datos para finalizar la inscripción.
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
