import { NextRequest, NextResponse } from "next/server";
import { verifyCloudflareToken } from "@/lib/auth/cloudflare";

export async function checkAuth(req: NextRequest) {
  const user = await verifyCloudflareToken(req);
  if (!user) {
    const apiSecret = process.env.API_SECRET;
    if (apiSecret) {
      const authHeader = req.headers.get("authorization");
      const apiKeyHeader = req.headers.get("x-api-key");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

      if (token !== apiSecret) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
      }
    } else {
       return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
  }
  return { user };
}
