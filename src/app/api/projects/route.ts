export const runtime = "edge";

import { requireAuth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { chapters, projects } from "@gospelreads/db";
import { generateId } from "@/lib/utils";
import { projectSchema } from "@/lib/validations/project";

// GET /api/projects — List all projects
export async function GET(req: NextRequest) {
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;


    const db = getDb(process.env as Record<string, unknown>);
    // Ideally we filter by user id here if the schema supported it:
    // const rows = await db.select().from(projects).where(eq(projects.userId, user.id)).all();
    // Since it doesn't currently, we will just fetch all for now, but auth is in place.
    const rows = await db.select().from(projects).all();
    const result = rows.map((r: any) => ({
      ...r,
      categories: JSON.parse(r.categories || "[]"),
      keywords: JSON.parse(r.keywords || "[]"),
      settings: {
        pageFormat: r.settingsPageFormat,
        fontFamily: r.settingsFontFamily,
        fontSize: r.settingsFontSize,
        lineHeight: r.settingsLineHeight,
        margins: {
          top: r.settingsMarginTop,
          bottom: r.settingsMarginBottom,
          inner: r.settingsMarginInner,
          outer: r.settingsMarginOuter,
        },
        theme: r.settingsTheme,
      },
    }));
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects — Create project
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAuth(req);
    if (authError) return authError;


    const db = getDb(process.env as Record<string, unknown>);
    const rawBody = await req.json();

    const parsedBody = projectSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Validation error", details: parsedBody.error.format() }, { status: 400 });
    }

    const body = parsedBody.data;
    const now = new Date().toISOString();
    const id = generateId();

    await db.insert(projects).values({
      id,
      title: body.title,
      author: body.author,
      description: body.description || null,
      language: body.language,
      isbn: body.isbn || null,
      categories: JSON.stringify(body.categories),
      keywords: JSON.stringify(body.keywords),
      coverImage: body.coverImage || null,
      settingsPageFormat: body.settings.pageFormat,
      settingsFontFamily: body.settings.fontFamily,
      settingsFontSize: body.settings.fontSize,
      settingsLineHeight: body.settings.lineHeight,
      settingsMarginTop: body.settings.margins.top,
      settingsMarginBottom: body.settings.margins.bottom,
      settingsMarginInner: body.settings.margins.inner,
      settingsMarginOuter: body.settings.margins.outer,
      settingsTheme: body.settings.theme,
      createdAt: now,
      updatedAt: now,
    });

    // Create default first chapter
    const chapterId = generateId();
    await db.insert(chapters).values({
      id: chapterId,
      projectId: id,
      type: "chapter",
      number: 1,
      title: "Capítulo 1",
      content: "Comece a escrever seu primeiro capítulo aqui...\n",
      wordCount: 7,
      tags: "[]",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      id,
      title: body.title,
      author: body.author,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
