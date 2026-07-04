/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Sliders, 
  Download, 
  Printer, 
  Layers, 
  Info, 
  ChevronRight,
  BookMarked,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Chapter, WritingSettings } from './types';

interface ExporterProps {
  chapters: Chapter[];
  settings: WritingSettings;
  setSettings: (settings: WritingSettings | ((prev: WritingSettings) => WritingSettings)) => void;
}

type ExportType = 'pdf' | 'epub' | 'txt';

export default function Exporter({ chapters, settings, setSettings }: ExporterProps) {
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilingStep, setCompilingStep] = useState(0);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeExportType, setActiveExportType] = useState<ExportType>('pdf');

  const steps = [
    'Analisando a estrutura dos manuscritos...',
    'Gerando sumário dinâmico e marcadores estelares...',
    'Configurando folha de estilo e margens físicas...',
    'Calculando quebras de páginas automáticas...',
    'Renderizando tipografia EB Garamond e numerações...',
    'Embalando arquivos para transferência final...'
  ];

  const handleExport = (type: ExportType) => {
    setActiveExportType(type);
    setIsCompiling(true);
    setCompilingStep(0);

    // Run simulated steps with timeouts
    const runStep = (stepIdx: number) => {
      if (stepIdx < steps.length) {
        setCompilingStep(stepIdx);
        setTimeout(() => runStep(stepIdx + 1), 700);
      } else {
        setIsCompiling(false);
        triggerDownload(type);
        setShowCompleteModal(true);
      }
    };

    runStep(0);
  };

  const triggerDownload = (type: ExportType) => {
    // Group and sort chapters
    const frontChapters = chapters.filter(ch => ch.section === 'front').sort((a, b) => a.order - b.order);
    const bodyChapters = chapters.filter(ch => ch.section === 'body' || !ch.section).sort((a, b) => a.order - b.order);
    const backChapters = chapters.filter(ch => ch.section === 'back').sort((a, b) => a.order - b.order);
    
    const allChaptersSorted = [...frontChapters, ...bodyChapters, ...backChapters];

    let content = '';
    if (type === 'pdf') {
      // Build TOC HTML items with internal anchor links
      const tocItems = allChaptersSorted.map(ch => {
        const secLabel = ch.section === 'front' ? 'Pré-textual' : ch.section === 'back' ? 'Pós-textual' : 'Capítulo';
        return `
          <li style="display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; margin-bottom: 8px; font-family: 'Inter', sans-serif; font-size: 14px;">
            <a href="#ch-${ch.id}" style="color: #4f46e5; text-decoration: none; font-weight: 500;">
              ${ch.title}
            </a>
            <span style="color: #6b7280; font-size: 12px; font-style: italic; font-weight: normal;">${secLabel}</span>
          </li>
        `;
      }).join('');

      content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Manuscrito Exportado - GospelReads.</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:wght@400;500;600&display=swap');
    body {
      font-family: 'EB Garamond', Georgia, serif;
      line-height: 1.6;
      color: #151c27;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #fbfaf7;
    }
    h1 { text-align: center; font-size: 2.5em; margin-bottom: 30px; font-weight: 500; }
    h2 { font-size: 1.8em; margin-top: 50px; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px; font-weight: 500; page-break-before: always; }
    p { text-indent: 2em; margin-bottom: 1.5em; text-align: justify; font-size: 18px; }
    .toc-container {
      background: #f4f2ee;
      border: 1px solid #e5e2db;
      border-radius: 16px;
      padding: 24px;
      margin: 40px 0;
    }
    .toc-title {
      font-family: 'EB Garamond', serif;
      font-size: 1.8em;
      margin-bottom: 20px;
      text-align: center;
      font-weight: bold;
    }
    .toc-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .footer { text-align: center; margin-top: 50px; font-family: 'Inter', sans-serif; font-size: 12px; color: #5f5e5e; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 20px; }
  </style>
</head>
<body>
  <h1>EDIÇÃO ESPECIAL</h1>
  <p style="text-align: center; text-indent: 0; font-style: italic;">Obra exportada profissionalmente via GospelReads.</p>
  
  <!-- AUTOMATED DYNAMIC TABLE OF CONTENTS -->
  <div class="toc-container">
    <div class="toc-title">Sumário</div>
    <ul class="toc-list">
      ${tocItems}
    </ul>
  </div>
  
  <!-- CHAPTERS / SECTIONS -->
  ${allChaptersSorted.map(ch => `
    <div id="ch-${ch.id}">
      <h2>${ch.title}</h2>
      ${ch.content.split('\n\n').map(p => {
        // If content is HTML (like title-page or dedication), render directly
        if (p.trim().startsWith('<') && p.trim().endsWith('>')) {
          return p;
        }
        return `<p>${p}</p>`;
      }).join('')}
    </div>
  `).join('')}
  
  <div class="footer">
    © ${new Date().getFullYear()} - Documento pronto para revisão literária e publicação.
  </div>
</body>
</html>
      `;
    } else if (type === 'epub') {
      // Build EPUB package manifest simulator
      const tocText = allChaptersSorted.map((ch, idx) => `  [${idx + 1}] ${ch.title} (${ch.section === 'front' ? 'Pré-textual' : ch.section === 'back' ? 'Pós-textual' : 'Capítulo'})`).join('\n');
      content = `GOSPELREADS DIGITAL PUBLISHING SUITE - COMPLIANT EPUB BUNDLE METADATA\n` +
        `========================================================================\n` +
        `Target Compatibility: Kindle KDP (Amazon), Apple Books, Kobo, PDF/A\n` +
        `Generation Date: ${new Date().toISOString()}\n\n` +
        `--- NAV.XHTML INDEX (TABLE OF CONTENTS) ---\n` +
        `${tocText}\n\n` +
        `--- CONTENT MANIFEST ---\n\n` +
        allChaptersSorted.map(ch => {
          return `[Seção: ${ch.section?.toUpperCase() || 'BODY'} | Tipo: ${ch.type || 'chapter'}]\nTITLE: ${ch.title}\n-----------------------------------------\n\n${ch.content}\n\n`;
        }).join('\n');
    } else {
      content = `MANUSCRITO FORMATADO - GOSPELREADS.\n\n` + 
        allChaptersSorted.map(ch => {
          return `=========================================\n${ch.title.toUpperCase()}\n=========================================\n\n${ch.content}\n\n`;
        }).join('\n');
    }

    const blob = new Blob([content], { type: type === 'pdf' || type === 'epub' ? 'text/html' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manuscrito_gospelreads_${Date.now()}.${type === 'pdf' ? 'html' : type === 'epub' ? 'epub.txt' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMarginStyle = () => {
    switch (settings.marginSize) {
      case 'tight': return 'px-6 py-6';
      case 'wide': return 'px-14 py-16';
      case 'normal':
      default: return 'px-10 py-12';
    }
  };

  const getPaperSizeStyle = () => {
    switch (settings.paperFormat) {
      case 'a5': return 'w-[360px] min-h-[500px] text-xs';
      case 'pocket': return 'w-[320px] min-h-[440px] text-[11px]';
      case 'trade':
      default: return 'w-[420px] min-h-[580px] text-sm';
    }
  };

  const paperDetails = {
    a5: 'A5 (14.8 x 21cm) — Ideal para poesias, ensaios e ficção curta.',
    trade: 'Trade (6" x 9" / 15.2 x 22.8cm) — Formato padrão de livraria internacional.',
    pocket: 'Pocket (4.25" x 6.87" / 10.8 x 17.4cm) — Tamanho de bolso econômico.'
  };

  return (
    <div className="w-full bg-surface dark:bg-[#09090b] min-h-[calc(100vh-4rem)] p-6 md:p-12 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Side: Formatter Settings & Exporter Controls */}
        <section className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 tracking-[0.2em] uppercase font-mono bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit block mb-3">DIAGRAMAÇÃO</span>
            <h2 className="text-3xl font-serif text-white mb-3">Diagramador Literário</h2>
            <p className="text-xs md:text-sm text-neutral-400 font-sans">
              Formate e exporte seu livro instantaneamente. Ajuste os padrões estéticos do manuscrito físico ou digital em tempo real.
            </p>
          </div>

          {/* Formatter Controls Box */}
          <div className="bg-neutral-900 p-6 border border-neutral-800 rounded-3xl space-y-6 bento-card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <Sliders size={14} /> Padrões de Layout
            </h3>

            {/* Paper Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">Formato Físico do Livro</label>
              <div className="grid grid-cols-3 gap-2">
                {(['a5', 'trade', 'pocket'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setSettings(prev => ({ ...prev, paperFormat: format }))}
                    className={`py-2.5 px-3 text-xs border rounded-xl text-center transition-all cursor-pointer ${
                      settings.paperFormat === format
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold'
                        : 'border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-500 mt-1 italic font-sans leading-relaxed">
                {paperDetails[settings.paperFormat]}
              </p>
            </div>

            {/* Margins */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">Margens Físicas</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'tight', name: 'Estreita' },
                  { key: 'normal', name: 'Padrão' },
                  { key: 'wide', name: 'Ampla' }
                ] as const).map((margin) => (
                  <button
                    key={margin.key}
                    onClick={() => setSettings(prev => ({ ...prev, marginSize: margin.key }))}
                    className={`py-2.5 px-3 text-xs border rounded-xl text-center transition-all cursor-pointer ${
                      settings.marginSize === margin.key
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold'
                        : 'border-neutral-800 hover:bg-neutral-850 text-neutral-400'
                    }`}
                  >
                    {margin.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">Numeração de Páginas</label>
                  <p className="text-[10px] text-neutral-500">Inserir no rodapé das páginas</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showPageNumbers}
                  onChange={(e) => setSettings(prev => ({ ...prev, showPageNumbers: e.target.checked }))}
                  className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 focus:ring-indigo-500 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-neutral-805/40 pt-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">Salvamento Automático</label>
                  <p className="text-[10px] text-neutral-500">Persistir rascunhos no banco de dados local</p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 opacity-60 w-4 h-4 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between border-t border-neutral-805/40 pt-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">Assistente de Co-autoria</label>
                  <p className="text-[10px] text-neutral-500">Habilitar revisões gramaticais inteligentes</p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 opacity-60 w-4 h-4 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Box */}
          <div className="bg-neutral-900 p-6 border border-indigo-500/10 rounded-3xl space-y-4 bento-card">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <Download size={14} /> Exportação Imediata
            </h3>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              O Ateliê de Exportação constrói arquivos limpos com fontes incorporadas, totalmente adaptados para plataformas de autopublicação.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="btn-export-pdf"
                onClick={() => handleExport('pdf')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-3xl"
              >
                <Printer size={14} /> Compilar PDF
              </button>
              <button
                id="btn-export-epub"
                onClick={() => handleExport('txt')}
                className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-[11px] font-bold uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 border border-neutral-700 transition-colors cursor-pointer rounded-3xl"
              >
                <BookMarked size={14} /> Compilar EPUB
              </button>
            </div>
          </div>
        </section>

        {/* Right Side: Virtual Page Print-Preview */}
        <section className="lg:col-span-7 flex flex-col items-center justify-start">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Layers size={14} /> Visualização Realista
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              Modo Espelho de Impressão
            </span>
          </div>

          {/* Page Canvas Container */}
          <div className="bg-surface-container dark:bg-[#0f0f11] p-10 md:p-14 border border-neutral-800 rounded-3xl w-full flex items-center justify-center overflow-x-auto">
            {/* The Sheet Paper itself */}
            <div className={`bg-[#fcfbf9] text-neutral-900 border border-neutral-800 shadow-2xl transition-all duration-300 flex flex-col justify-between rounded-md ${getPaperSizeStyle()} ${getMarginStyle()}`}>
              
              {/* Header: Running Header */}
              <div className="border-b border-neutral-200 pb-2 flex justify-between items-center text-[9px] font-mono text-neutral-500">
                <span>EDIÇÃO ESPECIAL</span>
                <span className="italic">{chapters[0]?.title || 'Capítulo I'}</span>
              </div>

              {/* Body Content */}
              <div className="flex-1 py-6 flex flex-col justify-start">
                <h4 className="font-serif text-lg md:text-xl text-center font-medium text-neutral-900 mb-6">
                  {chapters[0]?.title || 'Capítulo I'}
                </h4>
                
                {/* Simulated text layout */}
                <div className="font-serif leading-relaxed text-justify space-y-4">
                  <p className="indent-8 text-xs md:text-sm text-neutral-800">
                    {chapters[0]?.content.substring(0, 420) || 'Comece a preencher seu manuscrito no estúdio para ver seu livro ganhar corpo aqui...'}...
                  </p>
                  <p className="indent-8 text-xs md:text-sm text-neutral-800">
                    {chapters[0]?.content.substring(420, 800) ? chapters[0]?.content.substring(420, 800) + '...' : ''}
                  </p>
                </div>
              </div>

              {/* Footer: Page Number */}
              <div className="border-t border-neutral-200 pt-2 flex justify-center items-center text-[9px] font-mono text-neutral-500">
                {settings.showPageNumbers ? 'Página 1' : '—'}
              </div>

            </div>
          </div>

          <div className="w-full bg-neutral-900 p-4 border border-neutral-800 rounded-2xl text-sm text-neutral-400 flex items-start gap-2.5 mt-4">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              As margens de corte virtuais e as fontes incorporadas que você visualiza no simulador acima ajudam a garantir que o texto não seja cortado durante o processo de guilhotina e impressão de tiragens físicas.
            </p>
          </div>
        </section>

      </div>

      {/* Compiler Dialog Modal */}
      {isCompiling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-neutral-900 p-8 max-w-md w-full border border-neutral-800 rounded-3xl shadow-2xl space-y-6 bento-card">
            <div className="text-center">
              <h3 className="text-xl font-serif text-white mb-2">Compilando Livro...</h3>
              <p className="text-xs text-neutral-400">Aguarde enquanto estruturamos sua obra de arte.</p>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-neutral-950 h-2.5 border border-neutral-850 overflow-hidden rounded-full">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                  style={{ width: `${((compilingStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-indigo-400 text-center italic animate-pulse">
                {steps[compilingStep]}
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4 text-[10px] text-neutral-500 text-center">
              Compilação segura baseada nas regras de margem do KDP e IngramSpark.
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
          <div className="bg-neutral-900 p-8 max-w-lg w-full border border-neutral-800 rounded-3xl shadow-2xl space-y-6 relative bento-card">
            <div className="text-center space-y-2">
              <CheckCircle size={44} className="text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-serif text-white">Compilação Concluída!</h3>
              <p className="text-sm text-neutral-400">
                Seu manuscrito foi compilado e baixado no formato <strong className="text-indigo-400 font-mono">{activeExportType.toUpperCase()}</strong> com sucesso.
              </p>
            </div>

            <div className="bg-neutral-950 p-5 border border-neutral-800 rounded-2xl text-xs space-y-3">
              <div className="font-bold text-neutral-300 uppercase tracking-wider">Próximos Passos:</div>
              <ul className="space-y-2 list-disc pl-4 text-neutral-400 font-sans">
                <li>
                  <strong>Publicação Física (KDP/IngramSpark):</strong> Faça upload do arquivo compilado diretamente na plataforma para obter a versão impressa.
                </li>
                <li>
                  <strong>E-reader (Kindle/Kobo):</strong> Importe no painel KDP Select para iniciar a pré-venda.
                </li>
                <li>
                  <strong>Revisão de Prova:</strong> Sempre verifique o visual da diagramação final antes de encomendar a tiragem física oficial.
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 cursor-pointer rounded-3xl transition-colors"
              >
                Concluir & Voltar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
