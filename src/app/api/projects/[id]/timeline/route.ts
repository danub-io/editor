export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { timelineEvents } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { verifyCloudflareToken } from "@/lib/auth/cloudflare";

export async function GET(
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
    const rows = await db.select().from(timelineEvents).where(eq(timelineEvents.projectId, id)).all();
    return NextResponse.json(rows.map((r: any) => ({ ...r, characterIds: JSON.parse(r.characterIds || "[]") })));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
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
    const eventId = generateId();
    await db.insert(timelineEvents).values({
      id: eventId,
      projectId: id,
      title: body.title,
      description: body.description || null,
      date: body.date || null,
      chapterId: body.chapterId || null,
      characterIds: JSON.stringify(body.characterIds || []),
      locationId: body.locationId || null,
      order: body.order || 0,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: eventId, projectId: id, title: body.title, createdAt: now, updatedAt: now });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
