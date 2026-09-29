import type { Metadata } from "next";

import { LandingPage } from "@/components/landing/landing-page";
import { readSiteContent } from "@/lib/site-content-server";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await readSiteContent();
  return <LandingPage content={content} />;
}
