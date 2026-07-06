export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { characters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { verifyCloudflareToken } from "@/lib/auth/cloudflare";
import { generateId } from "@/lib/utils";

// GET /api/projects/[id]/characters
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
      .from(characters)
      .where(eq(characters.projectId, id))
      .all();
    return NextResponse.json(
      rows.map((r: any) => ({
        ...r,
        relationships: JSON.parse(r.relationships || "[]"),
      })),
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/[id]/characters
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
    const charId = generateId();

    await db.insert(characters).values({
      id: charId,
      projectId: id,
      name: body.name,
      description: body.description || null,
      physicalTraits: body.physicalTraits || null,
      personality: body.personality || null,
      motivations: body.motivations || null,
      relationships: JSON.stringify(body.relationships || []),
      imageUrl: body.imageUrl || null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      id: charId,
      projectId: id,
      name: body.name,
      description: body.description,
      personality: body.personality,
      relationships: body.relationships || [],
      createdAt: now,
      updatedAt: now,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
