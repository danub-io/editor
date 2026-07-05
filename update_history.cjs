const fs = require('fs');
let code = fs.readFileSync('src/components/gospelreads/workspace/sidebar/RightSidebar.tsx', 'utf8');

const historyRegex = /\{\/\* TAB CONTENT: Version history Snapshots \*\/\}.*?(?=\{\/\* TAB CONTENT: Find & Replace \*\/\})/s;

const historyReplacement = `{/* TAB CONTENT: Version history Snapshots */}
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
        )}\n\n        `;

code = code.replace(historyRegex, historyReplacement);
fs.writeFileSync('src/components/gospelreads/workspace/sidebar/RightSidebar.tsx', code);
