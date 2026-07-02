import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Manuscritos — GospelReads.",
};

import Navbar from "@/components/gospelreads/Navbar";
import Footer from "@/components/gospelreads/Footer";
import { SafeImage } from "@/components/marketplace/SafeImage";
import { Plus, Clock, Calendar } from "lucide-react";
import Link from "next/link";

const mockManuscripts = [
  {
    id: "m1",
    title: "O Eco do Vento",
    author: "Sara Ribeiro",
    wordCount: 45200,
    status: "Em Progresso",
    progress: 68,
    lastEdit: "Há 45 minutos",
    created: "22 de Mai de 2026",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "As Crônicas da Graça",
    author: "Mário Neto",
    wordCount: 12800,
    status: "Esboço",
    progress: 20,
    lastEdit: "Ontem, às 18:30",
    created: "10 de Jun de 2026",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "Fundamentos do Amanhã",
    author: "Sara Ribeiro",
    wordCount: 89000,
    status: "Concluído",
    progress: 100,
    lastEdit: "Há 1 semana",
    created: "15 de Jan de 2026",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ManuscritosPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col pt-16">
      <Navbar />
      <main id="main-content" className="flex-1 max-w-6xl mx-auto px-6 md:px-12 py-12 w-full">
        {/* Header */}
        <header className="mb-12 border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400 tracking-[0.2em] uppercase font-mono bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50 w-fit block mb-3">
              ÁREA DE ESCRITA
            </span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
              Meus Manuscritos
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-4 max-w-2xl">
              Crie, gerencie e organize seus rascunhos de livros. Utilize nosso editor integrado focado em escrita sem distrações.
            </p>
          </div>
          <Link
            href="/dash"
            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold uppercase tracking-widest px-6 py-3 transition-colors rounded-lg gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Manuscrito
          </Link>
        </header>

        {/* Manuscripts Grid List */}
        <div className="space-y-6">
          {mockManuscripts.map((manuscript) => (
            <div
              key={manuscript.id}
              className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors rounded-lg flex flex-col md:flex-row gap-8 items-start md:items-center"
            >
              {/* Cover layout preview */}
              <div className="w-24 shrink-0 aspect-[2/3] bg-gray-200 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 overflow-hidden relative rounded-lg self-center md:self-auto shadow-sm">
                <SafeImage
                  src={manuscript.cover}
                  alt={manuscript.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description and Info */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <div className="flex flex-wrap gap-2 items-center mb-1.5">
                    <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      {manuscript.author}
                    </span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full" />
                    <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider font-mono">
                      {manuscript.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {manuscript.title}
                  </h3>
                </div>

                {/* Progress metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
                      Palavras
                    </span>
                    <span className="text-sm font-mono text-gray-900 dark:text-zinc-100 font-bold">
                      {manuscript.wordCount.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider block">
                      Progresso
                    </span>
                    <span className="text-sm font-mono text-gray-900 dark:text-zinc-100 font-bold">
                      {manuscript.progress}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Edição
                    </span>
                    <span className="text-sm text-gray-600 dark:text-zinc-400 block mt-0.5">
                      {manuscript.lastEdit}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Criado em
                    </span>
                    <span className="text-sm text-gray-600 dark:text-zinc-400 block mt-0.5">
                      {manuscript.created}
                    </span>
                  </div>
                </div>

                {/* Progress Line */}
                <div className="w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full"
                    style={{ width: `${manuscript.progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-end">
                <Link
                  href="/dash"
                  className="flex-1 md:flex-none text-center text-sm font-bold uppercase tracking-widest bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white px-6 py-2.5 transition-colors rounded-lg cursor-pointer"
                >
                  Editar Texto
                </Link>
                <button className="flex-1 md:flex-none text-sm font-bold uppercase tracking-widest border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-500 dark:hover:text-indigo-400 px-6 py-2.5 transition-colors rounded-lg cursor-pointer">
                  Configurar Capa
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
