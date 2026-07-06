export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@gospelreads/db";
import { projects } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { checkAuth } from "@/lib/auth/check-auth";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  const db = getDb(process.env as Record<string, unknown>);

  try {
    const user = await checkAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 5MB" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `covers/${id}_${Date.now()}.${ext}`;

    // Try R2 first, fall back to data URL for local dev
    let coverUrl: string;
    try {
      const { env } = getRequestContext();
      if (env.STORAGE) {
        await env.STORAGE.put(key, buffer, {
          httpMetadata: { contentType: file.type },
        });
        coverUrl = key; // R2 key — resolved via Worker binding
      } else {
        throw new Error("R2 not available");
      }
    } catch {
      // Fallback for local dev: store as base64 data URL in DB
      const base64 = Buffer.from(buffer).toString("base64");
      coverUrl = `data:${file.type};base64,${base64}`;
    }

    await db
      .update(projects)
      .set({
        coverImage: coverUrl,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(projects.id, id));

    return NextResponse.json({ coverImage: coverUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
