import { NextResponse } from "next/server";

import { computeOccupancy } from "@/lib/occupancy";
import { isSheetsConfigured, listInscriptions } from "@/lib/sheets";

export async function GET() {
  if (!isSheetsConfigured()) {
    return NextResponse.json({
      ok: true,
      configured: false,
      occupancy: {
        manana: { max: 8, ocupados: 0, disponibles: 8 },
        tarde: { max: 8, ocupados: 0, disponibles: 8 },
      },
      config: {
        cupos_manana: "8",
        cupos_tarde: "8",
        horario_manana: "10:00 a 12:00",
        horario_tarde: "16:00 a 18:00",
      },
    });
  }

  try {
    const data = await listInscriptions();
    return NextResponse.json({
      ok: true,
      configured: true,
      occupancy: computeOccupancy(data.inscriptions ?? [], data.config),
      config: data.config,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudieron leer los cupos.",
      },
      { status: 502 }
    );
  }
}
