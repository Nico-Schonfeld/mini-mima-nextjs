import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteBlobUrl,
  hasBlobStore,
  isBlobUrl,
  isVercelHost,
  putImageBlob,
  vercelWriteError,
} from "@/lib/blob-store";

export const runtime = "nodejs";

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

function fail(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  console.error(error);
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

async function removeUpload(url: string) {
  if (!url) return;
  if (isBlobUrl(url)) {
    if (hasBlobStore()) await deleteBlobUrl(url);
    return;
  }
  const filePath = resolveUploadPath(url);
  if (filePath) await unlink(filePath).catch(() => null);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
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
    if (previous) await removeUpload(previous);

    const buffer = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(buffer).rotate().webp({ quality: 82 }).toBuffer();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

    if (hasBlobStore()) {
      const url = await putImageBlob(name, webp);
      return NextResponse.json({ ok: true, url });
    }

    if (isVercelHost()) {
      throw vercelWriteError();
    }

    const folder = path.join(process.cwd(), "public", "uploads");
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, name), webp);
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (error) {
    return fail(error, "No se pudo subir la imagen.");
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { url?: string };
    const url = String(body.url ?? "");
    if (!url.startsWith("/uploads/") && !isBlobUrl(url)) {
      return NextResponse.json(
        { ok: false, error: "Ruta de imagen inválida." },
        { status: 400 }
      );
    }
    await removeUpload(url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, "No se pudo eliminar la imagen.");
  }
}
