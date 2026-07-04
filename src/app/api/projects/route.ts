export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@gospelreads/db";
import { chapters, projects } from "@gospelreads/db";
import { generateId } from "@/lib/utils";

// GET /api/projects — List all projects
export async function GET(req: NextRequest) {
  try {
    const apiSecret = process.env.API_SECRET;
    if (apiSecret) {
      const authHeader = req.headers.get("authorization");
      const apiKeyHeader = req.headers.get("x-api-key");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

      if (token !== apiSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb(process.env as Record<string, unknown>);
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
    const apiSecret = process.env.API_SECRET;
    if (apiSecret) {
      const authHeader = req.headers.get("authorization");
      const apiKeyHeader = req.headers.get("x-api-key");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : apiKeyHeader;

      if (token !== apiSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const db = getDb(process.env as Record<string, unknown>);
    const body = (await req.json()) as any as Record<string, any>;
    const now = new Date().toISOString();
    const id = generateId();

    await db.insert(projects).values({
      id,
      title: body.title,
      author: body.author,
      description: body.description || null,
      language: body.language || "pt-BR",
      isbn: body.isbn || null,
      categories: JSON.stringify(body.categories || []),
      keywords: JSON.stringify(body.keywords || []),
      coverImage: body.coverImage || null,
      settingsPageFormat: body.settings?.pageFormat || "6x9",
      settingsFontFamily: body.settings?.fontFamily || "Lora",
      settingsFontSize: body.settings?.fontSize || 11,
      settingsLineHeight: body.settings?.lineHeight || 1.4,
      settingsMarginTop: body.settings?.margins?.top || "2cm",
      settingsMarginBottom: body.settings?.margins?.bottom || "2cm",
      settingsMarginInner: body.settings?.margins?.inner || "2.5cm",
      settingsMarginOuter: body.settings?.margins?.outer || "2cm",
      settingsTheme: body.settings?.theme || "light",
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
