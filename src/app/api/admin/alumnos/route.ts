import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { computeOccupancy } from "@/lib/occupancy";
import { isSheetsConfigured, listInscriptions } from "@/lib/sheets";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Google Sheets no está configurado." },
      { status: 503 }
    );
  }
  try {
    const data = await listInscriptions();
    return NextResponse.json({
      ...data,
      occupancy: computeOccupancy(data.inscriptions ?? [], data.config),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo leer la planilla.",
      },
      { status: 502 }
    );
  }
}
