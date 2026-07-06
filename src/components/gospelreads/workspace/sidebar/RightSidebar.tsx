import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import {
  X,
  AlignLeft,
  Trophy,
  Pin,
  MessageSquare,
  History,
  Search,
  Type,
  Trash2,
  BookMarked,
  Plus,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

import { useMemo } from 'react';

export function RightSidebar({
  activeRightTool,
  setActiveRightTool,
  sessionMood,
  setSessionMood,
  readingTime,
  activeWords,
  activeChapter,
  wordFrequency,
  planningSections,
  setPlanningCards,
  pinnedCardsList,
  setPinnedCardsList,
  planningCards,
  togglePinCard,
  trackChanges,
  setTrackChanges,
  suggestions,
  setSuggestions,
  createSnapshot,
  snapshots,
  findText,
  setFindText,
  replaceText,
  setReplaceText,
  matchCase,
  setMatchCase,
  searchOnlyThisChapter,
  setSearchOnlyThisChapter,
  executeFindAndReplace,
  spellingActive,
  setSpellingActive,
  footnotes,
  setFootnotes,
  editor
}: any) {
  const sectionIdToName = useMemo(() => {
    if (!planningSections) return {};
    return planningSections.reduce((acc: Record<string, string>, section: any) => {
      acc[section.id] = section.name;
      return acc;
    }, {});
  }, [planningSections]);

  if (!activeRightTool) return null;

  return (
    <aside className="w-80 border-l border-neutral-200 dark:border-outline-variant bg-surface dark:bg-[#0c0c0e] flex flex-col justify-between overflow-hidden animate-fade-in shrink-0">
      <div className="p-5 space-y-6 h-full flex flex-col justify-start">
        {/* Tool title header */}
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 font-mono flex items-center gap-2">
            {activeRightTool === 'stats' && <><AlignLeft size={15} /> Metas & Insights</>}
            {activeRightTool === 'challenges' && <><Trophy size={15} /> Desafios Literários</>}
            {activeRightTool === 'notes' && <><Pin size={15} /> Notas Fixadas</>}
            {activeRightTool === 'track' && <><MessageSquare size={15} /> Sugestões & Revisões</>}
            {activeRightTool === 'history' && <><History size={15} /> Snapshots de Versão</>}
            {activeRightTool === 'search' && <><Search size={15} /> Buscar & Substituir</>}
            {activeRightTool === 'spell' && <><Type size={15} /> Corretor Ortográfico</>}
            {activeRightTool === 'trash' && <><Trash2 size={15} /> Lixeira do Livro</>}
            {activeRightTool === 'footnotes' && <><BookMarked size={15} /> Notas de Rodapé</>}
          </h3>
          <div className="flex items-center gap-1.5">
            {activeRightTool === 'notes' && (
              <>
                <button
                  onClick={() => {
                    const input = document.getElementById('sidebar-image-upload') as HTMLInputElement;
                    if (input) input.click();
                  }}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-on-surface-variant dark:text-neutral-450 hover:text-indigo-500 rounded-lg transition-colors"
                  title="Anexar Imagem"
                >
                  <Plus size={16} />
                </button>
                <input
                  type="file"
                  id="sidebar-image-upload"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const readPromises = Array.from(files).map(file => {
                        return new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            resolve(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        });
                      });
                      Promise.all(readPromises).then(base64Images => {
                        const newId = `pc-${Date.now()}`;
                        const newCard = {
                          id: newId,
                          column: planningSections[0]?.id || 'planning',
                          title: `Imagem Anexada (${new Date().toLocaleDateString('pt-BR')})`,
                          content: 'Imagem carregada via painel.',
                          tag: 'Geral' as const,
                          images: base64Images
                        };
                        setPlanningCards((prev: any) => [...prev, newCard]);
                        setPinnedCardsList((prev: any) => [...prev, newId]);
                      });
                    }
                  }}
                />
              </>
            )}
            <button
              onClick={() => setActiveRightTool(null)}
              className="p-1.5 hover:bg-neutral-800 text-on-surface-variant hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* TAB CONTENT: Stats & Insights */}
        {activeRightTool === 'stats' && (
          <div className="space-y-6 flex-1 overflow-y-auto text-neutral-300">
            {/* Smiley mood check-in */}
            <div className="space-y-2 bg-surface-container-lowest/60 p-3.5 border border-outline-variant rounded-2xl text-center">
              <div className="text-[10px] font-bold text-on-surface-variant uppercase">Como foi o trabalho hoje?</div>
              <div className="flex justify-center gap-4 py-1.5">
                <button
                  onClick={() => setSessionMood('happy')}
                  className={`p-1.5 rounded-full transition-colors ${sessionMood === 'happy' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-on-surface-variant'}`}
                  title="Excelente ritmo!"
                >
                  <Smile size={18} />
                </button>
                <button
                  onClick={() => setSessionMood('neutral')}
                  className={`p-1.5 rounded-full transition-colors ${sessionMood === 'neutral' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-on-surface-variant'}`}
                  title="Foco mediano"
                >
                  <Meh size={18} />
                </button>
                <button
                  onClick={() => setSessionMood('sad')}
                  className={`p-1.5 rounded-full transition-colors ${sessionMood === 'sad' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-on-surface-variant'}`}
                  title="Bloqueio criativo"
                >
                  <Frown size={18} />
                </button>
              </div>
              <span className="text-[9px] text-on-surface-variant block">Identificar seu ânimo melhora as estatísticas de escrita a longo prazo.</span>
            </div>

            {/* Stats table */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Dados do Capítulo</div>
              <div className="space-y-1.5 text-sm font-sans">
                <div className="flex justify-between py-1.5 border-b border-outline-variant text-on-surface-variant">
                  <span>Tempo de Leitura</span>
                  <span className="font-mono text-white font-medium">{readingTime()} min</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-outline-variant text-on-surface-variant">
                  <span>Contagem de Palavras</span>
                  <span className="font-mono text-white font-medium">{activeWords}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-outline-variant text-on-surface-variant">
                  <span>Caracteres Totais</span>
                  <span className="font-mono text-white font-medium">{activeChapter?.content.length || 0}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-outline-variant text-on-surface-variant">
                  <span>Parágrafos</span>
                  <span className="font-mono text-white font-medium">
                    {activeChapter?.content.split('\n\n').filter((p: string) => p.trim()).length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Word frequency analysis */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Palavras Mais Frequentes</div>
              {wordFrequency().length > 0 ? (
                <div className="space-y-2">
                  {wordFrequency().map(([word, freq]: [string, number]) => (
                    <div key={word} className="flex justify-between items-center bg-neutral-950 p-2 border border-outline-variant rounded-xl text-xs">
                      <span className="font-serif text-white italic">"{word}"</span>
                      <span className="font-mono text-indigo-400 text-xs bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">{freq} ocorrências</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">Escreva mais texto para visualizar as repetições de palavras.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Challenges */}
        {activeRightTool === 'challenges' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
            <p className="text-sm text-on-surface-variant leading-relaxed">Participe de desafios literários para turbinar a sua produtividade.</p>

            <div className="bg-surface-container-lowest/60 p-4 border border-outline-variant rounded-2xl space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white font-serif">Meia Maratona de Escrita</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Sua meta mensal de 10k palavras.</p>
                </div>
                <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">Ativo</span>
              </div>
              <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-outline-variant">
                <div className="bg-indigo-500 h-full w-[45%]" />
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant font-mono">
                <span>4.500 palavras</span>
                <span>10.000 alvo</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest/60 p-4 border border-emerald-500/10 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-neutral-300 font-serif">Arrancada de Fim de Semana</h4>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">Concluído</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-tight">Escreva 2.000 palavras entre sábado e domingo para liberar medalhas estelares.</p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: Pinned Notes */}
        {activeRightTool === 'notes' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-700 dark:text-neutral-300 flex flex-col justify-start h-full pr-1">
            <p className="text-xs text-on-surface-variant leading-relaxed text-left">
              Cards fixados ou criados diretamente aqui. As alterações de texto salvam automaticamente.
            </p>

            {/* Create New Card Form */}
            <div className="bg-surface dark:bg-surface-container-lowest/40 border border-neutral-200 dark:border-outline-variant p-3 rounded-2xl space-y-2 text-left">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Criar Nota / Card</div>
              <input
                type="text"
                id="new-note-title"
                placeholder="Título da nota..."
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant rounded-xl p-2 text-xs text-neutral-850 dark:text-white focus:outline-none"
              />
              <textarea
                id="new-note-content"
                placeholder="Descrição da nota..."
                rows={2}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant rounded-xl p-2 text-xs text-neutral-805 dark:text-white focus:outline-none resize-none"
              />
              <div className="flex gap-2 items-center text-xs">
                <select
                  id="new-note-section"
                  className="bg-neutral-55 dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant rounded-xl p-1.5 text-xs text-neutral-700 dark:text-white flex-1 focus:outline-none"
                >
                  {planningSections.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  const titleEl = document.getElementById('new-note-title') as HTMLInputElement;
                  const contentEl = document.getElementById('new-note-content') as HTMLTextAreaElement;
                  const sectionEl = document.getElementById('new-note-section') as HTMLSelectElement;
                  if (titleEl && titleEl.value.trim()) {
                    const newId = `pc-${Date.now()}`;
                    const newCard = {
                      id: newId,
                      column: sectionEl?.value || planningSections[0]?.id || 'planning',
                      title: titleEl.value.trim(),
                      content: contentEl.value.trim() || 'Sem descrição.',
                      tag: 'Geral' as const
                    };
                    setPlanningCards((prev: any) => [...prev, newCard]);
                    setPinnedCardsList((prev: any) => [...prev, newId]);
                    titleEl.value = '';
                    contentEl.value = '';
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
              >
                Criar Nota
              </button>
            </div>

            {/* Notes List */}
            <div
              className="space-y-3 mt-2 text-left"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('draggedCardId');
                const targetId = e.currentTarget.getAttribute('data-target-id');
                // Simple reorder helper
                if (draggedId && draggedId !== targetId) {
                  setPinnedCardsList((prev: any) => {
                    const filter = prev.filter((id: string) => id !== draggedId);
                    return [draggedId, ...filter];
                  });
                }
              }}
            >
              {planningCards.filter((c: any) => pinnedCardsList.includes(c.id)).map((card: any) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('draggedCardId', card.id);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-indigo-500');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-indigo-500');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-indigo-500');
                    const draggedId = e.dataTransfer.getData('draggedCardId');
                    if (draggedId && draggedId !== card.id) {
                      setPinnedCardsList((prev: any) => {
                        const list = [...prev];
                        const dragIndex = list.indexOf(draggedId);
                        const hoverIndex = list.indexOf(card.id);
                        if (dragIndex > -1 && hoverIndex > -1) {
                          list.splice(dragIndex, 1);
                          list.splice(hoverIndex, 0, draggedId);
                        }
                        return list;
                      });
                    }
                  }}
                  className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-3 rounded-2xl space-y-2 relative group shadow-sm transition-colors cursor-grab active:cursor-grabbing"
                >
                  <div className="font-serif font-bold text-neutral-900 dark:text-white flex justify-between items-center">
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => setPlanningCards((prev: any) => prev.map((c: any) => c.id === card.id ? { ...c, title: e.target.value } : c))}
                      className="bg-transparent border-none p-0 font-bold text-neutral-900 dark:text-white focus:outline-none w-full mr-2"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => togglePinCard(card.id)}
                        className="text-indigo-500 hover:text-on-surface-variant cursor-pointer"
                        title="Desafixar"
                      >
                        <Pin size={12} className="fill-indigo-500 rotate-45" />
                      </button>
                    </div>
                  </div>

                  {/* Render card images if any */}
                  {card.images && card.images.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {card.images.map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          alt="Note illustration"
                          className="w-16 h-12 object-cover rounded-lg border border-neutral-200 dark:border-outline-variant"
                        />
                      ))}
                    </div>
                  )}

                  <textarea
                    value={card.content}
                    rows={2}
                    onChange={(e) => setPlanningCards((prev: any) => prev.map((c: any) => c.id === card.id ? { ...c, content: e.target.value } : c))}
                    className="w-full bg-neutral-50 dark:bg-surface-container-lowest/60 border border-neutral-100 dark:border-outline-variant rounded-xl p-2 text-xs text-neutral-600 dark:text-neutral-300 focus:outline-none resize-none leading-relaxed"
                  />

                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant dark:text-on-surface-variant pt-1">
                    <span className="font-mono">Seção: {sectionIdToName[card.column] || 'Geral'}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">⋮ Drag to reorder</span>
                  </div>
                </div>
              ))}
              {planningCards.filter((c: any) => pinnedCardsList.includes(c.id)).length === 0 && (
                <div className="text-center py-8 text-neutral-600 dark:text-neutral-600 text-xs italic font-sans">Nenhum card fixado.</div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Track changes & revisions suggestions */}
        {activeRightTool === 'track' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
            {/* Toggle */}
            <div className="flex items-center justify-between bg-surface-container-lowest/60 p-3.5 border border-outline-variant rounded-2xl text-xs">
              <div>
                <span className="font-bold text-white block">Rastrear Alterações</span>
                <span className="text-xs text-on-surface-variant">Registrar histórico de modificações</span>
              </div>
              <input
                type="checkbox"
                checked={trackChanges}
                onChange={(e) => setTrackChanges(e.target.checked)}
                className="rounded border-outline-variant text-indigo-500 bg-neutral-950 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Sugestões de Estilo</div>
              {suggestions.map((s: any) => (
                <div key={s.id} className="bg-neutral-950 border border-outline-variant p-4 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-400 uppercase font-mono font-bold">{s.type === 'cliche' ? 'Clichê Detectado' : 'Repetição'}</span>
                    <button
                      onClick={() => setSuggestions(suggestions.filter((x: any) => x.id !== s.id))}
                      className="text-on-surface-variant hover:text-white cursor-pointer"
                    >
                      Dispensar
                    </button>
                  </div>
                  <p className="text-sm font-serif leading-relaxed text-neutral-300">
                    {s.comment}
                  </p>
                  <div className="flex justify-between items-center text-xs bg-surface-container-lowest p-2 rounded-lg border border-outline-variant">
                    <span className="text-red-400 line-through">"{s.original}"</span>
                    <span className="text-emerald-400">"{s.replacement}"</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Version history Snapshots */}
        {activeRightTool === 'history' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300 pr-1">
            <button
              onClick={createSnapshot}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus size={14} /> Salvar Snapshot Manual
            </button>

            <div className="text-[10px] text-on-surface-variant italic mb-2 px-1">
              Mostrando histórico do capítulo atual ({activeChapter?.title || 'Sem título'}). O salvamento automático ocorre a cada 60s.
            </div>

            <div className="space-y-2.5">
              {snapshots
                .filter((s: any) => !s.chapterId || s.chapterId === activeChapter?.id)
                .sort((a: any, b: any) => {
                  // Fallback for custom date formats from legacy snapshots
                  if (typeof a.timestamp === 'string' && a.timestamp.includes('/')) return -1;
                  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                })
                .map((snap: any) => (
                  <div key={snap.id} className="bg-neutral-950 border border-outline-variant p-3 rounded-xl space-y-3 group hover:border-indigo-500/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-serif font-semibold text-white">{snap.title}</h4>
                          {snap.isAuto && (
                            <span className="text-[8px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase font-bold">Auto</span>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant font-mono">{snap.timestamp}</p>
                      </div>
                      <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">{snap.charCount} carac.</span>
                    </div>
                  </div>
              ))}

              {snapshots.filter((s: any) => !s.chapterId || s.chapterId === activeChapter?.id).length === 0 && (
                <div className="text-center py-6 text-on-surface-variant text-xs italic font-sans border border-dashed border-outline-variant rounded-xl">
                  Nenhum snapshot salvo para este capítulo ainda.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Find & Replace */}
        {activeRightTool === 'search' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-on-surface-variant block">Localizar</label>
              <input
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Palavra ou termo..."
                className="w-full text-sm border border-outline-variant bg-neutral-950 text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-on-surface-variant block">Substituir por</label>
              <input
                type="text"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                placeholder="Nova palavra ou frase..."
                className="w-full text-sm border border-outline-variant bg-neutral-950 text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-2 text-xs font-sans">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Diferenciar maiúsculas/minúsculas</span>
                <input
                  type="checkbox"
                  checked={matchCase}
                  onChange={(e) => setMatchCase(e.target.checked)}
                  className="rounded border-outline-variant text-indigo-500 bg-neutral-950 w-4 h-4 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Apenas neste capítulo</span>
                <input
                  type="checkbox"
                  checked={searchOnlyThisChapter}
                  onChange={(e) => setSearchOnlyThisChapter(e.target.checked)}
                  className="rounded border-outline-variant text-indigo-500 bg-neutral-950 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={executeFindAndReplace}
              disabled={!findText}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-on-surface-variant text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-xl transition-all mt-4 cursor-pointer"
            >
              Substituir Ocorrências
            </button>
          </div>
        )}

        {/* TAB CONTENT: Spellcheck */}
        {activeRightTool === 'spell' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
            <div className="flex items-center justify-between bg-surface-container-lowest/60 p-3.5 border border-outline-variant rounded-2xl text-sm">
              <div>
                <span className="font-bold text-white block">Ativar Corretor</span>
                <span className="text-xs text-on-surface-variant">Exibir sublinhados ortográficos</span>
              </div>
              <input
                type="checkbox"
                checked={spellingActive}
                onChange={(e) => setSpellingActive(e.target.checked)}
                className="rounded border-outline-variant text-indigo-500 bg-neutral-950 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Inconsistências Encontradas</div>
              {spellingActive ? (
                <div className="space-y-2.5">
                  <div className="bg-neutral-950 border border-outline-variant p-3 rounded-xl text-sm space-y-1.5">
                    <div className="text-xs text-red-400 font-mono uppercase font-bold">Erro de Concordância</div>
                    <p className="font-serif italic">"...setecentas palavras haviam sido confiadas..."</p>
                    <span className="text-xs text-on-surface-variant block mt-1">Concordância passiva correta. Nenhuma alteração solicitada.</span>
                  </div>
                  <p className="text-sm text-on-surface-variant text-center py-4">Tudo limpo por aqui! Seu manuscrito não possui falhas crassas.</p>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant italic text-center">Ative o corretor ortográfico para realizar a varredura do texto.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: Footnotes (Item 7) */}
        {activeRightTool === 'footnotes' && (
          <div className="space-y-4 flex-1 overflow-y-auto text-neutral-700 dark:text-neutral-300 flex flex-col justify-start h-full pr-1">
            <p className="text-xs text-on-surface-variant leading-relaxed text-left">
              Crie notas de rodapé estilo Scrivener. Elas são inseridas inline como marcadores {"[" + "^" + "X]"} e gerenciadas aqui.
            </p>

            {/* Insert Inline Footnote Form */}
            <div className="bg-surface dark:bg-surface-container-lowest/40 border border-neutral-200 dark:border-outline-variant p-3 rounded-2xl space-y-2 text-left">
              <div className="text-xs font-bold text-on-surface-variant uppercase">Inserir Nota de Rodapé</div>
              <textarea
                id="new-footnote-text"
                placeholder="Texto da nota de rodapé..."
                rows={3}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant rounded-xl p-2 text-xs text-neutral-800 dark:text-white focus:outline-none resize-none"
              />
              <button
                onClick={() => {
                  const textEl = document.getElementById('new-footnote-text') as HTMLTextAreaElement;
                  if (!textEl || !textEl.value.trim() || !activeChapter) return;

                  const chapterNotes = footnotes[activeChapter.id] || [];
                  const nextNum = chapterNotes.length + 1;
                  const marker = "[" + "^" + nextNum + "]";

                  if (editor) {
                    editor.commands.insertContent(marker);

                    // Save footnote info
                    setFootnotes((prev: any) => ({
                      ...prev,
                      [activeChapter.id]: [
                        ...chapterNotes,
                        { id: `fn-${Date.now()}`, num: nextNum, text: textEl.value.trim() }
                      ]
                    }));

                    textEl.value = '';
                  } else {
                    alert("Por favor, clique na área de escrita onde deseja inserir a nota.");
                  }
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
              >
                Inserir Notas inline {"[" + "^" + "]"}
              </button>
            </div>

            {/* Footnotes List */}
            <div className="space-y-3 mt-2 text-left flex-1 overflow-y-auto">
              <div className="text-xs font-bold text-neutral-450 uppercase">Notas deste Capítulo</div>
              {(footnotes[activeChapter?.id || ''] || []).map((fn: any) => (
                <div key={fn.id} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-3 rounded-2xl space-y-2 relative group shadow-sm">
                  <div className="font-serif font-bold text-neutral-900 dark:text-white flex justify-between items-center">
                    <span>Nota {"[" + "^"}{fn.num}{"]"}</span>
                    <button
                      onClick={() => {
                        setFootnotes((prev: any) => ({
                          ...prev,
                          [activeChapter.id]: (prev[activeChapter.id] || []).filter((item: any) => item.id !== fn.id)
                        }));
                      }}
                      className="text-red-500 hover:text-red-750 text-xs font-semibold cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                  <textarea
                    value={fn.text}
                    rows={2}
                    onChange={(e) => {
                      const updatedText = e.target.value;
                      setFootnotes((prev: any) => ({
                        ...prev,
                        [activeChapter.id]: (prev[activeChapter.id] || []).map((item: any) =>
                          item.id === fn.id ? { ...item, text: updatedText } : item
                        )
                      }));
                    }}
                    className="w-full bg-neutral-50 dark:bg-surface-container-lowest/60 border border-neutral-100 dark:border-outline-variant rounded-xl p-2 text-xs text-neutral-600 dark:text-neutral-300 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              ))}
              {(!footnotes[activeChapter?.id || ''] || footnotes[activeChapter.id].length === 0) && (
                <div className="text-center py-8 text-on-surface-variant text-xs italic font-sans">Nenhuma nota de rodapé neste capítulo.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}
