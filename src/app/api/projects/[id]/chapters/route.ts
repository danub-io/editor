export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { chapters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { verifyCloudflareToken } from "@/lib/auth/cloudflare";
import { generateId } from "@/lib/utils";

// GET /api/projects/[id]/chapters
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.substring(7)
          : apiKeyHeader;

        if (token !== apiSecret) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb(process.env as Record<string, unknown>);
    const rows = await db
      .select()
      .from(chapters)
      .where(eq(chapters.projectId, id))
      .all();
    return NextResponse.json(
      rows.map((r: any) => ({
        ...r,
        tags: JSON.parse(r.tags || "[]"),
        type: r.type || "chapter",
      })),
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/chapters
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.substring(7)
          : apiKeyHeader;

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
    const chapterId = generateId();

    await db.insert(chapters).values({
      id: chapterId,
      projectId: id,
      type: body.type || "chapter",
      subType: body.subType || null,
      partId: body.partId || null,
      number: body.number || 1,
      title: body.title,
      content: body.content || "",
      wordCount: body.wordCount || 0,
      tags: JSON.stringify(body.tags || []),
      status: body.status || "draft",
      notes: body.notes || null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      id: chapterId,
      projectId: id,
      type: body.type || "chapter",
      subType: body.subType || null,
      partId: body.partId || null,
      title: body.title,
      number: body.number || 1,
      status: body.status || "draft",
      content: body.content || "",
      wordCount: body.wordCount || 0,
      tags: body.tags || [],
      createdAt: now,
      updatedAt: now,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
