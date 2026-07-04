import React from 'react';
import { X } from 'lucide-react';
import { WritingSettings } from '../../types';

interface EditorSettingsModalProps {
  settings: WritingSettings;
  setSettings: (updater: WritingSettings | ((prev: WritingSettings) => WritingSettings)) => void;
  onClose: () => void;
}

export default function EditorSettingsModal({ settings, setSettings, onClose }: EditorSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
      <div className="bg-surface dark:bg-surface border border-outline-variant rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <h3 className="font-serif text-2xl font-bold text-on-surface border-b border-outline-variant pb-2">Preferências</h3>

        <div className="space-y-4 pt-2">
          {/* Typography Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tipografia</label>
            <select
              value={settings.preferredFont}
              onChange={(e) => setSettings((prev: WritingSettings) => ({ ...prev, preferredFont: e.target.value as any }))}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
            >
              <option value="serif">Garamond Clássico (Ficção)</option>
              <option value="sans">Inter Moderno (Artigos/Ensaios)</option>
              <option value="mono">JetBrains Mono (Drafting)</option>
            </select>
          </div>

          {/* Font Size Preference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tamanho da Fonte</label>
            <div className="flex bg-surface-container-lowest rounded-xl border border-outline-variant p-1">
              {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setSettings((prev: WritingSettings) => ({ ...prev, fontSize: size }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tamanho da Margem</label>
            <div className="flex bg-surface-container-lowest rounded-xl border border-outline-variant p-1">
              {(['tight', 'normal', 'wide'] as const).map(margin => (
                <button
                  key={margin}
                  onClick={() => setSettings((prev: WritingSettings) => ({ ...prev, marginSize: margin }))}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                    settings.marginSize === margin
                      ? 'bg-indigo-600 text-white'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {margin === 'tight' ? 'Fina' : margin === 'normal' ? 'Normal' : 'Larga'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
