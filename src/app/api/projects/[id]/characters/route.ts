export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/check-auth";
import { getDb } from "@gospelreads/db";
import { characters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { generateId } from "@/lib/utils";

// GET /api/projects/[id]/characters
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await checkAuth(request);
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
      rows.map((r: InferSelectModel<typeof characters> & { relationships?: string }) => ({
        ...r,
        relationships: JSON.parse(r.relationships || "[]"),
      }))
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/projects/[id]/characters
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await request.json()) as Record<string, unknown>;
    const now = new Date().toISOString();
    const charId = generateId();

    const name = typeof body.name === 'string' ? body.name : 'Sem nome';

    await db.insert(characters).values({
      id: charId,
      projectId: id,
      name,
      description: body.description ? String(body.description) : null,
      physicalTraits: body.physicalTraits ? String(body.physicalTraits) : null,
      personality: body.personality ? String(body.personality) : null,
      motivations: body.motivations ? String(body.motivations) : null,
      relationships: JSON.stringify(Array.isArray(body.relationships) ? body.relationships : []),
      imageUrl: body.imageUrl ? String(body.imageUrl) : null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      id: charId,
      projectId: id,
      name,
      description: body.description,
      personality: body.personality,
      relationships: body.relationships || [],
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
