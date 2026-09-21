import type {
  CourseConfig,
  Inscription,
  Occupancy,
  RegistrationPayload,
  SheetsListResponse,
} from "@/lib/types";

function webhookUrl() {
  return process.env.SHEETS_WEBHOOK ?? "";
}

function webhookSecret() {
  return process.env.SHEETS_SECRET ?? "";
}

export function isSheetsConfigured() {
  return Boolean(webhookUrl() && webhookSecret());
}

async function parseJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text) as Record<string, unknown> & { ok?: boolean; error?: string };
  } catch {
    const looksLikeGoogleLogin =
      text.includes("accounts.google.com") || text.includes("<!doctype html");
    if (looksLikeGoogleLogin) {
      throw new Error(
        "Google pide inicio de sesión. En Apps Script: Implementar → Administrar implementaciones → editar → Quién tiene acceso: Cualquier persona (no Solo yo ni Cualquier usuario de Google)."
      );
    }
    throw new Error("La planilla no devolvió JSON válido. Revisá la URL /exec.");
  }
}

async function sheetsGet(action: "list" | "config") {
  if (!isSheetsConfigured()) {
    throw new Error("Google Sheets no está configurado.");
  }
  const url = new URL(webhookUrl());
  url.searchParams.set("action", action);
  url.searchParams.set("secret", webhookSecret());
  const res = await fetch(url.toString(), { cache: "no-store", redirect: "follow" });
  const data = await parseJson(res);
  if (!data.ok) throw new Error(data.error || "No se pudo leer la planilla.");
  return data as unknown as SheetsListResponse;
}

async function sheetsPost(payload: Record<string, unknown>) {
  if (!isSheetsConfigured()) {
    throw new Error("Google Sheets no está configurado.");
  }
  const res = await fetch(webhookUrl(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret: webhookSecret(), ...payload }),
    redirect: "follow",
    cache: "no-store",
  });
  const data = await parseJson(res);
  if (!data.ok) throw new Error(data.error || "No se pudo escribir en la planilla.");
  return data;
}

export async function listInscriptions() {
  return sheetsGet("list");
}

export async function getCourseConfig() {
  return sheetsGet("config");
}

export async function createInscription(payload: RegistrationPayload) {
  const { cupon: _cupon, ...sheetPayload } = payload;
  const data = await sheetsPost({
    action: "create",
    ...sheetPayload,
    estado: "pendiente",
  });
  return { id: String(data.id ?? "") };
}

export async function updateInscription(
  id: string,
  patch: Partial<Inscription>
) {
  return sheetsPost({ action: "update", id, ...patch });
}

export async function deleteInscription(id: string) {
  return sheetsPost({ action: "delete", id });
}

export async function updateCourseConfig(config: Partial<CourseConfig>) {
  return sheetsPost({ action: "updateConfig", config }) as Promise<{
    ok: boolean;
    config: CourseConfig & Record<string, string>;
    occupancy: Occupancy;
  }>;
}
