import { NextRequest, NextResponse } from "next/server";
import { verifyCloudflareToken } from "./cloudflare";

export async function requireAuth(req: NextRequest) {
  const user = await verifyCloudflareToken(req);
  if (user) {
    return null; // Authenticated via CF Access
  }

  const apiSecret = process.env.API_SECRET;
  if (!apiSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authHeader = req.headers.get("authorization");
  const apiKeyHeader = req.headers.get("x-api-key");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

  if (token !== apiSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // Authenticated via API_SECRET
}
