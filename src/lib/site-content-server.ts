import { readFile, writeFile } from "fs/promises";
import path from "path";

import { withSiteContentDefaults, type SiteContent } from "@/lib/site-content";

const FILE = path.join(process.cwd(), "data", "site-content.json");

export async function readSiteContent(): Promise<SiteContent> {
  const raw = await readFile(FILE, "utf8");
  return withSiteContentDefaults(JSON.parse(raw));
}

export async function writeSiteContent(content: SiteContent) {
  const normalized = withSiteContentDefaults(content);
  await writeFile(FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return normalized;
}
