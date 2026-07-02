"use client";

import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

export function ToastSuccess({ message, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div id="toast-success" className="flex items-center w-full max-w-sm p-4 text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-md border border-gray-250 dark:border-zinc-800 font-sans" role="alert">
      <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-emerald-800 dark:text-emerald-450 bg-emerald-100 dark:bg-emerald-950/40 rounded">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5"/>
        </svg>
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button 
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
        type="button" 
        className="ms-auto flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent box-border border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-zinc-800 font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none cursor-pointer" 
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastDanger({ message, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div id="toast-danger" className="flex items-center w-full max-w-sm p-4 text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 font-sans" role="alert">
      <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/40 rounded">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
        <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button 
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
        type="button" 
        className="ms-auto flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent box-border border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-zinc-800 font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none cursor-pointer" 
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastWarning({ message, onClose, duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div id="toast-warning" className="flex items-center w-full max-w-sm p-4 text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 font-sans" role="alert">
      <div className="inline-flex items-center justify-center shrink-0 w-7 h-7 text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 rounded">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <span className="sr-only">Warning icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button 
        onClick={() => { setVisible(false); if (onClose) onClose(); }}
        type="button" 
        className="ms-auto flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-transparent box-border border border-transparent hover:bg-gray-200 dark:hover:bg-zinc-800 focus:ring-4 focus:ring-gray-200 dark:focus:ring-zinc-800 font-medium leading-5 rounded text-sm h-8 w-8 focus:outline-none cursor-pointer" 
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
        </svg>
      </button>
    </div>
  );
}

export function ToastPlayground() {
  const [activeToasts, setActiveToasts] = useState<{ id: number; type: 'success' | 'danger' | 'warning'; message: string }[]>([]);
  const [counter, setCounter] = useState(0);

  const addToast = (type: 'success' | 'danger' | 'warning', message: string) => {
    const id = counter;
    setCounter(prev => prev + 1);
    setActiveToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-900 font-sans">
      <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Demonstração de Toasts</h3>
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={() => addToast('success', 'Operação realizada com sucesso!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm cursor-pointer transition-colors"
        >
          Toast Sucesso
        </button>
        <button 
          onClick={() => addToast('danger', 'Erro: Ocorreu uma falha no sistema.')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm cursor-pointer transition-colors"
        >
          Toast Erro
        </button>
        <button 
          onClick={() => addToast('warning', 'Aviso: Verifique as configurações de exportação.')}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm cursor-pointer transition-colors"
        >
          Toast Alerta
        </button>
      </div>

      {/* Toast Stack Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {activeToasts.map(toast => {
          if (toast.type === 'success') {
            return <ToastSuccess key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />;
          }
          if (toast.type === 'danger') {
            return <ToastDanger key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />;
          }
          return <ToastWarning key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />;
        })}
      </div>
    </div>
  );
}
