import { SCHEDULE_LABELS, WHATSAPP_NUMBER } from "@/lib/config";
import { formatArs } from "@/lib/pricing";
import type { SitePricing } from "@/lib/site-content";
import type { RegistrationPayload } from "@/lib/types";

export function buildWhatsAppMessage(
  data: RegistrationPayload,
  extras?: {
    scheduleTime?: string;
    pricing?: SitePricing;
    couponValid?: boolean;
    total?: number;
  }
) {
  const scheduleTime = extras?.scheduleTime ?? "";
  const horario = scheduleTime
    ? `${SCHEDULE_LABELS[data.horario]} (${scheduleTime})`
    : `${SCHEDULE_LABELS[data.horario]} (2 horas)`;

  const lines = [
    "¡Hola! Quiero inscribir al curso MiniMima! 🧵",
    "",
    `Tutor/a: ${data.tutor}`,
    `Alumno/a: ${data.alumno}`,
    `Edad: ${data.edad} años`,
    `Teléfono: ${data.telefono}`,
    `Email: ${data.email}`,
    `Horario preferido: ${horario}`,
  ];

  if (extras?.pricing) {
    lines.push(`Valor: ${formatArs(extras.pricing.amount)}`);
    if (extras.pricing.offerEnabled) {
      const label = extras.pricing.offerLabel || "Oferta";
      lines.push(`${label}: ${formatArs(extras.pricing.offerAmount)}`);
    }
    if (extras.couponValid) {
      lines.push("Cupón 10%: aplicado");
    }
    if (typeof extras.total === "number") {
      lines.push(`Total a abonar: ${formatArs(extras.total)}`);
    }
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  data: RegistrationPayload,
  extras?: {
    scheduleTime?: string;
    pricing?: SitePricing;
    couponValid?: boolean;
    total?: number;
  }
) {
  const message = buildWhatsAppMessage(data, extras);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
