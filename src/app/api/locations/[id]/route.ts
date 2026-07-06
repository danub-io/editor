export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { locations } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { verifyCloudflareToken } from "@/lib/auth/cloudflare";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const user = await verifyCloudflareToken(req);
    // If not authenticated via CF Access, fallback to API_SECRET for backward compatibility/local dev
    if (!user) {
      const apiSecret = process.env.API_SECRET;
      if (apiSecret) {
        const authHeader = req.headers.get("authorization");
        const apiKeyHeader = req.headers.get("x-api-key");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

        if (token !== apiSecret) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await req.json()) as any as Record<string, any>;
    const now = new Date().toISOString();
    const updates: Record<string, any> = { updatedAt: now };
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.type !== undefined) updates.type = body.type;
    await db.update(locations).set(updates).where(eq(locations.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const user = await verifyCloudflareToken(req);
    // If not authenticated via CF Access, fallback to API_SECRET for backward compatibility/local dev
    if (!user) {
      const apiSecret = process.env.API_SECRET;
      if (apiSecret) {
        const authHeader = req.headers.get("authorization");
        const apiKeyHeader = req.headers.get("x-api-key");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

        if (token !== apiSecret) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb(process.env as Record<string, unknown>);
    await db.delete(locations).where(eq(locations.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
