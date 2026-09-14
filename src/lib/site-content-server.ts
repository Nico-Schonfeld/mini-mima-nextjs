import { readFile, writeFile } from "fs/promises";
import path from "path";

import {
  hasBlobStore,
  isVercelHost,
  putSiteContentBlob,
  readSiteContentBlob,
  vercelWriteError,
} from "@/lib/blob-store";
import { withSiteContentDefaults, type SiteContent } from "@/lib/site-content";

const FILE = path.join(process.cwd(), "data", "site-content.json");

async function readLocalSiteContent() {
  const raw = await readFile(FILE, "utf8");
  return withSiteContentDefaults(JSON.parse(raw));
}

export async function readSiteContent(): Promise<SiteContent> {
  if (hasBlobStore()) {
    try {
      const fromBlob = await readSiteContentBlob();
      if (fromBlob) {
        return withSiteContentDefaults(JSON.parse(fromBlob));
      }
    } catch (error) {
      console.error(error);
    }
  }
  return readLocalSiteContent();
}

export async function writeSiteContent(content: SiteContent) {
  const normalized = withSiteContentDefaults(content);
  const json = `${JSON.stringify(normalized, null, 2)}\n`;

  if (hasBlobStore()) {
    await putSiteContentBlob(json);
    return normalized;
  }

  if (isVercelHost()) {
    throw vercelWriteError();
  }

  await writeFile(FILE, json, "utf8");
  return normalized;
}
