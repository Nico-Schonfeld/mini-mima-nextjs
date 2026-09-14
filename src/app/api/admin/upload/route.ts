import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { isAdminAuthenticated } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function resolveUploadPath(url: string) {
  if (!url.startsWith("/uploads/")) return null;
  const name = path.basename(url);
  if (!name || name !== url.slice("/uploads/".length)) return null;
  return path.join(process.cwd(), "public", "uploads", name);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Falta el archivo." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { ok: false, error: "Formato no soportado. Usá JPG, PNG o WebP." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "La imagen no puede superar 8 MB." },
      { status: 400 }
    );
  }

  const previous = String(form.get("replace") ?? "");
  if (previous) {
    const previousPath = resolveUploadPath(previous);
    if (previousPath) {
      await unlink(previousPath).catch(() => null);
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(buffer).rotate().webp({ quality: 82 }).toBuffer();
  const folder = path.join(process.cwd(), "public", "uploads");
  await mkdir(folder, { recursive: true });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  await writeFile(path.join(folder, name), webp);

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { url?: string };
  const filePath = resolveUploadPath(String(body.url ?? ""));
  if (!filePath) {
    return NextResponse.json(
      { ok: false, error: "Ruta de imagen inválida." },
      { status: 400 }
    );
  }

  await unlink(filePath).catch(() => null);
  return NextResponse.json({ ok: true });
}
