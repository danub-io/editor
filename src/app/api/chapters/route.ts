export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { chapters } from "@gospelreads/db";
import { checkAuth } from "@/lib/auth/check-auth";
import { chapterSchema } from "@/lib/validations/project";
import { generateId } from "@/lib/utils";
import { z } from "zod";

const createChapterSchema = chapterSchema.extend({
  projectId: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await checkAuth(req);
    if (authError) return authError;

    const db = getDb(process.env as Record<string, unknown>);
    const rawBody = await req.json();

    const parsedBody = createChapterSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Validation error", details: parsedBody.error.format() }, { status: 400 });
    }

    const body = parsedBody.data;
    const now = new Date().toISOString();
    const id = generateId();

    await db.insert(chapters).values({
      id,
      projectId: body.projectId,
      type: "chapter",
      number: body.number || 1,
      title: body.title || "Novo Capítulo",
      content: body.content || "",
      wordCount: body.wordCount || 0,
      tags: JSON.stringify(body.tags || []),
      status: body.status || "draft",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id, ...body, createdAt: now, updatedAt: now });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
