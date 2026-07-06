export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { chapters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { chapterSchema } from "@/lib/validations/project";
import { checkAuth } from "@/lib/auth/check-auth";

// PUT /api/chapters/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb(process.env as Record<string, unknown>);
    const rawBody = await req.json();

    const parsedBody = chapterSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Validation error", details: parsedBody.error.format() }, { status: 400 });
    }

    const body = parsedBody.data;
    const now = new Date().toISOString();
    const updates: Record<string, any> = { updatedAt: now };

    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;
    if (body.number !== undefined) updates.number = body.number;
    if (body.wordCount !== undefined) updates.wordCount = body.wordCount;
    if (body.status !== undefined) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.tags !== undefined) updates.tags = JSON.stringify(body.tags);

    await db.update(chapters).set(updates).where(eq(chapters.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/chapters/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const user = await checkAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb(process.env as Record<string, unknown>);
    await db.delete(chapters).where(eq(chapters.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
