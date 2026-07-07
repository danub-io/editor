export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/check-auth";
import { getDb } from "@gospelreads/db";
import { locations } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

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
    const rows = await db.select().from(locations).where(eq(locations.projectId, id)).all();
    return NextResponse.json(rows);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

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
    const locId = generateId();
    const name = typeof body.name === 'string' ? body.name : 'Sem nome';
    const type = typeof body.type === 'string' ? body.type : 'other';

    await db.insert(locations).values({
      id: locId,
      projectId: id,
      name,
      description: body.description ? String(body.description) : null,
      type,
      imageUrl: body.imageUrl ? String(body.imageUrl) : null,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: locId, projectId: id, name, type, createdAt: now, updatedAt: now });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
