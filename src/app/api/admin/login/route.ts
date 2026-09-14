import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  validateAdminCredentials,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "El administrador todavía no está configurado." },
      { status: 500 }
    );
  }

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json(
      { ok: false, error: "Email o contraseña incorrectos." },
      { status: 401 }
    );
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions());
  return NextResponse.json({ ok: true });
}
