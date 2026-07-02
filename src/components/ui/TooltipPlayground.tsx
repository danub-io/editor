"use client";

import React, { useState } from 'react';

interface TooltipWrapperProps {
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactElement;
}

export function TooltipWrapper({ content, placement, children }: TooltipWrapperProps) {
  const [active, setActive] = useState(false);

  const getPlacementClass = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ms-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 me-2';
    }
  };

  const getArrowPlacementClass = () => {
    switch (placement) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-zinc-900 border-x-transparent border-b-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-zinc-900 border-y-transparent border-l-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-zinc-900 border-y-transparent border-r-transparent';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      {active && (
        <div 
          role="tooltip" 
          className={`absolute z-30 inline-block px-3 py-2 text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 ${getPlacementClass()}`}
        >
          {content}
          <div className={`absolute border-4 ${getArrowPlacementClass()}`}></div>
        </div>
      )}
    </div>
  );
}

export function TooltipPlayground() {
  return (
    <div className="p-6 border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-zinc-900 font-sans">
      <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Demonstração de Tooltips (Passe o mouse)</h3>
      <div className="flex flex-wrap gap-4 items-center justify-center py-6">
        
        {/* Tooltip top */}
        <TooltipWrapper content="Tooltip no topo" placement="top">
          <button 
            type="button" 
            className="text-white bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 box-border border border-transparent focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            Tooltip top
          </button>
        </TooltipWrapper>

        {/* Tooltip right */}
        <TooltipWrapper content="Tooltip na direita" placement="right">
          <button 
            type="button" 
            className="text-white bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 box-border border border-transparent focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            Tooltip right
          </button>
        </TooltipWrapper>

        {/* Tooltip bottom */}
        <TooltipWrapper content="Tooltip no rodapé" placement="bottom">
          <button 
            type="button" 
            className="text-white bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 box-border border border-transparent focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            Tooltip bottom
          </button>
        </TooltipWrapper>

        {/* Tooltip left */}
        <TooltipWrapper content="Tooltip na esquerda" placement="left">
          <button 
            type="button" 
            className="text-white bg-indigo-600 hover:bg-indigo-750 dark:bg-indigo-500 dark:hover:bg-indigo-600 box-border border border-transparent focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
          >
            Tooltip left
          </button>
        </TooltipWrapper>

      </div>
    </div>
  );
}
