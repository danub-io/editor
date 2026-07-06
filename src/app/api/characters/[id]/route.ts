export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { characters } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth/check-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb(process.env as Record<string, unknown>);
    const body = (await req.json()) as any as Record<string, any>;
    const now = new Date().toISOString();
    const updates: Record<string, any> = { updatedAt: now };
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.physicalTraits !== undefined) updates.physicalTraits = body.physicalTraits;
    if (body.personality !== undefined) updates.personality = body.personality;
    if (body.motivations !== undefined) updates.motivations = body.motivations;
    if (body.relationships !== undefined) updates.relationships = JSON.stringify(body.relationships);
    await db.update(characters).set(updates).where(eq(characters.id, id));
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
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = getDb(process.env as Record<string, unknown>);
    await db.delete(characters).where(eq(characters.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
