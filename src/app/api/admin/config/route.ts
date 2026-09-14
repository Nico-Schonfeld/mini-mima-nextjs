import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { computeOccupancy } from "@/lib/occupancy";
import { listInscriptions, updateCourseConfig } from "@/lib/sheets";

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const config = await request.json();
  try {
    await updateCourseConfig(config);
    const data = await listInscriptions();
    const merged = { ...data.config, ...config };
    return NextResponse.json({
      ok: true,
      config: merged,
      occupancy: computeOccupancy(data.inscriptions ?? [], merged),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "No se pudo guardar la configuración.",
      },
      { status: 502 }
    );
  }
}
