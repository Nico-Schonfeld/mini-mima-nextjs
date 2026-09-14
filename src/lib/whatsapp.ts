import { SCHEDULE_LABELS, WHATSAPP_NUMBER } from "@/lib/config";
import type { RegistrationPayload } from "@/lib/types";

export function buildWhatsAppMessage(
  data: RegistrationPayload,
  scheduleTime = ""
) {
  const horario = scheduleTime
    ? `${SCHEDULE_LABELS[data.horario]} (${scheduleTime})`
    : `${SCHEDULE_LABELS[data.horario]} (2 horas)`;

  return [
    "¡Hola! Quiero inscribir al curso MiniMima! 🧵",
    "",
    `Tutor/a: ${data.tutor}`,
    `Alumno/a: ${data.alumno}`,
    `Edad: ${data.edad} años`,
    `Teléfono: ${data.telefono}`,
    `Email: ${data.email}`,
    `Horario preferido: ${horario}`,
  ].join("\n");
}

export function buildWhatsAppUrl(data: RegistrationPayload, scheduleTime = "") {
  const message = buildWhatsAppMessage(data, scheduleTime);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
