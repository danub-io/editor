import React from 'react';
import { SelectionToolbar } from "@/components/editor/SelectionToolbar";
import { EditorContent } from "@tiptap/react";
import { Chapter } from '@/components/gospelreads/types';

export function EditorCanvas({
  activeChapter,
  handleTitleChange,
  editor,
  isDistractionFree,
  setIsDistractionFree,
  activeWords,
  getFontClass,
  getFontSizeClass
}: {
  activeChapter?: Chapter;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editor: any;
  isDistractionFree: boolean;
  setIsDistractionFree: (val: boolean) => void;
  activeWords: number;
  getFontClass: () => string;
  getFontSizeClass: () => string;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-20 flex justify-center bg-surface dark:bg-surface">
      <div className="w-full max-w-3xl flex flex-col bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-2xl p-8 md:p-14 relative min-h-[70vh] editor-paper">

        {/* Chapter Header */}
        <div className="mb-6 border-b border-outline-variant/80 pb-4">
          <input
            type="text"
            value={activeChapter ? activeChapter.title : ''}
            onChange={handleTitleChange}
            placeholder="Título do Capítulo..."
            className="w-full font-serif text-2xl md:text-3xl text-white border-none bg-transparent focus:outline-none placeholder:text-neutral-700 font-medium"
          />
          <span className="text-[9px] font-mono text-on-surface-variant mt-1 block uppercase tracking-wider">
            Última edição realizada hoje, às {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Selection Toolbar for editor */}
        {editor && <SelectionToolbar editor={editor} focusMode={isDistractionFree} />}

        {/* Writing Area */}
        <div
          className={`flex-1 w-full text-left bg-transparent focus:outline-none ${getFontClass()} ${getFontSizeClass()} text-on-surface outline-none`}
          style={{ minHeight: '380px' }}
        >
          {editor && <EditorContent editor={editor} />}
        </div>

        {/* Distraction free overlay indicators */}
        {isDistractionFree && (
          <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center border-t border-outline-variant/50 pt-4 text-[10px] font-mono text-on-surface-variant select-none">
            <span>{activeChapter ? activeChapter.title : ''}</span>
            <span>{activeWords} palavras</span>
            <button
              onClick={() => setIsDistractionFree(false)}
              className="hover:text-indigo-400 transition-colors"
            >
              Sair do Modo Foco
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
