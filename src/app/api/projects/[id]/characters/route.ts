export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/check-auth";
import { getDb } from "@gospelreads/db";
import { characters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth/check-auth";

import { generateId } from "@/lib/utils";
import { checkAuth } from "@/lib/auth/check-auth";

// GET /api/projects/[id]/characters
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      }))
    );
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// POST /api/projects/[id]/characters
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await request.json()) as any as Record<string, any>;
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
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
