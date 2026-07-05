## Análise Crítica do GospelReads Editor (vs. Reedsy & Scrivener)

O projeto evoluiu bastante, adotando Zustand, modularização e testes automatizados. O visual está moderno, suporta drag-and-drop e a interface flui melhor sem diálogos nativos. No entanto, para ser considerado "premium" e superior ao Reedsy ou Scrivener, e para que os autores *adorem* usá-lo, ainda precisamos cobrir lacunas fundamentais de UX e arquitetura.

Aqui está uma análise honesta e sem preciosismo do que ainda está fraco ou faltando:

### 1. O Editor de Texto (Tiptap) ainda é básico
*   **Problema:** O coração de um software de escrita é o editor em si. Atualmente, a implementação do Tiptap está usando quase apenas a formatação básica do `StarterKit`.
*   **Falta (vs Reedsy/Scrivener):**
    *   **Tipografia e Formatação Editorial:** Faltam opções robustas de alinhamento justificado, espaçamento entre linhas, controle de parágrafos (recuo de primeira linha) nativos e atalhos globais de formatação focados no escritor.
    *   **Exportação e Compilação:** O Scrivener brilha na hora de compilar para ePub, PDF ou DOCX. Atualmente, não há um fluxo visível de exportação do manuscrito.
    *   **Comentários In-line e Revisão:** Ferramentas profissionais oferecem anotações marginais (comments) e marcações de revisão.
*   **Valor Real:** Melhorar o Tiptap (adicionar extensões para recuo, alinhamento, formatação de diálogo, etc.) transformaria a experiência de digitação.

### 2. Sincronização e Confiabilidade (Cloud)
*   **Problema:** O autosave e o versionamento foram implementados e o estado local migrado para o Zustand. Mas, pelo que vejo, a persistência pesada (banco de dados remoto com Drizzle) ainda não tem um fluxo de *offline-first* ou tratamento avançado de conflitos.
*   **Falta:** Se o autor fechar a aba abruptamente, o estado local e o backend estão perfeitamente sincronizados? O Reedsy é totalmente *cloud-based* e salva a cada tecla sem o usuário perceber. O Scrivener é desktop. O GospelReads precisa de um *sync* imbatível. O uso de CRDTs (como Yjs) atrelado ao Tiptap seria o padrão ouro para não perder nem uma vírgula.
*   **Valor Real:** Confiança. Escritores morrem de medo de perder o manuscrito. Se a sincronização falhar uma vez, eles abandonam a ferramenta.

### 3. Foco na Escrita (Distraction-Free)
*   **Problema:** Existe o modo "Distraction Free", mas a interface ainda tem muita informação competindo pela atenção (kanbans coloridos, barras laterais extensas).
*   **Falta:** Um modo tela cheia real (Focus Mode), estilo "máquina de escrever" (onde a linha atual fica sempre no centro da tela), similar ao iA Writer ou o próprio Scrivener no modo de foco.
*   **Valor Real:** Autores precisam de imersão profunda durante os "sprints" de escrita.

### 4. Organização Estrutural Profissional
*   **Problema:** O painel lateral (LeftSidebar) organiza capítulos e pastas. Funciona, mas é rígido.
*   **Falta:** O *Corkboard* (Quadro de Cortiça) do Scrivener é a *killer feature* deles. O Kanban atual do projeto é bom para planejamento genérico, mas conectar os cards do Kanban *diretamente* aos capítulos do manuscrito (como se as cenas fossem cards que podem ser reordenados livremente e agrupados visualmente) seria um diferencial enorme.
*   **Valor Real:** Ajudar o autor a resolver os "nós" da história visualmente.

### 5. Fichas de Personagem / Mundo Dinâmicas
*   **Problema:** As notas de planejamento estão soltas.
*   **Falta:** Em softwares como Campfire ou Scrivener, você pode "@" (mencionar) um personagem no texto ou clicar no nome dele e ver a ficha ao lado sem sair do capítulo.
*   **Valor Real:** Uma Wiki integrada reduz a fricção de ter que ficar alternando abas.

### Resumo:
O editor está bonito e tem uma base tecnológica excelente (Next.js, Tiptap, Zustand, Tailwind). No estado atual, ele é um "bom bloco de notas na nuvem".
Para desbancar o **Reedsy** (focado em layout automático e edição colaborativa) e o **Scrivener** (focado em controle massivo de estrutura e pesquisa), o projeto precisa:
1. Um Tiptap muito mais tunado (focado em book-writing, não apenas web-writing).
2. Garantia absoluta de sincronização (talvez com Yjs/WebSockets).
3. Integração total entre os cards de planejamento e o manuscrito.

Se esses 3 pontos forem lapidados, sim, os autores vão abandonar as opções clássicas para usar o GospelReads.
