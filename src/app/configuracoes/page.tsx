"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/gospelreads/Navbar';
import Footer from '@/components/gospelreads/Footer';
import { Settings, ShieldCheck, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { ToastPlayground } from '@/components/ui/ToastPlayground';
import { TooltipPlayground } from '@/components/ui/TooltipPlayground';

export default function Configuracoes() {
  const [mounted, setMounted] = useState(false);
  const [blogAdminMode, setBlogAdminMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('gospelreads_blog_admin_mode') === 'true';
    setBlogAdminMode(saved);
  }, []);

  const handleToggleAdminMode = () => {
    const nextVal = !blogAdminMode;
    setBlogAdminMode(nextVal);
    localStorage.setItem('gospelreads_blog_admin_mode', String(nextVal));
  };

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-zinc-950"></div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-between text-gray-500 dark:text-zinc-400 font-sans antialiased pt-16">
      <Navbar />
      
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 md:py-20 w-full space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Sparkles size={12} className="text-indigo-500 dark:text-indigo-400" />
            Painel Geral
          </span>
          <h1 className="text-3xl md:text-5xl text-gray-900 dark:text-zinc-100 uppercase font-extrabold tracking-tight">
            Configurações
          </h1>
          <p className="text-xs md:text-sm text-gray-400 dark:text-zinc-550">
            Gerencie preferências e recursos adicionais da plataforma GospelReads.
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-lg space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3 font-mono">
            <Settings size={14} /> Preferências do Blog
          </h3>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-900 dark:text-zinc-100 block">Modo Administrador do Blog</label>
              <p className="text-gray-500 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
                Ative para gerenciar postagens diretamente na página do blog (criar, editar e deletar posts).
              </p>
            </div>
            
            <button
              onClick={handleToggleAdminMode}
              className="p-1 rounded-full text-indigo-500 dark:text-indigo-400 hover:text-indigo-650 dark:hover:text-indigo-300 transition-colors cursor-pointer bg-transparent border-0"
              title={blogAdminMode ? "Desativar Modo Admin" : "Ativar Modo Admin"}
            >
              {blogAdminMode ? (
                <ToggleRight size={40} className="text-indigo-500 dark:text-indigo-550" />
              ) : (
                <ToggleLeft size={40} className="text-gray-400 dark:text-zinc-650" />
              )}
            </button>
          </div>

          {blogAdminMode && (
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-lg text-xs text-indigo-500 dark:text-indigo-400 flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>
                <strong>Modo Administrador Ativo:</strong> Ao acessar a página do Blog, você verá os painéis de criação e edição de artigos.
              </span>
            </div>
          )}
        </div>

        {/* Custom Components Showcase / Playgrounds */}
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Componentes do Sistema</h2>
          <ToastPlayground />
          <TooltipPlayground />
        </div>
      </main>

      <Footer />
    </div>
  );
}
