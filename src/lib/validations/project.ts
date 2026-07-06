import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(255),
  author: z.string().min(1, "O autor é obrigatório").max(255),
  description: z.string().nullable().optional(),
  language: z.string().default("pt-BR"),
  isbn: z.string().nullable().optional(),
  categories: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  coverImage: z.string().nullable().optional(),
  settings: z.object({
    pageFormat: z.string().default("6x9"),
    fontFamily: z.string().default("Lora"),
    fontSize: z.number().default(11),
    lineHeight: z.number().default(1.4),
    margins: z.object({
      top: z.string().default("2cm"),
      bottom: z.string().default("2cm"),
      inner: z.string().default("2.5cm"),
      outer: z.string().default("2cm"),
    }).default({ top: "2cm", bottom: "2cm", inner: "2.5cm", outer: "2cm" }),
    theme: z.string().default("light"),
  }).optional().default({
    pageFormat: "6x9",
    fontFamily: "Lora",
    fontSize: 11,
    lineHeight: 1.4,
    margins: { top: "2cm", bottom: "2cm", inner: "2.5cm", outer: "2cm" },
    theme: "light"
  }),
});

export const chapterSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  number: z.number().optional(),
  wordCount: z.number().optional(),
  status: z.enum(["draft", "review", "published"]).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
