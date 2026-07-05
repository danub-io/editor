import React from 'react';
import {
  AlignLeft,
  Trophy,
  Pin,
  MessageSquare,
  History,
  Search,
  Type,
  Trash2,
  BookMarked,
  Download,
  Settings
} from 'lucide-react';

export function RightIconStrip({
  activeRightTool,
  setActiveRightTool,
  activeChapter,
  deleteChapter,
  setShowExporterModal,
  setShowEditorSettingsModal
}: any) {
  return (
    <aside className="w-16 border-l border-outline-variant bg-surface dark:bg-surface flex flex-col justify-between items-center py-4 shrink-0 select-none">
      {/* Top stack icons */}
      <div className="space-y-3.5 flex flex-col items-center">
        <button
          onClick={() => setActiveRightTool(activeRightTool === 'stats' ? null : 'stats')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'stats'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Metas & Insights"
        >
          <AlignLeft size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'challenges' ? null : 'challenges')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'challenges'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Desafios Literários"
        >
          <Trophy size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'notes' ? null : 'notes')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'notes'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Notas Fixadas"
        >
          <Pin size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'track' ? null : 'track')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'track'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Controle de Alterações & Sugestões"
        >
          <MessageSquare size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'history' ? null : 'history')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'history'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Snapshots de Versão"
        >
          <History size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'search' ? null : 'search')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'search'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Buscar & Substituir"
        >
          <Search size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'spell' ? null : 'spell')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'spell'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Corretor Ortográfico"
        >
          <Type size={18} />
        </button>

        <button
          onClick={(e) => {
            if (activeChapter) {
              deleteChapter(activeChapter.id, e);
            }
          }}
          className="p-2 rounded-xl border border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest transition-all cursor-pointer"
          title="Excluir Capítulo Atual"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={() => setActiveRightTool(activeRightTool === 'footnotes' ? null : 'footnotes')}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            activeRightTool === 'footnotes'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Notas de Rodapé"
        >
          <BookMarked size={18} />
        </button>
      </div>

      {/* Bottom stack: exporter and editor settings */}
      <div className="space-y-3.5 flex flex-col items-center">
        {/* Diagramador e exportador */}
        <button
          onClick={() => setShowExporterModal(true)}
          className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-lowest border border-transparent transition-all cursor-pointer"
          title="Diagramação & Exportação"
        >
          <Download size={18} />
        </button>

        {/* Configurações do Editor (Engrenagem) */}
        <button
          onClick={() => setShowEditorSettingsModal(true)}
          className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-lowest border border-transparent transition-all cursor-pointer"
          title="Configurações do Editor (Fonte, Tamanho, etc.)"
        >
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
}
