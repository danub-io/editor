import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "404 — GospelReads.",
};

import Link from "next/link";
import { BookOpen } from "lucide-react";
import Navbar from "@/components/gospelreads/Navbar";
import Footer from "@/components/gospelreads/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col pt-16">
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center px-6 md:px-12 py-20 w-full">
        <div className="text-center max-w-md space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-full w-fit mx-auto border border-indigo-100 dark:border-indigo-900/50">
            <BookOpen className="text-indigo-500 dark:text-indigo-400" size={48} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold text-indigo-500 dark:text-indigo-400 tracking-tight font-mono">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
              Página não encontrada
            </h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
              A página que você procura não existe ou foi movida temporariamente do nosso catálogo.
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold uppercase tracking-widest py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            Voltar ao Início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
