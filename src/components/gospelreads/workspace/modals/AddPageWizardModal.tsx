import React, { useState } from 'react';
import { X, Heading1, FileText } from 'lucide-react';
import { Chapter } from '../../types';
import { useEditorStore } from '@/stores/editorStore';

interface AddPageWizardModalProps {
  onClose: () => void;
}

export default function AddPageWizardModal({ onClose }: AddPageWizardModalProps) {
  const { chapters, setChapters, setActiveChapterId } = useEditorStore();
  const [newPageType, setNewPageType] = useState<'chapter' | 'part'>('chapter');
  const [newPageTitle, setNewPageTitle] = useState('');

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleCreate = () => {
    if (!newPageTitle.trim()) return;

    const mainChapters = chapters.filter(c => c.section === 'body' && c.type !== 'part');
    const nextOrder = mainChapters.length > 0 ? Math.max(...mainChapters.map(c => c.order)) + 1 : 1;

    const newCh: Chapter = {
      id: generateId(),
      title: newPageTitle,
      content: '',
      order: nextOrder,
      section: 'body',
      type: newPageType as any,
    };

    setChapters((prev: Chapter[]) => [...prev, newCh]);
    setActiveChapterId(newCh.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
      <div className="bg-surface dark:bg-surface border border-outline-variant rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <div>
          <h3 className="font-serif text-2xl font-bold text-on-surface mb-1">Adicionar ao Manuscrito</h3>
          <p className="text-sm text-on-surface-variant">Escolha o tipo de conteúdo para inserir na estrutura do seu livro.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setNewPageType('part')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              newPageType === 'part'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-indigo-500/50'
            }`}
          >
            <div className="p-3 bg-surface-container-high rounded-full"><Heading1 size={24} /></div>
            <div className="text-center">
              <span className="block font-bold mb-1">Parte / Ato</span>
              <span className="text-[11px] opacity-70">Agrupador maior para organizar múltiplos capítulos.</span>
            </div>
          </button>

          <button
            onClick={() => setNewPageType('chapter')}
            className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
              newPageType === 'chapter'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-indigo-500/50'
            }`}
          >
            <div className="p-3 bg-surface-container-high rounded-full"><FileText size={24} /></div>
            <div className="text-center">
              <span className="block font-bold mb-1">Capítulo</span>
              <span className="text-[11px] opacity-70">Unidade padrão de texto dentro da história principal.</span>
            </div>
          </button>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Título do {newPageType === 'part' ? 'Ato' : 'Capítulo'}</label>
          <input
            type="text"
            placeholder={newPageType === 'part' ? "Ex: Parte Um, O Retorno..." : "Ex: Capítulo 1, A Tempestade..."}
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-indigo-500 font-sans"
            autoFocus
          />
        </div>

        <div className="flex justify-end pt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-on-surface hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2 rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50"
            disabled={!newPageTitle.trim()}
          >
            Criar {newPageType === 'part' ? 'Parte' : 'Capítulo'}
          </button>
        </div>
      </div>
    </div>
  );
}
