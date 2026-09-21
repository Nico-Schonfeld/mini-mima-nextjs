import { NextResponse } from "next/server";

import { AGES, type Schedule } from "@/lib/config";
import { isValidCoupon, payableAmount } from "@/lib/pricing";
import { createInscription, isSheetsConfigured, listInscriptions } from "@/lib/sheets";
import { readSiteContent } from "@/lib/site-content-server";
import type { RegistrationPayload } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function isSchedule(value: unknown): value is Schedule {
  return value === "manana" || value === "tarde";
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<RegistrationPayload>;
  const tutor = String(body.tutor ?? "").trim();
  const alumno = String(body.alumno ?? "").trim();
  const telefono = String(body.telefono ?? "").trim();
  const email = String(body.email ?? "").trim();
  const edad = Number(body.edad);
  const horario = body.horario;
  const cupon = String(body.cupon ?? "").trim();

  if (
    !tutor ||
    !alumno ||
    !telefono ||
    !email ||
    !AGES.includes(edad as (typeof AGES)[number]) ||
    !isSchedule(horario)
  ) {
    return NextResponse.json(
      { ok: false, error: "Datos incompletos o inválidos." },
      { status: 400 }
    );
  }

  const payload: RegistrationPayload = {
    tutor,
    alumno,
    edad,
    telefono,
    email,
    horario,
    cupon,
  };

  const content = await readSiteContent();
  const couponValid = isValidCoupon(cupon);
  const total = payableAmount(content.pricing, couponValid);

  let scheduleTime = "";
  try {
    if (isSheetsConfigured()) {
      const sheets = await listInscriptions();
      scheduleTime = String(
        horario === "manana"
          ? sheets.config?.horario_manana ?? ""
          : sheets.config?.horario_tarde ?? ""
      );
    }
  } catch {
    scheduleTime = "";
  }

  const whatsappUrl = buildWhatsAppUrl(payload, {
    scheduleTime,
    pricing: content.pricing,
    couponValid,
    total,
  });

  if (!isSheetsConfigured()) {
    return NextResponse.json({
      ok: true,
      saved: false,
      whatsappUrl,
    });
  }

  try {
    const created = await createInscription(payload);
    return NextResponse.json({
      ok: true,
      saved: true,
      id: created.id,
      whatsappUrl,
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      saved: false,
      whatsappUrl,
      error: error instanceof Error ? error.message : "No se pudo guardar.",
    });
  }
}
