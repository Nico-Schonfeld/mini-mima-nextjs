import { NextResponse } from "next/server";

import { isCouponConfigured } from "@/lib/pricing";
import { readSiteContent } from "@/lib/site-content-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readSiteContent();
  return NextResponse.json(
    {
      ok: true,
      pricing: content.pricing,
      couponEnabled: isCouponConfigured(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
