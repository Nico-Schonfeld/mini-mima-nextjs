import type { Schedule, StudentStatus } from "@/lib/config";

export type Inscription = {
  id: string;
  createdAt: string;
  tutor: string;
  alumno: string;
  edad: number | string;
  telefono: string;
  email: string;
  horario: Schedule | string;
  estado: StudentStatus | string;
  nota: string;
  updatedAt: string;
};

export type OccupancySlot = {
  max: number;
  ocupados: number;
  disponibles: number;
};

export type Occupancy = {
  manana: OccupancySlot;
  tarde: OccupancySlot;
};

export type CourseConfig = {
  cupos_manana: string;
  cupos_tarde: string;
  horario_manana: string;
  horario_tarde: string;
};

export type SheetsListResponse = {
  ok: boolean;
  inscriptions: Inscription[];
  config: CourseConfig & Record<string, string>;
  occupancy: Occupancy;
  error?: string;
};

export type RegistrationPayload = {
  tutor: string;
  alumno: string;
  edad: number;
  telefono: string;
  email: string;
  horario: Schedule;
};
