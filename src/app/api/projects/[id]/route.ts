export const runtime = "edge";

import { requireAuth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { projects } from "@gospelreads/db";
import { eq } from "drizzle-orm";
import { projectSchema } from "@/lib/validations/project";

// GET /api/projects/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;


    const db = getDb(process.env as Record<string, unknown>);
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...row,
      categories: JSON.parse(row.categories || "[]"),
      keywords: JSON.parse(row.keywords || "[]"),
      settings: {
        pageFormat: row.settingsPageFormat,
        fontFamily: row.settingsFontFamily,
        fontSize: row.settingsFontSize,
        lineHeight: row.settingsLineHeight,
        margins: {
          top: row.settingsMarginTop,
          bottom: row.settingsMarginBottom,
          inner: row.settingsMarginInner,
          outer: row.settingsMarginOuter,
        },
        theme: row.settingsTheme,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/projects/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;


    const db = getDb(process.env as Record<string, unknown>);
    const rawBody = await req.json();

    // Using partial schema since PUT might not include all fields
    const parsedBody = projectSchema.partial().safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Validation error", details: parsedBody.error.format() }, { status: 400 });
    }

    const body = parsedBody.data;
    const now = new Date().toISOString();
    const updates: Record<string, any> = { updatedAt: now };

    if (body.title !== undefined) updates.title = body.title;
    if (body.author !== undefined) updates.author = body.author;
    if (body.description !== undefined) updates.description = body.description;
    if (body.language !== undefined) updates.language = body.language;
    if (body.isbn !== undefined) updates.isbn = body.isbn;
    if (body.categories !== undefined)
      updates.categories = JSON.stringify(body.categories);
    if (body.keywords !== undefined)
      updates.keywords = JSON.stringify(body.keywords);
    if (body.settings) {
      const s = body.settings;
      if (s.pageFormat) updates.settingsPageFormat = s.pageFormat;
      if (s.fontFamily) updates.settingsFontFamily = s.fontFamily;
      if (s.fontSize) updates.settingsFontSize = s.fontSize;
      if (s.lineHeight) updates.settingsLineHeight = s.lineHeight;
      if (s.margins) {
        if (s.margins.top) updates.settingsMarginTop = s.margins.top;
        if (s.margins.bottom) updates.settingsMarginBottom = s.margins.bottom;
        if (s.margins.inner) updates.settingsMarginInner = s.margins.inner;
        if (s.margins.outer) updates.settingsMarginOuter = s.margins.outer;
      }
      if (s.theme) updates.settingsTheme = s.theme;
    }

    await db.update(projects).set(updates).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await (params as any);
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;


    const db = getDb(process.env as Record<string, unknown>);
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
