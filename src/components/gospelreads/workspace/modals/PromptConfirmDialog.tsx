import React, { useState, useEffect } from 'react';
import { DialogAdapter } from './DialogAdapter';

interface PromptConfirmDialogProps {
  isOpen: boolean;
  type: 'prompt' | 'confirm';
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  onConfirm: (val: string) => void;
  onCancel: () => void;
}

export function PromptConfirmDialog({
  isOpen,
  type,
  title,
  message,
  defaultValue = '',
  placeholder = '',
  onConfirm,
  onCancel
}: PromptConfirmDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const isDeleteAction = title.toLowerCase().includes('excluir') || title.toLowerCase().includes('delete') || title.toLowerCase().includes('remover') || title.toLowerCase().includes('confirmar');

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue, isOpen]);

  return (
    <DialogAdapter isOpen={isOpen} title={title} message={message} onClose={onCancel}>
      <div className="space-y-4">
        {type === 'prompt' && (
          <div className="pt-1">
            <input
              type="text"
              value={inputValue}
              placeholder={placeholder}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm(inputValue);
              }}
              className="w-full bg-white dark:bg-surface-container-lowest border border-neutral-200 dark:border-outline-variant rounded-xl px-3 py-2.5 text-sm text-neutral-800 dark:text-white placeholder-neutral-450 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg text-sm font-bold text-neutral-700 dark:text-neutral-350 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer font-sans"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(inputValue)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors cursor-pointer font-sans ${isDeleteAction ? 'bg-[#ef4444] hover:bg-[#dc2626]' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isDeleteAction ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </DialogAdapter>
  );
}
