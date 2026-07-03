/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import AnimatedThemeToggler from '@/registry/magicui/animated-theme-toggler';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Maximize2, 
  Minimize2, 
  Check, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Heading1, 
  FileText,
  AlignLeft,
  Trophy,
  Pin,
  MessageSquare,
  History,
  Search,
  Type,
  Download,
  User,
  Layout,
  BookMarked,
  HelpCircle,
  FolderOpen,
  X,
  PlusCircle,
  Eye,
  Smile,
  Meh,
  Frown,
  CheckCircle,
  Info,
  MapPin,
  Calendar,
  BarChart2,
  Copy,
  Move,
  Camera,
  Sun,
  Moon
} from 'lucide-react';
import { Chapter, WritingSettings, AuthorProfile, Book } from './types';
import Exporter from './Exporter';
import AuthorProfileBuilder from './AuthorProfileBuilder';

interface WorkspaceEditorProps {
  chapters: Chapter[];
  setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
  activeChapterId: string;
  setActiveChapterId: (id: string) => void;
  settings: WritingSettings;
  setSettings: React.Dispatch<React.SetStateAction<WritingSettings>>;
  profile: AuthorProfile;
  setProfile: React.Dispatch<React.SetStateAction<AuthorProfile>>;
  books: Book[];
  rightTab: string | null;
  setRightTab: (tab: string | null) => void;
}

interface PlanningTemplate {
  title: string;
  description: string;
  category: 'Worldbuilding' | 'Characters' | 'Settings' | 'Narrative devices';
  emoji: string;
}

const PLANNING_TEMPLATES: PlanningTemplate[] = [
  { title: 'Armor', description: "Clad your heroes and villains in armor that's ready for battle.", category: 'Worldbuilding', emoji: '🛡️' },
  { title: 'Business & Institutions', description: 'Build a business, guild, or institution from the ground up, defining everything from its origins, leadership, and operations.', category: 'Worldbuilding', emoji: '🏢' },
  { title: 'Culture', description: 'Explore the foundational aspects of a society and define its beliefs, daily practices, social structures, and customs.', category: 'Worldbuilding', emoji: '🏺' },
  { title: 'Fauna', description: 'Populate your world with dynamic, realistic fauna by exploring their physical traits, role in the ecosystem, cultural significance, and more.', category: 'Worldbuilding', emoji: '🦜' },
  { title: 'Flora', description: "It's thyme to branch out: craft plants with believable biology, wild magic, and roots that run through your world's culture.", category: 'Worldbuilding', emoji: '🌿' },
  { title: 'Food', description: "Cook up the dishes that define your world's cuisine and craft its culinary traditions.", category: 'Worldbuilding', emoji: '🍲' },
  { title: 'Government', description: 'Found the fictional governments of your world and create their structures, branches, laws, and history.', category: 'Worldbuilding', emoji: '🏛️' },
  { title: 'Historical Event', description: 'Document the rise, climax, and fallout of a key moment in your world’s history.', category: 'Worldbuilding', emoji: '⏳' },
  { title: 'Language', description: "Talk the talk — and build the languages your world can't live without by exploring their sound systems, scripts, grammar, and history.", category: 'Worldbuilding', emoji: '🗣️' },
  { title: 'Magic', description: 'Create a magic system from scratch and conjure its origins, rules, and logic into being.', category: 'Worldbuilding', emoji: '🪄' },
  { title: 'Religion', description: 'Invent a new religion worthy of worship in your world and then develop the doctrines, rituals, and moral codes that define it.', category: 'Worldbuilding', emoji: '🛐' },
  { title: 'Schools & Education', description: "Create the education systems that shape your world's thinkers and develop the curriculums, faculties, and traditions that make them deserving of enrollment.", category: 'Worldbuilding', emoji: '🏫' },
  { title: 'Species', description: "Build your world's next evolutionary marvel (or mistake), from their evolutionary traits all the way to their diet and culture.", category: 'Worldbuilding', emoji: '👽' },
  { title: 'Sport', description: 'Create a new sport for your world and decide on everything from its core rules to its players, fans, and cultural impact.', category: 'Worldbuilding', emoji: '⚽' },
  { title: 'Time', description: 'Tick-tock: shape the rhythm of your world by creating an original time system.', category: 'Worldbuilding', emoji: '⏰' },
  { title: 'Trade & Commerce', description: 'Money makes the world go round, and this Trade & Commerce template will make your world more well-rounded.', category: 'Worldbuilding', emoji: '🪙' },
  { title: 'Transportation', description: 'Give the people of your world mobility: create the transportation systems that will take them from one place to another.', category: 'Worldbuilding', emoji: '🚂' },
  { title: 'Very Important Person', description: 'Create the heroes, villains, and visionaries your world still whispers about — from their rise to fame to their deaths.', category: 'Worldbuilding', emoji: '👤' },
  { title: 'War', description: "Everything's fair in love and war, including a template for the latter.", category: 'Worldbuilding', emoji: '⚔️' },
  { title: 'Weapon', description: "Forge your world's armory, from its creation to its execution.", category: 'Worldbuilding', emoji: '🗡️' },
  
  { title: 'Antagonist', description: "Create an antagonist that challenges your hero — whether it's a villain, force of nature, or conflict within the protagonist themeslves.", category: 'Characters', emoji: '🦹' },
  { title: 'Antihero', description: 'Craft a morally complex antihero and explore the strengths, flaws, and moral code that will make them endlessly compelling to readers.', category: 'Characters', emoji: '🕶️' },
  { title: 'Character', description: "Build a fully realized character through Reedsy's Ultimate Character Profile and explore their personal background, personality, motivations, growth, and role within the story.", category: 'Characters', emoji: '👤' },
  { title: 'Confidant', description: "Develop a confidant who can anchor your protagonist's emotional journey.", category: 'Characters', emoji: '🤝' },
  { title: 'Joker', description: 'Create a mischievous, unpredictable trickster whose chaos drives change in your world.', category: 'Characters', emoji: '🃏' },
  { title: 'Mentor', description: 'Develop a mentor who can guide your protagonist in the right direction forward within your narrative.', category: 'Characters', emoji: '🧙‍♂️' },
  { title: 'Protagonist', description: 'Build a main character whose goals, fears, and values drive your story onward — and give your readers someone to root for.', category: 'Characters', emoji: '🦸' },
  { title: "Reedsy's 101 Questions", description: "Reedsy's character creation take on Vogue's \"73 Questions\": an interview series wherein an interviewer asks an interviewee a series of spontaneous questions covering everything from favorite things to insights on life.", category: 'Characters', emoji: '❓' },
  { title: 'Supporting Character', description: "Build out a supporting cast that's distinct, memorable, and necessary to your story.", category: 'Characters', emoji: '👥' },
  { title: 'The Proust Questionnaire | Celebrity Version', description: "The Proust Questionnaire is a series of introspective questions designed to reveal an individual's personality, values, and desires. This is the celebrity version.", category: 'Characters', emoji: '🎙️' },
  { title: 'The Proust Questionnaire | Original Version', description: "The Proust Questionnaire is a series of introspective questions designed to reveal an individual's personality, values, and desires. This is the original version.", category: 'Characters', emoji: '📜' },
  { title: 'Villain', description: "Craft a villain who's a worthy adversary for your hero — and gives your readers someone to root against.", category: 'Characters', emoji: '👿' },
  
  { title: 'Biome', description: 'Design a rich and immersive biome and build everything from its climate to its flora and fauna.', category: 'Settings', emoji: '🏜️' },
  { title: 'City', description: 'Create a city whose skyline, streets, and citizens tell their own story.', category: 'Settings', emoji: '🏙️' },
  { title: 'Continent', description: 'Create a continent big enough for mountains, coasts, dragons, dictators — and your cast of characters.', category: 'Settings', emoji: '🗺️' },
  { title: 'Country', description: 'Shape a country whose rise and fall drives your world, defining everything from its government structure and economy to its traditions and conflicts.', category: 'Settings', emoji: '🏳️' },
  { title: 'Landform', description: 'Explore the natural features of your world, from towering mountains to vast plains.', category: 'Settings', emoji: '🏔️' },
  { title: 'Landmark', description: 'Develop significant landmarks in your world, from temple ruins to natural caves.', category: 'Settings', emoji: '📍' },
  { title: 'Locale', description: 'Build a locale complete with atmosphere, secrets, and a population.', category: 'Settings', emoji: '🏡' },
  { title: 'Location', description: 'This Location template is a catch-all for any remaining locations in your world.', category: 'Settings', emoji: '📌' },
  { title: 'Planet', description: 'Tired of Earth? Create a new planet where the only boundaries are that of your own imagination.', category: 'Settings', emoji: '🪐' },
  
  { title: 'Conflict', description: "You wouldn't want your characters to reach those goals in a span of a few pages, right? Keep track of your evolving conflict.", category: 'Narrative devices', emoji: '💥' },
  { title: 'Stakes & Consequences', description: 'Craft stakes and consequences that will actually keep your readers invested.', category: 'Narrative devices', emoji: '⚖️' },
  { title: 'Symbol', description: 'Flesh out the significance of your symbol — and plan how to get it across to your readers.', category: 'Narrative devices', emoji: '🧿' },
  { title: 'Theme', description: 'Develop a theme that captures the moral or emotional core of your story.', category: 'Narrative devices', emoji: '💡' }
];

const PAGE_TEMPLATES: Record<string, { title: string; content: string }> = {
  'title-page': {
    title: 'Página de Título',
    content: '<div style="text-align: center; margin-top: 100px;">\n  <h1 style="font-size: 3rem; margin-bottom: 20px;">TÍTULO DO LIVRO</h1>\n  <h3 style="font-size: 1.5rem; font-style: italic;">Subtítulo da Obra</h3>\n  <div style="margin-top: 150px; font-size: 1.2rem;">Por Nome do Autor</div>\n</div>'
  },
  'copyright': {
    title: 'Direitos Autorais (Copyright)',
    content: '© 2026 Nome do Autor. Todos os direitos reservados.\n\nEsta é uma obra de ficção. Nomes, personagens, lugares e incidentes são produtos da imaginação do autor ou são usados de forma fictícia. Qualquer semelhança com pessoas reais, vivas ou mortas, negócios, eventos ou locais é mera coincidência.\n\nISBN: 978-0-00000-000-0\nEdição GospelReads.'
  },
  'dedication': {
    title: 'Dedicatória',
    content: '\n\n\n<div style="text-align: center; font-style: italic; margin-top: 150px;">\n  Dedico este livro a todos os que acreditam na força invisível das palavras e na poesia do infinito.\n</div>'
  },
  'foreword': {
    title: 'Prefácio',
    content: 'Escreva aqui o prefácio da obra. O prefácio costuma ser escrito por um terceiro/convidado apresentando o livro ao leitor.'
  },
  'introduction': {
    title: 'Introdução',
    content: 'Escreva a introdução ao tema do livro. Apresente as premissas e a jornada que o leitor está prestes a iniciar.'
  },
  'chapter': {
    title: 'Novo Capítulo',
    content: 'Escreva o corpo do seu capítulo aqui...'
  },
  'epilogue': {
    title: 'Epílogo',
    content: 'Escreva o epílogo do seu livro para encerrar a jornada narrativa...'
  },
  'author-bio': {
    title: 'Sobre o Autor',
    content: 'Escreva aqui sua biografia profissional e notas sobre sua carreira literária...'
  },
  'acknowledgments': {
    title: 'Agradecimentos',
    content: 'Gostaria de expressar meus sinceros agradecimentos a todos os que apoiaram a realização deste manuscrito...'
  }
};

interface PlanningCard {
  id: string;
  column: string;
  title: string;
  content: string;
  tag?: 'Estrutura' | 'Personagem' | 'Trama' | 'Cenário' | 'Geral';
}

interface PlanningBoard {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface PlanningBlock {
  id: string;
  boardId: string;
  title: string;
  type: 'character' | 'location' | 'event' | 'note';
  content: string;
  emoji?: string;
}

interface VersionSnapshot {
  id: string;
  timestamp: string;
  title: string;
  charCount: number;
}

export default function WorkspaceEditor({
  chapters,
  setChapters,
  activeChapterId,
  setActiveChapterId,
  settings,
  setSettings,
  profile,
  setProfile,
  books,
  rightTab,
  setRightTab
}: WorkspaceEditorProps) {
  // Navigation & UI layouts
  const [leftTab, setLeftTab] = useState<'manuscript' | 'planning' | 'characters' | 'locations' | 'events' | 'statistics'>('manuscript');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [dailyProgress, setDailyProgress] = useState(0);
  const [sessionMood, setSessionMood] = useState<'happy' | 'neutral' | 'sad' | null>(null);
  const [activePlanningCardId, setActivePlanningCardId] = useState<string | null>(null);
  
  // Search state
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [searchOnlyThisChapter, setSearchOnlyThisChapter] = useState(true);
  const [matchCase, setMatchCase] = useState(false);

  // Modals
  const [showExporterModal, setShowExporterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // World Building / Boards custom states
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardEmoji, setNewBoardEmoji] = useState('📂');
  const [newBoardDesc, setNewBoardDesc] = useState('');

  // Add Page Wizard Modal states
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [addPageSection, setAddPageSection] = useState<'front' | 'body' | 'back'>('body');
  const [addPageType, setAddPageType] = useState<string>('chapter');
  const [addPageTitle, setAddPageTitle] = useState<string>('');

  // Templates selector Modal states
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState<'all' | 'Worldbuilding' | 'Characters' | 'Settings' | 'Narrative devices'>('all');

  const [editingCard, setEditingCard] = useState<PlanningBlock | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardFormTitle, setCardFormTitle] = useState('');
  const [cardFormType, setCardFormType] = useState<'character' | 'location' | 'event' | 'note'>('note');
  const [cardFormContent, setCardFormContent] = useState('');
  const [cardFormEmoji, setCardFormEmoji] = useState('📝');
  const [isNewCard, setIsNewCard] = useState(false);

  // Refs
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Active Chapter
  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];

  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  // Inline add-card state (replaces window.prompt)
  const [addCardOpenFor, setAddCardOpenFor] = useState<'planning' | 'ato1' | 'ato2' | 'ato3' | null>(null);
  const [addCardTitle, setAddCardTitle] = useState('');
  const [addCardContent, setAddCardContent] = useState('');

  // Add board inline state
  const [addBoardInlineOpen, setAddBoardInlineOpen] = useState(false);
  const [addBoardInlineName, setAddBoardInlineName] = useState('');

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gospelreads_is_dark');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gospelreads_is_dark', String(isDark));
  }, [isDark]);

  // Trash panel
  const [trashOpen, setTrashOpen] = useState(false);

  // Global search panel (left sidebar)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Load and persist planning cards
  // Load and persist planning sections (Kanban columns)
  const [planningSections, setPlanningSections] = useState<{ id: string; name: string }[]>(() => {
    const saved = localStorage.getItem('gospelreads_planning_sections');
    return saved ? JSON.parse(saved) : [
      { id: 'planning', name: 'Planejamento' },
      { id: 'ato1', name: 'Ato I: Partida' },
      { id: 'ato2', name: 'Ato II: Iniciação' },
      { id: 'ato3', name: 'Ato III: Retorno' }
    ];
  });

  const [pinnedCardsList, setPinnedCardsList] = useState<string[]>(() => {
    const saved = localStorage.getItem('gospelreads_pinned_cards_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [deletedPlanningCards, setDeletedPlanningCards] = useState<PlanningCard[]>(() => {
    const saved = localStorage.getItem('gospelreads_deleted_planning_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const [planningCards, setPlanningCards] = useState<PlanningCard[]>(() => {
    const saved = localStorage.getItem('gospelreads_planning_cards');
    return saved ? JSON.parse(saved) : [
      { id: 'pc-0', column: 'planning', title: 'Get started', content: 'Use boards to plan, organize, or research anything.', tag: 'Geral' },
      { id: 'pc-0b', column: 'planning', title: 'Hero\'s Journey Example', content: 'Learn about the Hero\'s Journey.', tag: 'Estrutura' },
      { id: 'pc-1', column: 'ato1', title: 'Mundo Comum', content: 'Apresentar a vida corriqueira do protagonista e seus conflitos internos.', tag: 'Estrutura' },
      { id: 'pc-2', column: 'ato1', title: 'O Chamado para Escrita', content: 'Incentivo externo que desencadeia a necessidade de mudança.', tag: 'Trama' },
      { id: 'pc-3', column: 'ato2', title: 'Travessia do Limiar', content: 'O herói assume o compromisso e adentra o mundo especial do editor.', tag: 'Estrutura' },
      { id: 'pc-4', column: 'ato2', title: 'Novos Aliados', content: 'Aparecimento de personagens que ajudam na estruturação e estilo do texto.', tag: 'Personagem' },
      { id: 'pc-5', column: 'ato3', title: 'A Provação Suprema', content: 'Resolução das tensões acumuladas em um clímax emocionante.', tag: 'Trama' },
      { id: 'pc-6', column: 'ato3', title: 'Retorno com o Elixir', content: 'O livro é exportado e distribuído no marketplace com glória.', tag: 'Cenário' }
    ];
  });

  // Load and persist planning boards and blocks
  const [planningBoards, setPlanningBoards] = useState<PlanningBoard[]>(() => {
    const saved = localStorage.getItem('gospelreads_planning_boards');
    return saved ? JSON.parse(saved) : [
      { id: 'pb-1', name: 'Personagens', emoji: '🎭', description: 'Fichas detalhadas dos protagonistas, antagonistas e secundários.' },
      { id: 'pb-2', name: 'Locais', emoji: '🗺️', description: 'Pontos importantes do mundo, reinos, cidades e salas.' },
      { id: 'pb-3', name: 'Eventos da Trama', emoji: '⏳', description: 'Acontecimentos marcantes da narrativa e marcos cronológicos.' }
    ];
  });

  const [planningBlocks, setPlanningBlocks] = useState<PlanningBlock[]>(() => {
    const saved = localStorage.getItem('gospelreads_planning_blocks');
    return saved ? JSON.parse(saved) : [
      { id: 'pbl-1', boardId: 'pb-1', title: 'Luana Costa', type: 'character', content: 'Protagonista. Escritora que descobre que suas palavras moldam o espaço sideral.', emoji: '✍️' },
      { id: 'pbl-2', boardId: 'pb-2', title: 'Biblioteca de Alexandria II', type: 'location', content: 'Grande acervo localizado na órbita de Netuno.', emoji: '🚀' },
      { id: 'pbl-3', boardId: 'pb-3', title: 'O Grande Alinhamento', type: 'event', content: 'Evento astronômico que conecta todas as dimensões literárias.', emoji: '🪐' }
    ];
  });


  // Load and persist pinned notes
  const [pinnedNotes, setPinnedNotes] = useState(() => {
    return localStorage.getItem('gospelreads_pinned_notes') || 'Use este bloco de notas fixado para rascunhar ideias rápidas, nomes de personagens importantes, datas marcantes ou lembretes literários que precisam ficar à vista.';
  });

  // Load and persist version snapshots
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>(() => {
    const saved = localStorage.getItem('gospelreads_version_snapshots');
    return saved ? JSON.parse(saved) : [
      { id: 'snap-1', timestamp: '29/06/2026, 14:32', title: 'Rascunho Inicial do Cap 1', charCount: 820 },
      { id: 'snap-2', timestamp: '29/06/2026, 18:15', title: 'Revisão Ortográfica Geral', charCount: 1150 }
    ];
  });

  // Track changes & spelling recommendations
  const [trackChanges, setTrackChanges] = useState(false);
  const [spellingActive, setSpellingActive] = useState(true);
  const [suggestions, setSuggestions] = useState([
    { id: 's-1', type: 'cliche', original: 'beijar o horizonte', replacement: 'tocar a linha do horizonte', comment: 'Considere evitar o clichê "beijar o horizonte".' },
    { id: 's-2', type: 'repetition', original: 'folha', replacement: 'página', comment: 'Repetição da palavra "folha" em parágrafos adjacentes.' }
  ]);
  const [deletedChapters, setDeletedChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    localStorage.setItem('gospelreads_planning_sections', JSON.stringify(planningSections));
  }, [planningSections]);

  useEffect(() => {
    localStorage.setItem('gospelreads_pinned_cards_list', JSON.stringify(pinnedCardsList));
  }, [pinnedCardsList]);

  useEffect(() => {
    localStorage.setItem('gospelreads_deleted_planning_cards', JSON.stringify(deletedPlanningCards));
  }, [deletedPlanningCards]);

  useEffect(() => {
    localStorage.setItem('gospelreads_planning_cards', JSON.stringify(planningCards));
  }, [planningCards]);

  useEffect(() => {
    localStorage.setItem('gospelreads_planning_boards', JSON.stringify(planningBoards));
  }, [planningBoards]);

  useEffect(() => {
    localStorage.setItem('gospelreads_planning_blocks', JSON.stringify(planningBlocks));
  }, [planningBlocks]);

  useEffect(() => {
    localStorage.setItem('gospelreads_pinned_notes', pinnedNotes);
  }, [pinnedNotes]);

  useEffect(() => {
    localStorage.setItem('gospelreads_version_snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  // Route routing checks for active exporter/profile tab
  useEffect(() => {
    if (rightTab === 'exporter') {
      setShowExporterModal(true);
      setRightTab(null);
    } else if (rightTab === 'profile') {
      setShowProfileModal(true);
      setRightTab(null);
    }
  }, [rightTab, setRightTab]);

  // Word & statistics math
  const countWords = (text: string) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const activeWords = activeChapter ? countWords(activeChapter.content) : 0;
  const totalWords = chapters.reduce((sum, ch) => sum + countWords(ch.content), 0);
  const totalChars = chapters.reduce((sum, ch) => sum + ch.content.length, 0);

  // Daily target updater
  useEffect(() => {
    const percentage = Math.min(Math.round((activeWords / settings.dailyGoal) * 100), 100);
    setDailyProgress(percentage);
  }, [activeWords, settings.dailyGoal]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setSaveStatus('dirty');
    
    // Update chapter state
    setChapters(prev => prev.map(ch => {
      if (ch.id === activeChapterId) {
        return { ...ch, content: newContent };
      }
      return ch;
    }));

    // Debounce saves
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    setSaveStatus('saving');
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 1200);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setChapters(prev => prev.map(ch => {
      if (ch.id === activeChapterId) {
        return { ...ch, title: newTitle };
      }
      return ch;
    }));
  };

  const handleAddPage = (section: 'front' | 'body' | 'back', type: string, title: string, partId?: string) => {
    const template = PAGE_TEMPLATES[type] || { title: 'Nova Página', content: '' };
    const nextOrder = chapters.length > 0 ? Math.max(...chapters.map(c => c.order)) + 1 : 1;
    const newCh: Chapter = {
      id: `ch-${Date.now()}`,
      title: title || template.title,
      content: template.content,
      order: nextOrder,
      section,
      type: type as any,
      partId
    };
    setChapters([...chapters, newCh]);
    setActiveChapterId(newCh.id);
    setShowAddPageModal(false);
  };

  const deleteChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapters.length <= 1) {
      alert('Você precisa ter pelo menos um capítulo em seu manuscrito.');
      return;
    }
    const chapterToDelete = chapters.find(c => c.id === id);
    if (!chapterToDelete) return;

    const confirmDelete = window.confirm(`Deseja realmente excluir o "${chapterToDelete.title}"? O capítulo será enviado para a lixeira temporária do editor.`);
    if (!confirmDelete) return;

    // Save to deleted list for possible recovery
    setDeletedChapters(prev => [...prev, chapterToDelete]);

    const filtered = chapters.filter(c => c.id !== id);
    setChapters(filtered);
    if (activeChapterId === id) {
      setActiveChapterId(filtered[0].id);
    }
  };

  const restoreChapter = (ch: Chapter) => {
    setChapters(prev => [...prev, ch]);
    setDeletedChapters(prev => prev.filter(c => c.id !== ch.id));
    setActiveChapterId(ch.id);
  };

  const moveChapterInSection = (id: string, direction: 'up' | 'down') => {
    const ch = chapters.find(c => c.id === id);
    if (!ch) return;
    const section = ch.section || 'body';
    
    // Find all chapters in the same section, sorted by order
    const sectionChapters = chapters
      .filter(c => (c.section || 'body') === section)
      .sort((a, b) => a.order - b.order);
      
    const index = sectionChapters.findIndex(c => c.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sectionChapters.length - 1) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const targetCh = sectionChapters[targetIndex];
    
    // Swap the order values of ch and targetCh
    const tempOrder = ch.order;
    const updatedChapters = chapters.map(c => {
      if (c.id === ch.id) return { ...c, order: targetCh.order };
      if (c.id === targetCh.id) return { ...c, order: tempOrder };
      return c;
    });
    
    setChapters(updatedChapters);
  };

  // Typography styling lookups
  const getFontClass = () => {
    switch (settings.preferredFont) {
      case 'serif': return 'font-serif tracking-normal leading-relaxed';
      case 'mono': return 'font-mono text-sm leading-6 tracking-tight';
      case 'sans': default: return 'font-sans tracking-tight leading-relaxed';
    }
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'sm': return 'text-sm md:text-base';
      case 'lg': return 'text-lg md:text-xl';
      case 'xl': return 'text-xl md:text-2xl';
      case 'md': default: return 'text-base md:text-lg';
    }
  };

  // Metas math helpers
  const wordFrequency = () => {
    if (!activeChapter || !activeChapter.content) return [];
    const cleanText = activeChapter.content.toLowerCase()
      .replace(/[^\w\sÀ-ÿ]/g, '')
      .replace(/[0-9]/g, '');
    const words = cleanText.split(/\s+/).filter(w => w.length > 3);
    const counts: { [key: string]: number } = {};
    words.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const readingTime = () => {
    const totalW = activeChapter ? countWords(activeChapter.content) : 0;
    // Average reading speed: 200 words per minute
    return Math.max(1, Math.round(totalW / 200));
  };

  // Snapshots
  const createSnapshot = () => {
    if (!activeChapter) return;
    const title = window.prompt('Dê um título para esta versão do capítulo:', `Snapshot do ${activeChapter.title}`);
    if (!title) return;
    const newSnap: VersionSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toLocaleString('pt-BR'),
      title,
      charCount: activeChapter.content.length
    };
    setSnapshots([newSnap, ...snapshots]);
  };

  // Find and replace execution
  const executeFindAndReplace = () => {
    if (!findText) return;
    const regexFlags = matchCase ? 'g' : 'gi';
    const regex = new RegExp(findText, regexFlags);
    
    if (searchOnlyThisChapter) {
      const newContent = activeChapter.content.replace(regex, replaceText);
      setChapters(prev => prev.map(ch => ch.id === activeChapterId ? { ...ch, content: newContent } : ch));
      alert('Substituição realizada com sucesso no capítulo atual.');
    } else {
      setChapters(prev => prev.map(ch => {
        const updatedContent = ch.content.replace(regex, replaceText);
        return { ...ch, content: updatedContent };
      }));
      alert('Substituição realizada em todos os capítulos do manuscrito.');
    }
  };

  // Planning board helpers
  const addPlanningCard = (column: string, title?: string, content?: string) => {
    const cardTitle = title !== undefined ? title : window.prompt('Digite o título para o seu card de planejamento:') || '';
    if (!cardTitle.trim()) return;
    const cardContent = content !== undefined ? content : window.prompt('Digite uma breve descrição para o card:') || '';
    
    const newCard: PlanningCard = {
      id: `pc-${Date.now()}`,
      column,
      title: cardTitle.trim(),
      content: cardContent.trim(),
      tag: 'Geral'
    };
    setPlanningCards([...planningCards, newCard]);
  };

  const commitAddCard = (column: string) => {
    addPlanningCard(column, addCardTitle, addCardContent);
    setAddCardTitle('');
    setAddCardContent('');
    setAddCardOpenFor(null);
  };

  // Dynamic Kanban Sections helpers
  const addPlanningSection = () => {
    const sectionName = window.prompt("Nome da nova seção:", "Nova Seção");
    if (sectionName && sectionName.trim()) {
      const newSection = {
        id: `sec-${Date.now()}`,
        name: sectionName.trim()
      };
      setPlanningSections(prev => [...prev, newSection]);
    }
  };

  const deletePlanningSection = (id: string) => {
    if (planningSections.length <= 1) {
      alert("Você precisa manter pelo menos uma seção.");
      return;
    }
    if (window.confirm("Deseja realmente excluir esta seção? Todos os cards nela serão movidos para a primeira seção.")) {
      const firstSectionId = planningSections.find(s => s.id !== id)?.id || planningSections[0].id;
      setPlanningCards(prev => prev.map(card => card.column === id ? { ...card, column: firstSectionId } : card));
      setPlanningSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const renamePlanningSection = (id: string, currentName: string) => {
    const newName = window.prompt("Novo nome para a seção:", currentName);
    if (newName && newName.trim()) {
      setPlanningSections(prev => prev.map(s => s.id === id ? { ...s, name: newName.trim() } : s));
    }
  };

  const togglePinCard = (id: string) => {
    setPinnedCardsList(prev => {
      const isPinned = prev.includes(id);
      if (isPinned) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const softDeletePlanningCard = (id: string) => {
    const card = planningCards.find(c => c.id === id);
    if (card) {
      setDeletedPlanningCards(prev => [...prev, card]);
      setPlanningCards(prev => prev.filter(c => c.id !== id));
      setPinnedCardsList(prev => prev.filter(item => item !== id));
    }
  };

  const deletePlanningCard = (id: string) => {
    softDeletePlanningCard(id);
  };

  // World Building / Boards helper functions
  const handleAddBoard = () => {
    if (!newBoardName.trim()) {
      alert('Por favor, informe o nome da ficha.');
      return;
    }
    const newBoard: PlanningBoard = {
      id: `pb-${Date.now()}`,
      name: newBoardName,
      emoji: newBoardEmoji || '📂',
      description: newBoardDesc
    };
    setPlanningBoards([...planningBoards, newBoard]);
    setNewBoardName('');
    setNewBoardDesc('');
    setNewBoardEmoji('📂');
    setShowNewBoardModal(false);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Excluir esta pasta de fichas e todas as suas sub-fichas permanentemente?')) {
      setPlanningBoards(planningBoards.filter(b => b.id !== boardId));
      setPlanningBlocks(planningBlocks.filter(c => c.boardId !== boardId));
      if (activeBoardId === boardId) {
        setActiveBoardId(null);
      }
    }
  };

  const handleOpenNewCard = () => {
    if (!activeBoardId) return;
    setIsNewCard(true);
    setCardFormTitle('');
    setCardFormType('note');
    setCardFormContent('');
    setCardFormEmoji('📝');
    setShowCardModal(true);
  };

  const handleOpenEditCard = (card: PlanningBlock) => {
    setIsNewCard(false);
    setEditingCard(card);
    setCardFormTitle(card.title);
    setCardFormType(card.type);
    setCardFormContent(card.content);
    setCardFormEmoji(card.emoji || '📝');
    setShowCardModal(true);
  };

  const handleSaveCard = () => {
    if (!cardFormTitle.trim()) {
      alert('Por favor, insira o título do bloco.');
      return;
    }

    if (isNewCard) {
      if (!activeBoardId) return;
      const newCard: PlanningBlock = {
        id: `pbl-${Date.now()}`,
        boardId: activeBoardId,
        title: cardFormTitle,
        type: cardFormType,
        content: cardFormContent,
        emoji: cardFormEmoji
      };
      setPlanningBlocks([...planningBlocks, newCard]);
    } else {
      if (!editingCard) return;
      setPlanningBlocks(prev => prev.map(c => c.id === editingCard.id ? {
        ...c,
        title: cardFormTitle,
        type: cardFormType,
        content: cardFormContent,
        emoji: cardFormEmoji
      } : c));
    }
    setShowCardModal(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Excluir este bloco permanentemente?')) {
      setPlanningBlocks(planningBlocks.filter(c => c.id !== cardId));
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDrop = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId) {
      setPlanningCards(prev => prev.map(c => c.id === cardId ? { ...c, column } : c));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addCardFromTemplate = (templateName: string) => {
    const defaultContents: Record<string, { title: string; content: string; tag: string }> = {
      'Blank note': { title: 'Nova Nota', content: 'Rascunho de ideias rápidas para a narrativa.', tag: 'Geral' },
      'Folder': { title: 'Nova Pasta', content: 'Agrupamento de subtramas.', tag: 'Estrutura' },
      'Worldbuilding': { title: 'Novo Elemento', content: 'Aspectos de ambientação e regras do mundo.', tag: 'Cenário' },
      'Characters': { title: 'Novo Personagem', content: 'Motivação, fraqueza e arco dramático do personagem.', tag: 'Personagem' },
      'Settings': { title: 'Nova Configuração', content: 'Regras ou diretrizes da narrativa.', tag: 'Estrutura' },
      'Narrative devices': { title: 'Dispositivo Narrativo', content: 'Pistas falsas, prenúncios (foreshadowing) ou cliffhangers.', tag: 'Trama' },
      'Browse templates': { title: 'Template de Jornada', content: 'Estrutura de jornada literária baseada em modelos.', tag: 'Estrutura' }
    };
    const details = defaultContents[templateName] || defaultContents['Blank note'];
    const newCard: PlanningCard = {
      id: `pc-${Date.now()}`,
      column: 'planning',
      title: details.title,
      content: details.content,
      tag: details.tag as any
    };
    setPlanningCards(prev => [...prev, newCard]);
  };

  const addTemplateCard = (tpl: PlanningTemplate) => {
    const newCard: PlanningCard = {
      id: `pc-${Date.now()}`,
      column: 'planning',
      title: tpl.title,
      content: tpl.description,
      tag: tpl.category === 'Worldbuilding' ? 'Cenário' :
           tpl.category === 'Characters' ? 'Personagem' :
           tpl.category === 'Settings' ? 'Cenário' : 'Trama'
    };
    setPlanningCards(prev => [...prev, newCard]);
    alert(`Card "${tpl.title}" adicionado ao seu planejamento!`);
  };

  const renderManuscriptItem = (ch: Chapter, idx: number, arr: Chapter[]) => (
    <div
      key={ch.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', ch.id);
        e.dataTransfer.setData('dragType', 'chapter');
      }}
      onClick={() => setActiveChapterId(ch.id)}
      className={`group flex items-center justify-between p-2.5 cursor-pointer border rounded-xl cursor-grab active:cursor-grabbing ${
        ch.id === activeChapterId 
          ? 'border-indigo-500 bg-indigo-500/10 font-medium text-indigo-300' 
          : 'border-transparent text-neutral-400 hover:border-neutral-850 hover:bg-neutral-900/40 hover:text-neutral-200'
      } transition-all duration-150`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="text-[11px] font-mono text-neutral-500 shrink-0">#{idx + 1}</span>
        <span className="text-sm truncate font-serif">{ch.title || 'Sem título'}</span>
      </div>
      
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button 
          onClick={(e) => { e.stopPropagation(); moveChapterInSection(ch.id, 'up'); }}
          disabled={idx === 0}
          className="p-0.5 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded disabled:opacity-30"
          title="Subir"
        >
          <ChevronUp size={12} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); moveChapterInSection(ch.id, 'down'); }}
          disabled={idx === arr.length - 1}
          className="p-0.5 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 rounded disabled:opacity-30"
          title="Descer"
        >
          <ChevronDown size={12} />
        </button>
        <button 
          onClick={(e) => deleteChapter(ch.id, e)}
          className="p-0.5 hover:bg-red-950/40 text-red-400 rounded"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );

  // Local state for right active sidebar tool
  const [activeRightTool, setActiveRightTool] = useState<string | null>(null);

  return (
    <div className="w-full flex bg-[#09090b] h-screen max-h-screen overflow-hidden relative editor-workspace">
      
      {/* COLLAPSIBLE LEFT SIDEBAR ICON STRIP */}
      {!isDistractionFree && (
        <aside className="w-16 border-r border-neutral-900 bg-[#09090b] flex flex-col justify-between items-center py-4 shrink-0 select-none hidden lg:flex">
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
                  : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
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
                  : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
              }`}
              title="Planejamento"
            >
              <Layout size={18} />
            </button>
          </div>

          {/* Bottom: avatar, search, trash, theme — bottom-to-top */}
          <div className="flex flex-col-reverse items-center gap-3">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-indigo-500/30 transition-colors"
              title="Perfil"
            >
              U
            </div>

            {/* Global search */}
            <button
              onClick={() => setGlobalSearchOpen(o => !o)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                globalSearchOpen
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
              }`}
              title="Busca global"
            >
              <Search size={18} />
            </button>

            {/* Trash */}
            <button
              onClick={() => setTrashOpen(o => !o)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                trashOpen
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
              }`}
              title="Lixeira"
            >
              <Trash2 size={18} />
            </button>

            {/* Theme toggle using AnimatedThemeToggler */}
            <div className="p-2 rounded-xl">
              <AnimatedThemeToggler 
                theme={isDark ? 'dark' : 'light'} 
                onThemeChange={(newTheme) => setIsDark(newTheme === 'dark')} 
              />
            </div>
          </div>
        </aside>
      )}

      {/* LEFT SIDEBAR: MANUSCRITO OR PLANEJAMENTO */}
      {!isDistractionFree && isLeftPanelOpen && (
        <aside className="w-80 border-r border-neutral-900 bg-[#0c0c0e] flex flex-col justify-between shrink-0 hidden lg:flex select-none">
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Sidebar Title Header with Close Button */}
            <div className="p-4 border-b border-neutral-900 flex items-center justify-between gap-3 bg-[#09090b]">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-sans select-none">
                {leftTab === 'manuscript' && 'Manuscrito'}
                {leftTab === 'planning' && 'Quadro de Plotagem'}
                {leftTab === 'characters' && 'Personagens'}
                {leftTab === 'locations' && 'Locais'}
                {leftTab === 'events' && 'Eventos da Trama'}
                {leftTab === 'statistics' && 'Estatísticas'}
              </span>
              <button 
                onClick={() => setIsLeftPanelOpen(false)} 
                className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                title="Recolher Painel"
              >
                <X size={14} />
              </button>
            </div>

            {/* Render left Tab: Manuscript Chapters manager */}
            {leftTab === 'manuscript' && (
              <div className="p-5 flex-1 flex flex-col overflow-y-auto justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1 select-none">
                      <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
                        <FolderOpen size={13} /> Estrutura ({chapters.length} Caps)
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                        <span className={`w-1 h-1 rounded-full ${
                          saveStatus === 'saved' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' :
                          saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : 'bg-gray-500'
                        }`} />
                        {saveStatus === 'saved' ? 'Sincronizado' :
                         saveStatus === 'saving' ? 'Salvando...' : 'Não salvo'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                    {/* 1. FRONT MATTER SECTION */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 pl-1 py-1 border-b border-neutral-900 flex items-center justify-between select-none">
                        <span>Páginas Iniciais</span>
                        <button 
                          onClick={() => {
                            const title = window.prompt("Título da nova Página Inicial:");
                            if (title) handleAddPage('front', 'custom', title);
                          }}
                          className="text-xs text-indigo-400 hover:text-white cursor-pointer font-bold animate-pulse"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-1">
                        {chapters
                          .filter(ch => ch.section === 'front')
                          .sort((a, b) => a.order - b.order)
                          .map((ch, idx, arr) => renderManuscriptItem(ch, idx, arr))}
                        {chapters.filter(ch => ch.section === 'front').length === 0 && (
                          <div className="text-xs text-neutral-500 pl-2 italic">Nenhuma página inicial</div>
                        )}
                      </div>
                    </div>

                    {/* 2. BODY SECTION (MAIN CONTENT & PARTS) */}
                    <div className="space-y-1">
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          const chapterId = e.dataTransfer.getData('text/plain');
                          const dragType = e.dataTransfer.getData('dragType');
                          if (dragType === 'chapter' && chapterId) {
                            setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, partId: undefined } : c));
                          }
                        }}
                        className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 pl-1 py-1 border-b border-neutral-900 flex items-center justify-between select-none"
                      >
                        <span>Conteúdo Principal</span>
                        <button 
                          onClick={() => {
                            const isPart = window.confirm("Deseja criar uma nova Parte? (OK para Parte, Cancelar para Capítulo)");
                            if (isPart) {
                              const title = window.prompt("Título da nova Parte:");
                              if (title) handleAddPage('body', 'part', title);
                            } else {
                              const title = window.prompt("Título do novo Capítulo:");
                              if (title) handleAddPage('body', 'chapter', title);
                            }
                          }}
                          className="text-xs text-indigo-400 hover:text-white cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="space-y-2.5 pt-1.5">
                        {(() => {
                          const bodyItems = chapters.filter(ch => ch.section === 'body' || !ch.section);
                          const parts = bodyItems.filter(ch => ch.type === 'part').sort((a, b) => a.order - b.order);
                          const rootChapters = bodyItems.filter(ch => ch.type !== 'part' && !ch.partId).sort((a, b) => a.order - b.order);

                          return (
                            <div className="space-y-2">
                              {/* Parts and nested chapters */}
                              {parts.map((part) => {
                                const partChapters = bodyItems.filter(ch => ch.type !== 'part' && ch.partId === part.id).sort((a, b) => a.order - b.order);
                                return (
                                  <div 
                                    key={part.id} 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.stopPropagation();
                                      const chapterId = e.dataTransfer.getData('text/plain');
                                      const dragType = e.dataTransfer.getData('dragType');
                                      if (dragType === 'chapter' && chapterId && chapterId !== part.id) {
                                        setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, partId: part.id } : c));
                                      }
                                    }}
                                    className="bg-neutral-900/30 border border-neutral-850 rounded-xl p-2.5 space-y-2"
                                  >
                                    <div className="flex justify-between items-center select-none border-b border-neutral-800 pb-1.5">
                                      <span 
                                        onClick={() => setActiveChapterId(part.id)}
                                        className={`text-sm font-bold text-neutral-200 flex items-center gap-1.5 cursor-pointer hover:text-indigo-400 transition-colors ${
                                          part.id === activeChapterId ? 'text-indigo-400 font-semibold' : ''
                                        }`}
                                      >
                                        📁 {part.title}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={() => {
                                            const chTitle = window.prompt(`Título do novo Capítulo para "${part.title}":`);
                                            if (chTitle) {
                                              handleAddPage('body', 'chapter', chTitle, part.id);
                                            }
                                          }}
                                          className="text-[11px] text-indigo-400 hover:text-white cursor-pointer font-bold"
                                          title="Adicionar capítulo a esta parte"
                                        >
                                          + Cap
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Excluir a parte "${part.title}"? Os capítulos desta parte voltarão para o nível principal.`)) {
                                              setChapters(prev => prev.map(c => c.partId === part.id ? { ...c, partId: undefined } : c).filter(c => c.id !== part.id));
                                            }
                                          }}
                                          className="text-neutral-500 hover:text-red-400 cursor-pointer"
                                          title="Excluir parte"
                                        >
                                          <Trash2 size={11} />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-1 pl-3.5 border-l border-neutral-800">
                                      {partChapters.map((ch, idx, arr) => renderManuscriptItem(ch, idx, arr))}
                                      {partChapters.length === 0 && (
                                        <div className="text-[10px] text-neutral-600 italic select-none py-1">Arraste capítulos aqui</div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Root chapters */}
                              <div className="space-y-1">
                                {rootChapters.map((ch, idx, arr) => renderManuscriptItem(ch, idx, arr))}
                              </div>

                              {bodyItems.length === 0 && (
                                <div className="text-xs text-neutral-500 pl-2 italic">Nenhum capítulo ou parte criada</div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* 3. BACK MATTER SECTION */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 pl-1 py-1 border-b border-neutral-900 flex items-center justify-between select-none">
                        <span>Páginas Finais</span>
                        <button 
                          onClick={() => {
                            const title = window.prompt("Título da nova Página Final:");
                            if (title) handleAddPage('back', 'custom', title);
                          }}
                          className="text-xs text-indigo-400 hover:text-white cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                      <div className="space-y-1">
                        {chapters
                          .filter(ch => ch.section === 'back')
                          .sort((a, b) => a.order - b.order)
                          .map((ch, idx, arr) => renderManuscriptItem(ch, idx, arr))}
                        {chapters.filter(ch => ch.section === 'back').length === 0 && (
                          <div className="text-xs text-neutral-500 pl-2 italic">Nenhuma página final</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Render left Tab: Interactive Kanban Planning Board — hidden, planning goes full-screen */}
            {leftTab === 'planning' && false && (
              <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5 font-sans">
                    <Layout size={14} /> Quadro de Plotagem
                  </span>
                  <p className="text-xs text-neutral-500 font-mono">Três Atos</p>
                </div>

                {/* Column lists (vertical mini bento stacks) */}
                <div className="space-y-4">
                  {/* Ato 1 */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'ato1')}
                    className="bg-neutral-900/40 p-3 border border-neutral-850 rounded-2xl space-y-2 min-h-[120px] transition-all"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-1">
                      <span className="text-sm font-bold text-white uppercase font-serif">Ato I: Partida</span>
                      <button onClick={() => addPlanningCard('ato1')} className="text-indigo-400 hover:text-white cursor-pointer">
                        <PlusCircle size={14} />
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-[22vh] overflow-y-auto pr-1">
                      {planningCards.filter(c => c.column === 'ato1').map(card => (
                        <div 
                          key={card.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id)}
                          className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg text-sm relative group space-y-1 cursor-grab active:cursor-grabbing select-none hover:border-neutral-700 transition-all"
                        >
                          <div className="font-serif font-semibold text-white pr-4">{card.title}</div>
                          <p className="text-neutral-400 text-xs leading-normal font-sans">{card.content}</p>
                          <div className="flex justify-between items-center pt-1 border-t border-neutral-850/50 mt-1.5">
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Estrutura'}</span>
                            <button onClick={() => deletePlanningCard(card.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-auto transition-opacity cursor-pointer">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {planningCards.filter(c => c.column === 'ato1').length === 0 && (
                        <div className="text-center py-4 text-neutral-500 text-xs font-sans italic">Arrastar cards aqui</div>
                      )}
                    </div>
                  </div>

                  {/* Ato 2 */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'ato2')}
                    className="bg-neutral-900/40 p-3 border border-neutral-850 rounded-2xl space-y-2 min-h-[120px] transition-all"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-1">
                      <span className="text-sm font-bold text-white uppercase font-serif">Ato II: Confronto</span>
                      <button onClick={() => addPlanningCard('ato2')} className="text-indigo-400 hover:text-white cursor-pointer">
                        <PlusCircle size={14} />
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-[22vh] overflow-y-auto pr-1">
                      {planningCards.filter(c => c.column === 'ato2').map(card => (
                        <div 
                          key={card.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id)}
                          className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg text-sm relative group space-y-1 cursor-grab active:cursor-grabbing select-none hover:border-neutral-700 transition-all"
                        >
                          <div className="font-serif font-semibold text-white pr-4">{card.title}</div>
                          <p className="text-neutral-400 text-xs leading-normal font-sans">{card.content}</p>
                          <div className="flex justify-between items-center pt-1 border-t border-neutral-850/50 mt-1.5">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Trama'}</span>
                            <button onClick={() => deletePlanningCard(card.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-auto transition-opacity cursor-pointer">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {planningCards.filter(c => c.column === 'ato2').length === 0 && (
                        <div className="text-center py-4 text-neutral-500 text-xs font-sans italic">Arrastar cards aqui</div>
                      )}
                    </div>
                  </div>

                  {/* Ato 3 */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'ato3')}
                    className="bg-neutral-900/40 p-3 border border-neutral-850 rounded-2xl space-y-2 min-h-[120px] transition-all"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-1">
                      <span className="text-sm font-bold text-white uppercase font-serif">Ato III: Resolução</span>
                      <button onClick={() => addPlanningCard('ato3')} className="text-indigo-400 hover:text-white cursor-pointer">
                        <PlusCircle size={14} />
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-[22vh] overflow-y-auto pr-1">
                      {planningCards.filter(c => c.column === 'ato3').map(card => (
                        <div 
                          key={card.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id)}
                          className="bg-neutral-950 border border-neutral-800 p-2.5 rounded-lg text-sm relative group space-y-1 cursor-grab active:cursor-grabbing select-none hover:border-neutral-700 transition-all"
                        >
                          <div className="font-serif font-semibold text-white pr-4">{card.title}</div>
                          <p className="text-neutral-400 text-xs leading-normal font-sans">{card.content}</p>
                          <div className="flex justify-between items-center pt-1 border-t border-neutral-850/50 mt-1.5">
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Clímax'}</span>
                            <button onClick={() => deletePlanningCard(card.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 ml-auto transition-opacity cursor-pointer">
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {planningCards.filter(c => c.column === 'ato3').length === 0 && (
                        <div className="text-center py-4 text-neutral-500 text-xs font-sans italic">Arrastar cards aqui</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Render left Tab: Characters */}
            {leftTab === 'characters' && (
              <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5 font-sans">
                    <User size={14} /> Personagens
                  </span>
                  <button 
                    onClick={() => {
                      setEditingCard(null);
                      setCardFormTitle('');
                      setCardFormType('character');
                      setCardFormContent('');
                      setCardFormEmoji('👤');
                      setIsNewCard(true);
                      setShowCardModal(true);
                    }} 
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={12} /> Personagem
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {planningBlocks.filter(b => b.type === 'character').map(block => (
                    <div 
                      key={block.id}
                      className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer group relative flex flex-col justify-between space-y-2"
                      onClick={() => handleOpenEditCard(block)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{block.emoji || '👤'}</span>
                          <div className="text-left">
                            <h4 className="font-serif font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{block.title}</h4>
                            <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">{block.content || 'Sem descrição'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Excluir esta ficha?')) {
                              setPlanningBlocks(prev => prev.filter(b => b.id !== block.id));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all p-1 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {planningBlocks.filter(b => b.type === 'character').length === 0 && (
                    <div className="text-center py-8 text-neutral-500 font-sans text-xs">
                      Nenhum personagem criado. Clique em "+ Personagem" para começar.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Render left Tab: Locations */}
            {leftTab === 'locations' && (
              <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5 font-sans">
                    <MapPin size={14} /> Locais
                  </span>
                  <button 
                    onClick={() => {
                      setEditingCard(null);
                      setCardFormTitle('');
                      setCardFormType('location');
                      setCardFormContent('');
                      setCardFormEmoji('📍');
                      setIsNewCard(true);
                      setShowCardModal(true);
                    }} 
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={12} /> Local
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {planningBlocks.filter(b => b.type === 'location').map(block => (
                    <div 
                      key={block.id}
                      className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer group relative flex flex-col justify-between space-y-2"
                      onClick={() => handleOpenEditCard(block)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{block.emoji || '📍'}</span>
                          <div className="text-left">
                            <h4 className="font-serif font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{block.title}</h4>
                            <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">{block.content || 'Sem descrição'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Excluir esta ficha?')) {
                              setPlanningBlocks(prev => prev.filter(b => b.id !== block.id));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all p-1 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {planningBlocks.filter(b => b.type === 'location').length === 0 && (
                    <div className="text-center py-8 text-neutral-500 font-sans text-xs">
                      Nenhum local criado. Clique em "+ Local" para começar.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Render left Tab: Events */}
            {leftTab === 'events' && (
              <div className="p-4 flex-1 flex flex-col overflow-y-auto space-y-4">
                <div className="flex justify-between items-center select-none">
                  <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-1.5 font-sans">
                    <Calendar size={14} /> Eventos
                  </span>
                  <button 
                    onClick={() => {
                      setEditingCard(null);
                      setCardFormTitle('');
                      setCardFormType('event');
                      setCardFormContent('');
                      setCardFormEmoji('📅');
                      setIsNewCard(true);
                      setShowCardModal(true);
                    }} 
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={12} /> Evento
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {planningBlocks.filter(b => b.type === 'event').map(block => (
                    <div 
                      key={block.id}
                      className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer group relative flex flex-col justify-between space-y-2"
                      onClick={() => handleOpenEditCard(block)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{block.emoji || '📅'}</span>
                          <div className="text-left">
                            <h4 className="font-serif font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{block.title}</h4>
                            <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">{block.content || 'Sem descrição'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Excluir esta ficha?')) {
                              setPlanningBlocks(prev => prev.filter(b => b.id !== block.id));
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-all p-1 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {planningBlocks.filter(b => b.type === 'event').length === 0 && (
                    <div className="text-center py-8 text-neutral-500 font-sans text-xs">
                      Nenhum evento criado. Clique em "+ Evento" para começar.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Render left Tab: Statistics */}
            {leftTab === 'statistics' && (
              <div className="p-5 flex-1 flex flex-col overflow-y-auto justify-between select-none">
                <div className="space-y-6">
                  <span className="text-sm font-bold tracking-widest text-indigo-400 uppercase flex items-center gap-2">
                    <BarChart2 size={14} /> Estatísticas do Livro
                  </span>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-2xl">
                      <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Capítulo</div>
                      <div className="text-xl font-bold font-serif text-white mt-1">{activeWords} pal.</div>
                    </div>
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-2xl">
                      <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Livro</div>
                      <div className="text-xl font-bold font-serif text-white mt-1">{totalWords} pal.</div>
                    </div>
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-2xl">
                      <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Caracteres</div>
                      <div className="text-xl font-bold font-serif text-white mt-1">{totalChars}</div>
                    </div>
                    <div className="bg-neutral-900/60 border border-neutral-850 p-3 rounded-2xl">
                      <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Estrutura</div>
                      <div className="text-xl font-bold font-serif text-white mt-1">{chapters.length} Caps</div>
                    </div>
                  </div>

                  {/* Typography Panel */}
                  <div className="space-y-3 border-t border-neutral-900 pt-4">
                    <div className="text-[11px] text-neutral-500 uppercase tracking-wider font-mono">Configuração de Texto</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-neutral-500">Fonte</span>
                        <select
                          value={settings.preferredFont}
                          onChange={(e) => setSettings(prev => ({ ...prev, preferredFont: e.target.value as WritingSettings['preferredFont'] }))}
                          className="text-xs border border-neutral-850 bg-neutral-900 text-neutral-300 p-2.5 rounded-xl focus:outline-none w-full"
                        >
                          <option value="serif">Garamond</option>
                          <option value="sans">Inter (Sans)</option>
                          <option value="mono">JetBrains</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-neutral-500">Tamanho</span>
                        <select
                          value={settings.fontSize}
                          onChange={(e) => setSettings(prev => ({ ...prev, fontSize: e.target.value as WritingSettings['fontSize'] }))}
                          className="text-xs border border-neutral-850 bg-neutral-900 text-neutral-300 p-2.5 rounded-xl focus:outline-none w-full"
                        >
                          <option value="sm">Pequeno</option>
                          <option value="md">Médio</option>
                          <option value="lg">Grande</option>
                          <option value="xl">Extra G.</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Daily Target Widget */}
                  <div className="bg-[#0f0f12] border border-neutral-850 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-neutral-400 flex items-center gap-1.5">
                        <Clock size={13} className="text-indigo-400" /> Meta do Capítulo
                      </span>
                      <span className="font-mono text-indigo-400 font-bold">{dailyProgress}%</span>
                    </div>
                    
                    <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-900">
                      <div 
                        className="bg-indigo-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                        style={{ width: `${dailyProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">{activeWords} / {settings.dailyGoal} pal.</span>
                      <button
                        onClick={() => {
                          const goal = window.prompt('Ajustar meta diária de palavras do capítulo:', settings.dailyGoal.toString());
                          if (goal) {
                            const num = parseInt(goal, 10);
                            if (!isNaN(num) && num > 0) {
                              setSettings(prev => ({ ...prev, dailyGoal: num }));
                            }
                          }
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-bold"
                      >
                        Ajustar Meta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* CENTER WRITING AREA & CANVAS */}
      <section className="flex-1 flex flex-col bg-[#09090b] relative overflow-hidden">
        
        {leftTab === 'planning' ? (
          activePlanningCardId ? (
            /* PLANNING CARD DETAILS EDITOR SCREEN (from 4th image) */
            (() => {
              const card = planningCards.find(c => c.id === activePlanningCardId);
              if (!card) {
                setTimeout(() => setActivePlanningCardId(null), 0);
                return null;
              }
              const colLabel = card.column === 'planning' ? 'Planning' : card.column === 'ato1' ? 'Act I' : card.column === 'ato2' ? 'Act II' : 'Act III';
              return (
                <div className="flex-1 overflow-y-auto p-8 bg-white text-neutral-800 space-y-6 select-none font-sans">
                  {/* Top breadcrumbs and actions bar */}
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium select-none">
                      <span className="cursor-pointer hover:text-indigo-600 flex items-center gap-1" onClick={() => setActivePlanningCardId(null)}>
                        📋 Planning
                      </span>
                      <span>&gt;</span>
                      <span className="flex items-center gap-1 font-semibold text-neutral-600">
                        📁 {colLabel}
                      </span>
                      <span>&gt;</span>
                      <span className="text-neutral-800 font-bold">{card.title}</span>
                    </div>

                    <div className="flex items-center gap-2 select-none">
                      <button 
                        onClick={() => {
                          const clone = { ...card, id: `pc-${Date.now()}`, title: `${card.title} (Cópia)` };
                          setPlanningCards(prev => [...prev, clone]);
                          alert('Card duplicado!');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer font-semibold"
                      >
                        <Copy size={12} /> Duplicate
                      </button>
                      <button 
                        onClick={() => {
                          const nextCol = card.column === 'planning' ? 'ato1' : card.column === 'ato1' ? 'ato2' : card.column === 'ato2' ? 'ato3' : 'planning';
                          setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, column: nextCol } : c));
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer font-semibold"
                      >
                        <Move size={12} /> Move
                      </button>
                      <button 
                        onClick={() => {
                          const newTag = window.prompt("Escolha uma tag ('Estrutura', 'Personagem', 'Trama', 'Cenário', 'Geral'):", card.tag || 'Geral');
                          if (newTag) {
                            setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, tag: newTag as any } : c));
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer font-semibold"
                      >
                        <Pin size={12} /> Pin note
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Excluir este card permanentemente?')) {
                            setPlanningCards(prev => prev.filter(c => c.id !== card.id));
                            setActivePlanningCardId(null);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer font-semibold"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Main Grid Layout */}
                  <div className="grid grid-cols-3 gap-8 items-start">
                    {/* Left & Middle Column */}
                    <div className="col-span-2 space-y-6">
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={card.title} 
                          onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))}
                          className="w-full text-3xl font-bold font-sans text-neutral-900 focus:outline-none border-none p-0 bg-transparent placeholder:text-neutral-300"
                          placeholder="Untitled Card"
                        />
                        <textarea 
                          value={card.content} 
                          onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, content: e.target.value } : c))}
                          className="w-full text-base text-neutral-600 focus:outline-none border-none p-0 resize-none bg-transparent placeholder:text-neutral-300 h-16 font-sans leading-relaxed"
                          placeholder="Add a brief description..."
                        />
                      </div>

                      {/* Attributes table */}
                      <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-neutral-50/50">
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-2 py-1 text-xs text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200">
                            <span>Atributo</span>
                            <span className="col-span-2">Valor</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 items-center text-sm py-1.5 border-b border-neutral-100">
                            <span className="font-semibold text-neutral-500">Tipo</span>
                            <span className="col-span-2 text-neutral-800 font-mono bg-neutral-200/50 px-2 py-0.5 rounded w-fit text-xs font-bold uppercase">{card.tag || 'Geral'}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 items-center text-sm py-1.5 border-b border-neutral-100">
                            <span className="font-semibold text-neutral-500">Seção</span>
                            <span className="col-span-2 text-neutral-700">{colLabel}</span>
                          </div>
                        </div>

                        {/* Interactive actions */}
                        <div className="bg-neutral-100/80 px-4 py-2 flex gap-2 border-t border-neutral-200 select-none">
                          <button 
                            onClick={() => {
                              const label = window.prompt("Nome do novo atributo:");
                              if (label) alert(`Atributo "${label}" adicionado ao card!`);
                            }}
                            className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            + Add attribute
                          </button>
                          <button onClick={() => alert('Grupo adicionado!')} className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer">+ Add group</button>
                          <button onClick={() => alert('Perguntas e Respostas adicionadas!')} className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer">+ Add Q&A</button>
                          <button onClick={() => setShowTemplatesModal(true)} className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-650 text-[10px] font-bold px-2.5 py-1 rounded-lg cursor-pointer ml-auto">+ Add template</button>
                        </div>
                      </div>

                      {/* Extended Notes area */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-sans">Notas de Trama e Insights</label>
                        <textarea
                          placeholder="Esta cena é sobre tirar o protagonist da zona de conforto. Eles são confrontados com um problema ou desafio. Escreva aqui detalhes profundos da cena..."
                          className="w-full min-h-[180px] bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-neutral-300 bg-neutral-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:bg-neutral-100 hover:border-neutral-400 transition-all aspect-video">
                        <Camera className="text-neutral-400" size={24} />
                        <span className="text-xs text-neutral-500 font-bold">Add image</span>
                        <span className="text-[10px] text-neutral-400 font-sans">Arraste uma ilustração aqui</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            /* FULL PAGE KANBAN PLANNING BOARD */
            <div className="flex-1 overflow-y-auto p-8 bg-[#f5f5f7] dark:bg-[#09090b] text-neutral-800 dark:text-neutral-200 space-y-10 select-none">
              {/* Planning Header */}
              <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-900 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📋</span>
                  <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white tracking-wide">Planning</h2>
                </div>
                
                <button 
                  onClick={addPlanningSection}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  Nova Seção <Plus size={14} />
                </button>
              </div>

              {/* Stacked Rows Layout */}
              <div className="space-y-8 text-left">
                {planningSections.map(section => (
                  <div 
                    key={section.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, section.id)}
                    className="space-y-4"
                  >
                    {/* Lane Header */}
                    <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-850 pb-2">
                      <div className="flex items-center gap-2 select-none">
                        <span 
                          onClick={() => renamePlanningSection(section.id, section.name)}
                          className="text-lg font-bold text-neutral-800 dark:text-neutral-200 font-serif cursor-pointer hover:text-indigo-600"
                        >
                          {section.name}
                        </span>
                        {planningSections.length > 1 && (
                          <button 
                            onClick={() => deletePlanningSection(section.id)} 
                            className="text-xs text-red-500 hover:text-red-700 cursor-pointer ml-2"
                            title="Excluir Seção"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addPlanningCard(section.id)}
                        className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-850 text-indigo-600 dark:text-indigo-400 border border-neutral-200 dark:border-neutral-800 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        Add <Plus size={12} />
                      </button>
                    </div>

                    {/* Cards horizontal shelf */}
                    <div className="flex flex-wrap gap-4">
                      {planningCards.filter(c => c.column === section.id).map(card => {
                        const isPinned = pinnedCardsList && pinnedCardsList.includes(card.id);
                        return (
                          <div 
                            key={card.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, card.id)}
                            onClick={() => setActivePlanningCardId(card.id)}
                            className="w-[245px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-4 rounded-xl text-sm relative group space-y-2 cursor-grab active:cursor-grabbing hover:border-neutral-300 dark:hover:border-neutral-750 transition-all shadow-sm text-left flex flex-col justify-between min-h-[135px]"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-serif font-bold text-neutral-850 dark:text-white line-clamp-1">{card.title}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      togglePinCard(card.id); 
                                    }} 
                                    className="text-neutral-400 hover:text-indigo-500 cursor-pointer transition-colors"
                                    title={isPinned ? "Desafixar" : "Fixar nas notas"}
                                  >
                                    <Pin size={11} className={isPinned ? "fill-indigo-500 text-indigo-500" : ""} />
                                  </button>
                                  <span className="text-neutral-350 dark:text-neutral-700 cursor-grab">⋮⋮</span>
                                </div>
                              </div>
                              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed font-sans mt-1.5 line-clamp-3">{card.content}</p>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-900 mt-2">
                              <span className="text-[9px] bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Geral'}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deletePlanningCard(card.id); }} 
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity cursor-pointer"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {planningCards.filter(c => c.column === section.id).length === 0 && (
                        <div className="text-neutral-400 dark:text-neutral-600 text-xs italic font-sans py-2 select-none">Sem cards nesta seção. Clique em "Add +" para criar.</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          /* The Text Editor Canvas Sheet */
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-20 flex justify-center bg-[#09090b]">
            <div className="w-full max-w-3xl flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-8 md:p-14 relative min-h-[70vh] editor-paper">
              
              {/* Chapter Header */}
              <div className="mb-6 border-b border-neutral-800/80 pb-4">
                <input
                  type="text"
                  value={activeChapter ? activeChapter.title : ''}
                  onChange={handleTitleChange}
                  placeholder="Título do Capítulo..."
                  className="w-full font-serif text-2xl md:text-3xl text-white border-none bg-transparent focus:outline-none placeholder:text-neutral-700 font-medium"
                />
                <span className="text-[9px] font-mono text-neutral-500 mt-1 block uppercase tracking-wider">
                  Última edição realizada hoje, às {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Writing Area */}
              <textarea
                ref={textareaRef}
                value={activeChapter ? activeChapter.content : ''}
                onChange={handleContentChange}
                placeholder="Sua inspiração começa a fluir... Escreva, edite e acompanhe os seus insights nas barras laterais."
                className={`flex-1 w-full border-none resize-none bg-transparent focus:outline-none focus:ring-0 placeholder:text-neutral-700 ${getFontClass()} ${getFontSizeClass()} text-neutral-200`}
                style={{ minHeight: '380px' }}
              />

              {/* Distraction free overlay indicators */}
              {isDistractionFree && (
                <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center border-t border-neutral-850/50 pt-4 text-[10px] font-mono text-neutral-500 select-none">
                  <span>{activeChapter ? activeChapter.title : ''}</span>
                  <span>{activeWords} palavras</span>
                  <button 
                    onClick={() => setIsDistractionFree(false)}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    Sair do Modo Foco
                  </button>
                </div>
              )}
            </div>
          </div>
        )}


      </section>

      {/* RIGHT SLIDE-OUT INTERACTIVE TOOLS SIDEBAR */}
      {!isDistractionFree && (
        <div className="flex shrink-0 select-none">
          {/* Collapse drawer content panel */}
          {activeRightTool && (
            <aside className="w-80 border-l border-neutral-200 dark:border-neutral-900 bg-[#f5f3ef] dark:bg-[#0c0c0e] flex flex-col justify-between overflow-hidden animate-fade-in">
              <div className="p-5 space-y-6 h-full flex flex-col justify-start">
                
                {/* Tool title header */}
                <div className="flex justify-between items-center border-b border-neutral-850 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-mono flex items-center gap-2">
                    {activeRightTool === 'stats' && <><AlignLeft size={13} /> Metas & Insights</>}
                    {activeRightTool === 'challenges' && <><Trophy size={13} /> Desafios Literários</>}
                    {activeRightTool === 'notes' && <><Pin size={13} /> Notas Fixadas</>}
                    {activeRightTool === 'track' && <><MessageSquare size={13} /> Sugestões & Revisões</>}
                    {activeRightTool === 'history' && <><History size={13} /> Snapshots de Versão</>}
                    {activeRightTool === 'search' && <><Search size={13} /> Buscar & Substituir</>}
                    {activeRightTool === 'spell' && <><Type size={13} /> Corretor Ortográfico</>}
                    {activeRightTool === 'trash' && <><Trash2 size={13} /> Lixeira do Livro</>}
                  </h3>
                  <button 
                    onClick={() => setActiveRightTool(null)} 
                    className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded"
                  >
                    <X size={13} />
                  </button>
                </div>

                {/* TAB CONTENT: Stats & Insights */}
                {activeRightTool === 'stats' && (
                  <div className="space-y-6 flex-1 overflow-y-auto text-neutral-300">
                    {/* Smiley mood check-in */}
                    <div className="space-y-2 bg-neutral-900/60 p-3.5 border border-neutral-850 rounded-2xl text-center">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Como foi o trabalho hoje?</div>
                      <div className="flex justify-center gap-4 py-1.5">
                        <button 
                          onClick={() => setSessionMood('happy')}
                          className={`p-1.5 rounded-full transition-colors ${sessionMood === 'happy' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-neutral-400'}`}
                          title="Excelente ritmo!"
                        >
                          <Smile size={18} />
                        </button>
                        <button 
                          onClick={() => setSessionMood('neutral')}
                          className={`p-1.5 rounded-full transition-colors ${sessionMood === 'neutral' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-neutral-400'}`}
                          title="Foco mediano"
                        >
                          <Meh size={18} />
                        </button>
                        <button 
                          onClick={() => setSessionMood('sad')}
                          className={`p-1.5 rounded-full transition-colors ${sessionMood === 'sad' ? 'bg-indigo-600 text-white' : 'hover:bg-neutral-800 text-neutral-400'}`}
                          title="Bloqueio criativo"
                        >
                          <Frown size={18} />
                        </button>
                      </div>
                      <span className="text-[9px] text-neutral-500 block">Identificar seu ânimo melhora as estatísticas de escrita a longo prazo.</span>
                    </div>

                    {/* Stats table */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Dados do Capítulo</div>
                      <div className="space-y-1.5 text-xs font-sans">
                        <div className="flex justify-between py-1 border-b border-neutral-900 text-neutral-400">
                          <span>Tempo de Leitura</span>
                          <span className="font-mono text-white font-medium">{readingTime()} min</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-900 text-neutral-400">
                          <span>Contagem de Palavras</span>
                          <span className="font-mono text-white font-medium">{activeWords}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-900 text-neutral-400">
                          <span>Caracteres Totais</span>
                          <span className="font-mono text-white font-medium">{activeChapter?.content.length || 0}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-neutral-900 text-neutral-400">
                          <span>Parágrafos</span>
                          <span className="font-mono text-white font-medium">
                            {activeChapter?.content.split('\n\n').filter(p => p.trim()).length || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Word frequency analysis */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Palavras Mais Frequentes</div>
                      {wordFrequency().length > 0 ? (
                        <div className="space-y-2">
                          {wordFrequency().map(([word, freq]) => (
                            <div key={word} className="flex justify-between items-center bg-neutral-950 p-2 border border-neutral-850 rounded-xl text-xs">
                              <span className="font-serif text-white italic">"{word}"</span>
                              <span className="font-mono text-indigo-400 text-[10px] bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">{freq} ocorrências</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-neutral-500 italic">Escreva mais texto para visualizar as repetições de palavras.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Challenges */}
                {activeRightTool === 'challenges' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    <p className="text-xs text-neutral-400 leading-relaxed">Participe de desafios literários para turbinar a sua produtividade.</p>
                    
                    <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-2xl space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-white font-serif">Meia Maratona de Escrita</h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Sua meta mensal de 10k palavras.</p>
                        </div>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">Ativo</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-900">
                        <div className="bg-indigo-500 h-full w-[45%]" />
                      </div>
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                        <span>4.500 palavras</span>
                        <span>10.000 alvo</span>
                      </div>
                    </div>

                    <div className="bg-neutral-900/60 p-4 border border-emerald-500/10 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-neutral-300 font-serif">Arrancada de Fim de Semana</h4>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase font-bold">Concluído</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-tight">Escreva 2.000 palavras entre sábado e domingo para liberar medalhas estelares.</p>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Pinned Notes */}
                {activeRightTool === 'notes' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-700 dark:text-neutral-300 flex flex-col justify-start h-full pr-1">
                    <p className="text-xs text-neutral-400 leading-relaxed text-left">
                      Cards fixados ou criados diretamente aqui. As alterações de texto salvam automaticamente.
                    </p>

                    {/* Create New Card Form */}
                    <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 p-3 rounded-2xl space-y-2 text-left">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Criar Nota Fixada</div>
                      <input 
                        type="text"
                        id="new-note-title"
                        placeholder="Título da nota..."
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl p-2 text-xs text-neutral-800 dark:text-white focus:outline-none"
                      />
                      <textarea
                        id="new-note-content"
                        placeholder="Descrição da nota..."
                        rows={3}
                        className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl p-2 text-xs text-neutral-800 dark:text-white focus:outline-none resize-none"
                      />
                      <button
                        onClick={() => {
                          const titleEl = document.getElementById('new-note-title') as HTMLInputElement;
                          const contentEl = document.getElementById('new-note-content') as HTMLTextAreaElement;
                          if (titleEl && titleEl.value.trim()) {
                            const newId = `pc-${Date.now()}`;
                            const newCard = {
                              id: newId,
                              column: planningSections[0]?.id || 'planning',
                              title: titleEl.value.trim(),
                              content: contentEl.value.trim() || 'Sem descrição.',
                              tag: 'Geral' as const
                            };
                            setPlanningCards(prev => [...prev, newCard]);
                            setPinnedCardsList(prev => [...prev, newId]);
                            titleEl.value = '';
                            contentEl.value = '';
                          }
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Adicionar Nota
                      </button>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3 mt-2 text-left">
                      {planningCards.filter(c => pinnedCardsList.includes(c.id)).map(card => (
                        <div key={card.id} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-3 rounded-2xl space-y-2 relative group shadow-sm">
                          <div className="font-serif font-bold text-neutral-900 dark:text-white flex justify-between items-center">
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))}
                              className="bg-transparent border-none p-0 font-bold text-neutral-900 dark:text-white focus:outline-none w-full mr-2"
                            />
                            <button 
                              onClick={() => togglePinCard(card.id)}
                              className="text-indigo-500 hover:text-neutral-500"
                              title="Desafixar"
                            >
                              <Pin size={12} className="fill-indigo-500 rotate-45" />
                            </button>
                          </div>
                          <textarea
                            value={card.content}
                            rows={3}
                            onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, content: e.target.value } : c))}
                            className="w-full bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-850 rounded-xl p-2 text-[11px] text-neutral-600 dark:text-neutral-300 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                      ))}
                      {planningCards.filter(c => pinnedCardsList.includes(c.id)).length === 0 && (
                        <div className="text-center py-8 text-neutral-600 dark:text-neutral-600 text-xs italic font-sans">Nenhum card fixado.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Track changes & revisions suggestions */}
                {activeRightTool === 'track' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    {/* Toggle */}
                    <div className="flex items-center justify-between bg-neutral-900/60 p-3.5 border border-neutral-850 rounded-2xl text-xs">
                      <div>
                        <span className="font-bold text-white block">Rastrear Alterações</span>
                        <span className="text-[9px] text-neutral-500">Registrar histórico de modificações</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={trackChanges}
                        onChange={(e) => setTrackChanges(e.target.checked)}
                        className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Sugestões de Estilo</div>
                      {suggestions.map(s => (
                        <div key={s.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-2.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-amber-400 uppercase font-mono font-bold">{s.type === 'cliche' ? 'Clichê Detectado' : 'Repetição'}</span>
                            <button 
                              onClick={() => setSuggestions(suggestions.filter(x => x.id !== s.id))}
                              className="text-neutral-500 hover:text-white"
                            >
                              Dispensar
                            </button>
                          </div>
                          <p className="text-xs font-serif leading-relaxed text-neutral-300">
                            {s.comment}
                          </p>
                          <div className="flex justify-between items-center text-[10px] bg-neutral-900 p-2 rounded-lg border border-neutral-850">
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
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    <button
                      onClick={createSnapshot}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={13} /> Criar Novo Snapshot
                    </button>

                    <div className="space-y-2.5">
                      {snapshots.map(snap => (
                        <div key={snap.id} className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl flex justify-between items-center">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-serif font-semibold text-white">{snap.title}</h4>
                            <p className="text-[9px] text-neutral-500 font-mono">{snap.timestamp}</p>
                          </div>
                          <span className="text-[9px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">{snap.charCount} caracteres</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Find & Replace */}
                {activeRightTool === 'search' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block">Localizar</label>
                      <input
                        type="text"
                        value={findText}
                        onChange={(e) => setFindText(e.target.value)}
                        placeholder="Palavra ou termo..."
                        className="w-full text-xs border border-neutral-850 bg-neutral-950 text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block">Substituir por</label>
                      <input
                        type="text"
                        value={replaceText}
                        onChange={(e) => setReplaceText(e.target.value)}
                        placeholder="Nova palavra ou frase..."
                        className="w-full text-xs border border-neutral-850 bg-neutral-950 text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2 pt-2 text-[11px] font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Diferenciar maiúsculas/minúsculas</span>
                        <input
                          type="checkbox"
                          checked={matchCase}
                          onChange={(e) => setMatchCase(e.target.checked)}
                          className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 w-3.5 h-3.5"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Apenas neste capítulo</span>
                        <input
                          type="checkbox"
                          checked={searchOnlyThisChapter}
                          onChange={(e) => setSearchOnlyThisChapter(e.target.checked)}
                          className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 w-3.5 h-3.5"
                        />
                      </div>
                    </div>

                    <button
                      onClick={executeFindAndReplace}
                      disabled={!findText}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-xl transition-all mt-4 cursor-pointer"
                    >
                      Substituir Ocorrências
                    </button>
                  </div>
                )}

                {/* TAB CONTENT: Spellcheck */}
                {activeRightTool === 'spell' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    <div className="flex items-center justify-between bg-neutral-900/60 p-3.5 border border-neutral-850 rounded-2xl text-xs">
                      <div>
                        <span className="font-bold text-white block">Ativar Corretor</span>
                        <span className="text-[9px] text-neutral-500">Exibir sublinhados ortográficos</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={spellingActive}
                        onChange={(e) => setSpellingActive(e.target.checked)}
                        className="rounded border-neutral-800 text-indigo-500 bg-neutral-950 w-4 h-4"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase">Inconsistências Encontradas</div>
                      {spellingActive ? (
                        <div className="space-y-2.5">
                          <div className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl text-xs space-y-1.5">
                            <div className="text-[9px] text-red-400 font-mono uppercase font-bold">Erro de Concordância</div>
                            <p className="font-serif italic">"...setecentas palavras haviam sido confiadas..."</p>
                            <span className="text-[10px] text-neutral-400 block mt-1">Concordância passiva correta. Nenhuma alteração solicitada.</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 text-center py-4">Tudo limpo por aqui! Seu manuscrito não possui falhas crassas.</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-neutral-500 italic text-center">Ative o corretor ortográfico para realizar a varredura do texto.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: Chapter Wastebin / Trash */}
                {activeRightTool === 'trash' && (
                  <div className="space-y-4 flex-1 overflow-y-auto text-neutral-300">
                    <p className="text-xs text-neutral-400 leading-relaxed">Recupere capítulos excluídos acidentalmente neste manuscrito.</p>
                    
                    {deletedChapters.length > 0 ? (
                      <div className="space-y-2">
                        {deletedChapters.map(ch => (
                          <div key={ch.id} className="bg-neutral-950 border border-neutral-850 p-3 rounded-xl flex justify-between items-center text-xs">
                            <div className="overflow-hidden mr-2">
                              <h4 className="font-serif font-bold text-white truncate">{ch.title}</h4>
                              <p className="text-[9px] text-neutral-500 font-mono">Ordem: {ch.order}</p>
                            </div>
                            <button
                              onClick={() => restoreChapter(ch)}
                              className="text-indigo-400 hover:text-white shrink-0 font-bold font-sans text-[10px] uppercase bg-indigo-500/10 px-2 py-1 rounded"
                            >
                              Restaurar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 border border-dashed border-neutral-800 text-neutral-500 text-xs rounded-xl">
                        Nenhum capítulo na lixeira.
                      </div>
                    )}
                  </div>
                )}

              </div>
            </aside>
          )}

          {/* Collapsible right sidebar icon strip */}
          <aside className="w-16 border-l border-neutral-900 bg-[#09090b] flex flex-col justify-between items-center py-4 shrink-0 select-none">
            {/* Top stack icons */}
            <div className="space-y-3.5 flex flex-col items-center">
              <button
                onClick={() => setActiveRightTool(activeRightTool === 'stats' ? null : 'stats')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'stats'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Metas & Insights"
              >
                <AlignLeft size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'challenges' ? null : 'challenges')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'challenges'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Desafios Literários"
              >
                <Trophy size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'notes' ? null : 'notes')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'notes'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Notas Fixadas"
              >
                <Pin size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'track' ? null : 'track')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'track'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Controle de Alterações & Sugestões"
              >
                <MessageSquare size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'history' ? null : 'history')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'history'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Snapshots de Versão"
              >
                <History size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'search' ? null : 'search')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'search'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Buscar & Substituir"
              >
                <Search size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'spell' ? null : 'spell')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'spell'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Corretor Ortográfico"
              >
                <Type size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'trash' ? null : 'trash')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'trash'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-neutral-500 hover:text-white hover:bg-neutral-900'
                }`}
                title="Lixeira de Capítulos"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Bottom stack settings icons (Export/Download, Perfil/User) */}
            <div className="space-y-3.5 flex flex-col items-center">
              {/* Diagramador e exportador */}
              <button
                onClick={() => setShowExporterModal(true)}
                className="p-2 rounded-xl text-indigo-400 hover:text-white hover:bg-neutral-900 border border-transparent transition-all cursor-pointer"
                title="Diagramação & Exportação (Configurações do Editor)"
              >
                <Download size={18} />
              </button>

              {/* Perfil */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-2 rounded-xl text-indigo-400 hover:text-white hover:bg-neutral-900 border border-transparent transition-all cursor-pointer"
                title="Configurações de Perfil de Autor"
              >
                <User size={18} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MODAL 1: EXPORTER / DIAGRAMADOR MODAL */}
      {showExporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-900 flex justify-between items-center bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <BookMarked size={18} className="text-indigo-400" />
                <span className="font-serif font-bold text-lg text-white">Configurações do Editor: Diagramador & Exportador</span>
              </div>
              <button 
                onClick={() => setShowExporterModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <Exporter 
                chapters={chapters}
                settings={settings}
                setSettings={setSettings}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AUTHOR PROFILE BUILDER MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-900 flex justify-between items-center bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                <span className="font-serif font-bold text-lg text-white">Configurações do Perfil de Autor</span>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AuthorProfileBuilder 
                profile={profile}
                setProfile={setProfile}
                books={books}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW BOARD MODAL */}
      {showNewBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowNewBoardModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white">Criar Nova Pasta de Fichas</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-16 space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Ícone</label>
                  <input 
                    type="text" 
                    value={newBoardEmoji} 
                    onChange={(e) => setNewBoardEmoji(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-center text-lg"
                    placeholder="📂"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Nome da Pasta</label>
                  <input 
                    type="text" 
                    value={newBoardName} 
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-xs text-white"
                    placeholder="Ex: Personagens Principais"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Descrição</label>
                <textarea 
                  value={newBoardDesc} 
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-xs text-white h-20 resize-none font-sans"
                  placeholder="Descreva brevemente o propósito desta pasta..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowNewBoardModal(false)}
                className="outline-btn text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddBoard}
                className="emerald-btn text-xs font-bold px-4 py-2 rounded-lg text-white cursor-pointer"
              >
                Criar Pasta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE / EDIT PLANNING BLOCK MODAL */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => {
                setShowCardModal(false);
                setEditingCard(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white font-serif">
              {isNewCard ? 'Criar Ficha/Bloco' : 'Editar Ficha/Bloco'}
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-16 space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase">Ícone</label>
                  <input 
                    type="text" 
                    value={cardFormEmoji} 
                    onChange={(e) => setCardFormEmoji(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-center text-lg"
                    placeholder="📝"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Título do Bloco</label>
                  <input 
                    type="text" 
                    value={cardFormTitle} 
                    onChange={(e) => setCardFormTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-xs text-white"
                    placeholder="Ex: Protagonista - Ficha"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Tipo de Elemento</label>
                <select 
                  value={cardFormType} 
                  onChange={(e) => setCardFormType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-xs text-white"
                >
                  <option value="character">Personagem</option>
                  <option value="location">Local</option>
                  <option value="event">Evento</option>
                  <option value="note">Nota</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase font-sans">Conteúdo da Ficha</label>
                <textarea 
                  value={cardFormContent} 
                  onChange={(e) => setCardFormContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2 text-xs text-white h-40 resize-none font-sans"
                  placeholder="Escreva livremente sobre este personagem, local, cronologia ou observação geral..."
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {!isNewCard && (
                <button 
                  onClick={() => {
                    if (editingCard) {
                      handleDeleteCard(editingCard.id);
                      setShowCardModal(false);
                      setEditingCard(null);
                    }
                  }}
                  className="text-xs text-red-450 hover:text-red-400 font-bold transition-colors cursor-pointer"
                >
                  Excluir Bloco
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button 
                  onClick={() => {
                    setShowCardModal(false);
                    setEditingCard(null);
                  }}
                  className="outline-btn text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveCard}
                  className="emerald-btn text-xs font-bold px-4 py-2 rounded-lg text-white cursor-pointer"
                >
                  {isNewCard ? 'Criar Bloco' : 'Salvar Bloco'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD PAGE WIZARD MODAL */}
      {showAddPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowAddPageModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white">Adicionar Nova Página ao Manuscrito</h3>

            <div className="space-y-4">
              {/* 1. Choose Section */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">1. Seção do Livro</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'front', label: 'Pré-textual (Início)' },
                    { key: 'body', label: 'Textual (Corpo)' },
                    { key: 'back', label: 'Pós-textual (Fim)' }
                  ] as const).map(sec => (
                    <button
                      key={sec.key}
                      onClick={() => {
                        setAddPageSection(sec.key);
                        // Reset defaults based on section selection
                        if (sec.key === 'front') setAddPageType('title-page');
                        else if (sec.key === 'body') setAddPageType('chapter');
                        else setAddPageType('author-bio');
                      }}
                      className={`py-2 px-3 text-xs border rounded-xl text-center transition-all cursor-pointer font-sans ${
                        addPageSection === sec.key
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-bold'
                          : 'border-neutral-850 hover:bg-neutral-900 text-neutral-400 font-medium'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Template Type */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">2. Tipo de Página / Modelo</label>
                <select
                  value={addPageType}
                  onChange={(e) => setAddPageType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2.5 text-xs text-white"
                >
                  {addPageSection === 'front' && (
                    <>
                      <option value="title-page">Página de Título</option>
                      <option value="copyright">Página de Copyright (Direitos Autorais)</option>
                      <option value="dedication">Dedicatória</option>
                      <option value="foreword">Prefácio (Introduzido por outro autor)</option>
                      <option value="introduction">Introdução</option>
                      <option value="custom">Página Customizada Inicial</option>
                    </>
                  )}
                  {addPageSection === 'body' && (
                    <>
                      <option value="chapter">Capítulo Padrão</option>
                      <option value="epilogue">Epílogo</option>
                      <option value="custom">Capítulo Customizado</option>
                    </>
                  )}
                  {addPageSection === 'back' && (
                    <>
                      <option value="author-bio">Sobre o Autor (Biografia)</option>
                      <option value="acknowledgments">Agradecimentos</option>
                      <option value="custom">Página Customizada Final</option>
                    </>
                  )}
                </select>
              </div>

              {/* 3. Page Title */}
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">3. Título da Página</label>
                <input
                  type="text"
                  value={addPageTitle}
                  onChange={(e) => setAddPageTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg p-2.5 text-xs text-white"
                  placeholder={PAGE_TEMPLATES[addPageType]?.title || 'Ex: Dedicatória Especial'}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setShowAddPageModal(false)}
                className="outline-btn text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleAddPage(addPageSection, addPageType, addPageTitle)}
                className="emerald-btn text-xs font-bold px-4 py-2 rounded-lg text-white cursor-pointer"
              >
                Adicionar Página
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 6: TEMPLATES SELECTOR MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-[#09090b] border border-neutral-850 rounded-2xl w-full max-w-4xl h-[75vh] flex overflow-hidden shadow-2xl relative animate-fade-in">
            {/* Sidebar filter list */}
            <div className="w-60 border-r border-neutral-900 bg-[#0c0c0e] p-5 flex flex-col gap-4 shrink-0">
              <h3 className="font-sans font-bold text-sm text-neutral-300 uppercase tracking-widest pl-1">Ativos / Assets</h3>
              
              <div className="relative">
                <input 
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
                <Search size={13} className="absolute left-2.5 top-3 text-neutral-500" />
              </div>

              <div className="flex flex-col gap-1 mt-2">
                {[
                  { key: 'all', label: 'All templates', emoji: '✨' },
                  { key: 'Worldbuilding', label: 'Worldbuilding', emoji: '🗺️' },
                  { key: 'Characters', label: 'Characters', emoji: '👤' },
                  { key: 'Settings', label: 'Settings', emoji: '⚙️' },
                  { key: 'Narrative devices', label: 'Narrative devices', emoji: '🖋️' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setTemplateFilter(item.key as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-sans text-left transition-all cursor-pointer ${
                      templateFilter === item.key
                        ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                        : 'border border-transparent text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side templates list */}
            <div className="flex-1 flex flex-col h-full bg-[#09090b]">
              <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-900 select-none">
                <span className="font-serif font-bold text-base text-white">
                  {templateFilter === 'all' ? 'Todos os Templates' : templateFilter}
                </span>
                <button 
                  onClick={() => setShowTemplatesModal(false)}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(() => {
                  const filtered = PLANNING_TEMPLATES.filter(tpl => {
                    const matchesSearch = tpl.title.toLowerCase().includes(templateSearch.toLowerCase()) || 
                                          tpl.description.toLowerCase().includes(templateSearch.toLowerCase());
                    const matchesFilter = templateFilter === 'all' || tpl.category === templateFilter;
                    return matchesSearch && matchesFilter;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-20 text-neutral-600 text-xs italic font-sans">
                        Nenhum template encontrado com os termos de busca.
                      </div>
                    );
                  }

                  return filtered.map(tpl => (
                    <div 
                      key={tpl.title}
                      className="flex items-center justify-between border-b border-neutral-900/80 pb-4 select-none"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {tpl.emoji}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white font-sans">{tpl.title}</h4>
                          <p className="text-neutral-400 text-[11px] leading-relaxed max-w-xl font-sans">{tpl.description}</p>
                          <span className="text-[9px] bg-neutral-950 border border-neutral-850 text-neutral-500 font-semibold px-2 py-0.5 rounded font-mono uppercase tracking-wider block w-fit">
                            {tpl.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <button 
                          onClick={() => {
                            addTemplateCard(tpl);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Add
                        </button>
                        <span className="text-[8px] text-neutral-600 block mt-1 font-mono uppercase">Made by GospelReads</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL 7: LIXEIRA GERAL MODAL */}
      {trashOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-white dark:bg-[#09090b] border border-neutral-200 dark:border-neutral-850 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-900 select-none">
              <span className="font-serif font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <Trash2 size={18} className="text-red-500" /> Lixeira Geral
              </span>
              <button 
                onClick={() => setTrashOpen(false)}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-850 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              {/* Deleted Chapters / Pages */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Capítulos & Páginas Deletados</h3>
                {deletedChapters.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">Nenhum capítulo na lixeira.</p>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    {deletedChapters.map(chap => (
                      <div key={chap.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{chap.title}</span>
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Tipo: Capítulo • Ordem: {chap.order}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setChapters(prev => [...prev, chap].sort((a, b) => a.order - b.order));
                              setDeletedChapters(prev => prev.filter(c => c.id !== chap.id));
                            }}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded"
                          >
                            Restaurar
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Excluir permanentemente?")) {
                                setDeletedChapters(prev => prev.filter(c => c.id !== chap.id));
                              }
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded"
                          >
                            Excluir Definitivo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Deleted Planning Cards */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Cards de Planejamento Deletados</h3>
                {deletedPlanningCards.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">Nenhum card na lixeira.</p>
                ) : (
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                    {deletedPlanningCards.map(card => (
                      <div key={card.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{card.title}</span>
                          <p className="text-[10px] text-neutral-500 truncate max-w-sm">{card.content}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setPlanningCards(prev => [...prev, card]);
                              setDeletedPlanningCards(prev => prev.filter(c => c.id !== card.id));
                            }}
                            className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded"
                          >
                            Restaurar
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Excluir card permanentemente?")) {
                                setDeletedPlanningCards(prev => prev.filter(c => c.id !== card.id));
                              }
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold px-2.5 py-1 rounded"
                          >
                            Excluir Definitivo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
