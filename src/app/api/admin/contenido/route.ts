import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { readSiteContent, writeSiteContent } from "@/lib/site-content-server";
import type { SiteContent } from "@/lib/site-content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const content = await readSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const content = (await request.json()) as SiteContent;
  if (!content?.hero?.title || !content?.brand?.name) {
    return NextResponse.json(
      { ok: false, error: "El contenido de la landing está incompleto." },
      { status: 400 }
    );
  }
  const saved = await writeSiteContent(content);
  return NextResponse.json({ ok: true, content: saved });
}
