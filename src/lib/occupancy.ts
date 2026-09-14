import type { CourseConfig, Inscription, Occupancy } from "@/lib/types";

function slot(max: number, ocupados: number) {
  return {
    max,
    ocupados,
    disponibles: Math.max(0, max - ocupados),
  };
}

export function computeOccupancy(
  inscriptions: Inscription[] = [],
  config?: Partial<CourseConfig> | null
): Occupancy {
  const maxManana = Number(config?.cupos_manana || 8);
  const maxTarde = Number(config?.cupos_tarde || 8);
  const active = inscriptions.filter(
    (item) => String(item.estado).trim().toLowerCase() !== "baja"
  );
  const ocupManana = active.filter(
    (item) => String(item.horario).trim().toLowerCase() === "manana"
  ).length;
  const ocupTarde = active.filter(
    (item) => String(item.horario).trim().toLowerCase() === "tarde"
  ).length;

  return {
    manana: slot(maxManana, ocupManana),
    tarde: slot(maxTarde, ocupTarde),
  };
}
