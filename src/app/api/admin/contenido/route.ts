import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { readSiteContent, writeSiteContent } from "@/lib/site-content-server";
import type { SiteContent } from "@/lib/site-content";

export const runtime = "nodejs";

function fail(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  console.error(error);
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const content = await readSiteContent();
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    return fail(error, "No se pudo cargar el contenido del sitio.");
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const content = (await request.json()) as SiteContent;
    if (!content?.hero?.title || !content?.brand?.name) {
      return NextResponse.json(
        { ok: false, error: "El contenido de la landing está incompleto." },
        { status: 400 }
      );
    }
    const saved = await writeSiteContent(content);
    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    return fail(error, "No se pudo guardar el contenido del sitio.");
  }
}
