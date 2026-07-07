export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth/check-auth";
import { getDb } from "@gospelreads/db";
import { locations } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { checkAuth } from "@/lib/auth/check-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb(process.env as Record<string, unknown>);
    const rows = await db.select().from(locations).where(eq(locations.projectId, id)).all();
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await checkAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await req.json()) as any as Record<string, any>;
    const now = new Date().toISOString();
    const locId = generateId();
    await db.insert(locations).values({
      id: locId,
      projectId: id,
      name: body.name,
      description: body.description || null,
      type: body.type || "other",
      imageUrl: body.imageUrl || null,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ id: locId, projectId: id, name: body.name, type: body.type || "other", createdAt: now, updatedAt: now });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
