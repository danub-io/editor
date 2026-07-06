export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { timelineEvents } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth/check-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const authResult = await checkAuth(req);
    if (authResult.error) return authResult.error;

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await req.json()) as any as Record<string, any>;
    const now = new Date().toISOString();
    const updates: Record<string, any> = { updatedAt: now };
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.date !== undefined) updates.date = body.date;
    if (body.characterIds !== undefined) updates.characterIds = JSON.stringify(body.characterIds);
    if (body.order !== undefined) updates.order = body.order;
    await db.update(timelineEvents).set(updates).where(eq(timelineEvents.id, id));
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
    const authResult = await checkAuth(req);
    if (authResult.error) return authResult.error;

    const db = getDb(process.env as Record<string, unknown>);
    await db.delete(timelineEvents).where(eq(timelineEvents.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
