import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookOpen, Layout, Settings, Download, Trash2, Search, Moon, Sun, User } from 'lucide-react';
import AnimatedThemeToggler from '@/registry/magicui/animated-theme-toggler';
import { useTheme } from 'next-themes';

export function MobileNav({
  leftTab,
  setLeftTab,
  isLeftPanelOpen,
  setIsLeftPanelOpen,
  setShowProfileModal,
  setGlobalSearchOpen,
  setTrashOpen,
  setShowExporterModal,
  setShowEditorSettingsModal,
  profile
}: any) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="lg:hidden flex items-center justify-between p-3 border-b border-outline-variant bg-surface dark:bg-surface">
      <Sheet>
        <SheetTrigger className="p-2 text-on-surface-variant hover:text-white cursor-pointer">
          <Menu size={20} />
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-surface dark:bg-[#0c0c0e] p-0 flex flex-col font-sans">
          <div className="p-4 border-b border-outline-variant flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border">
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold font-serif text-sm">{profile.name}</div>
              <div className="text-xs text-on-surface-variant">Autor</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <button
              onClick={() => { setLeftTab('manuscript'); setIsLeftPanelOpen(true); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${leftTab === 'manuscript' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-on-surface-variant'}`}
            >
              <BookOpen size={16} /> Manuscrito
            </button>
            <button
              onClick={() => { setLeftTab('planning'); setIsLeftPanelOpen(true); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${leftTab === 'planning' ? 'bg-indigo-500/10 text-indigo-400 font-bold' : 'text-on-surface-variant'}`}
            >
              <Layout size={16} /> Planejamento
            </button>
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-lowest"
            >
              <Search size={16} /> Buscar
            </button>
            <button
              onClick={() => setTrashOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-lowest"
            >
              <Trash2 size={16} /> Lixeira
            </button>
          </div>

          <div className="p-4 border-t border-outline-variant space-y-2">
            <button
              onClick={() => setShowExporterModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-lowest"
            >
              <Download size={16} /> Exportar
            </button>
            <button
              onClick={() => setShowEditorSettingsModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-lowest"
            >
              <Settings size={16} /> Configurações
            </button>
            <div className="flex items-center gap-3 px-3 py-2">
              <AnimatedThemeToggler theme={isDark ? 'dark' : 'light'} onThemeChange={setTheme} />
              <span className="text-sm text-on-surface-variant">Tema</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="font-serif font-bold text-lg">GospelReads</div>

      <button
        onClick={() => setShowProfileModal(true)}
        className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant"
      >
        <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
      </button>
    </div>
  );
}
