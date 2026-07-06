export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { timelineEvents } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth/check-auth";

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
    const rows = await db.select().from(timelineEvents).where(eq(timelineEvents.projectId, id)).all();
    return NextResponse.json(rows.map((r: any) => ({ ...r, characterIds: JSON.parse(r.characterIds || "[]") })));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
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
    const eventId = generateId();
    const title = typeof body.title === 'string' ? body.title : 'Untitled';
    await db.insert(timelineEvents).values({
      id: eventId,
      projectId: id,
      title,
      description: body.description ? String(body.description) : null,
      date: body.date ? String(body.date) : null,
      chapterId: body.chapterId ? String(body.chapterId) : null,
      characterIds: JSON.stringify(Array.isArray(body.characterIds) ? body.characterIds : []),
      locationId: body.locationId ? String(body.locationId) : null,
      order: typeof body.order === 'number' ? body.order : 0,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: eventId, projectId: id, title, createdAt: now, updatedAt: now });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
