import React from 'react';
import { BookOpen, Layout, Search, Trash2 } from 'lucide-react';
import AnimatedThemeToggler from '@/registry/magicui/animated-theme-toggler';

export function DesktopNav({
  leftTab,
  setLeftTab,
  isLeftPanelOpen,
  setIsLeftPanelOpen,
  setShowProfileModal,
  setGlobalSearchOpen,
  globalSearchOpen,
  trashOpen,
  setTrashOpen,
  profile,
  isDark,
  setTheme
}: any) {
  return (
    <aside className="w-16 border-r border-outline-variant bg-surface dark:bg-surface flex flex-col justify-between items-center py-4 shrink-0 select-none hidden lg:flex">
      {/* Top: manuscript + planning only */}
      <div className="space-y-3.5 flex flex-col items-center">
        <button
          onClick={() => {
            if (leftTab === 'manuscript' && isLeftPanelOpen) {
              setIsLeftPanelOpen(false);
            } else {
              setLeftTab('manuscript');
              setIsLeftPanelOpen(true);
            }
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            leftTab === 'manuscript' && isLeftPanelOpen
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Manuscrito"
        >
          <BookOpen size={18} />
        </button>

        <button
          onClick={() => {
            if (leftTab === 'planning' && !isLeftPanelOpen) {
              setLeftTab('planning');
            } else {
              setLeftTab('planning');
              setIsLeftPanelOpen(false);
            }
          }}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            leftTab === 'planning'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Planejamento"
        >
          <Layout size={18} />
        </button>
      </div>

      {/* Bottom: avatar, search, trash, theme — bottom-to-top */}
      <div className="flex flex-col-reverse items-center gap-3">
        {/* Avatar — foto de perfil clicável */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer focus:outline-none focus:border-indigo-500"
          title="Configurações de Perfil"
        >
          <img
            src={
              profile.avatarUrl ||
              `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(profile.name || 'autor')}&backgroundColor=6366f1,818cf8&backgroundType=gradientLinear`
            }
            alt={profile.name || 'Perfil'}
            className="w-full h-full object-cover"
          />
        </button>

        {/* Global search */}
        <button
          onClick={() => setGlobalSearchOpen((o: boolean) => !o)}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            globalSearchOpen
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Busca global"
        >
          <Search size={18} />
        </button>

        {/* Trash */}
        <button
          onClick={() => setTrashOpen((o: boolean) => !o)}
          className={`p-2 rounded-xl border transition-all cursor-pointer ${
            trashOpen
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
              : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
          }`}
          title="Lixeira"
        >
          <Trash2 size={18} />
        </button>

        {/* Theme toggle using AnimatedThemeToggler */}
        <div className="p-2 rounded-xl">
          <AnimatedThemeToggler
            theme={isDark ? 'dark' : 'light'}
            onThemeChange={(newTheme: any) => setTheme(newTheme)}
          />
        </div>
      </div>
    </aside>
  );
}
