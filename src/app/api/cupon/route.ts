import { NextResponse } from "next/server";

import { isValidCoupon } from "@/lib/pricing";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const valid = isValidCoupon(String(body?.code ?? ""));
  return NextResponse.json({
    ok: true,
    valid,
    discountPercent: valid ? 10 : 0,
  });
}
