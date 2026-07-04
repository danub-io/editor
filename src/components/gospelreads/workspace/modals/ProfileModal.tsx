import React from 'react';
import { X, User } from 'lucide-react';
import AuthorProfileBuilder from '../../AuthorProfileBuilder';
import { useEditorStore } from '@/stores/editorStore';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { profile, setProfile, books } = useEditorStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
      <div className="bg-surface dark:bg-surface border border-outline-variant rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-2">
            <User size={18} className="text-indigo-400" />
            <h3 className="font-serif text-lg font-bold text-on-surface">Perfil do Autor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          <AuthorProfileBuilder
            profile={profile}
            setProfile={setProfile}
            books={books}
          />
        </div>
      </div>
    </div>
  );
}
