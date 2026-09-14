export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493549535137";

export type Schedule = "manana" | "tarde";

export const SCHEDULE_LABELS: Record<Schedule, string> = {
  manana: "Mañana",
  tarde: "Tarde",
};

export const AGES = [8, 9, 10, 11, 12, 13, 14] as const;

export const STUDENT_STATUSES = [
  "pendiente",
  "abonado",
  "confirmado",
  "baja",
] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export const STATUS_LABELS: Record<StudentStatus, string> = {
  pendiente: "Pendiente",
  abonado: "Abonado",
  confirmado: "Confirmado",
  baja: "Baja",
};

export const SITE = {
  name: "MiniMima!",
  tagline: "couture",
  whatsappDisplay: "+54 9 3549 535137",
};
