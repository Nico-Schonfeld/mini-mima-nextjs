import { del, list, put } from "@vercel/blob";

const SITE_CONTENT_BLOB = "data/site-content.json";

function blobAuth() {
  const storeId =
    process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN_STORE_ID;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  return {
    ...(storeId ? { storeId } : {}),
    ...(token ? { token } : {}),
  };
}

export function hasBlobStore() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.BLOB_READ_WRITE_TOKEN_STORE_ID
  );
}

export function isVercelHost() {
  return Boolean(process.env.VERCEL);
}

export function vercelWriteError() {
  return new Error(
    "En Vercel no se pueden guardar archivos en el disco. Creá un Blob Store en el dashboard (Storage → Create Database → Blob), conectalo a este proyecto y volvé a desplegar."
  );
}

export function isBlobUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return host.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function putSiteContentBlob(json: string) {
  await put(SITE_CONTENT_BLOB, json, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json; charset=utf-8",
    ...blobAuth(),
  });
}

export async function readSiteContentBlob() {
  const { blobs } = await list({
    prefix: SITE_CONTENT_BLOB,
    limit: 20,
    ...blobAuth(),
  });
  const match =
    blobs.find((blob) => blob.pathname === SITE_CONTENT_BLOB) ?? blobs[0];
  if (!match) return null;
  const res = await fetch(match.url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.text();
}

export async function putImageBlob(name: string, body: Buffer) {
  const blob = await put(`uploads/${name}`, body, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/webp",
    ...blobAuth(),
  });
  return blob.url;
}

export async function deleteBlobUrl(url: string) {
  await del(url, blobAuth());
}
