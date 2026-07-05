/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useEditorStore } from '@/stores/editorStore';

import ExporterModal from './workspace/modals/ExporterModal';
import ProfileModal from './workspace/modals/ProfileModal';
import EditorSettingsModal from './workspace/modals/EditorSettingsModal';
import AddPageWizardModal from './workspace/modals/AddPageWizardModal';
import { MobileNav } from './workspace/sidebar/MobileNav';
import { LeftSidebar } from './workspace/sidebar/LeftSidebar';
import { RightSidebar } from './workspace/sidebar/RightSidebar';
import { RightIconStrip } from './workspace/sidebar/RightIconStrip';
import { EditorCanvas } from './workspace/editor/EditorCanvas';
import { TrashModal } from './workspace/sidebar/TrashModal';
import { GlobalSearchModal } from './workspace/sidebar/GlobalSearchModal';
import { DesktopNav } from './workspace/sidebar/DesktopNav';
import { KanbanBoard } from './workspace/kanban/KanbanBoard';
import { PromptConfirmDialog } from './workspace/modals/PromptConfirmDialog';

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
  Settings,
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
import { Chapter, WritingSettings, AuthorProfile, Book, VersionSnapshot } from './types';
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { SelectionToolbar } from "../editor/SelectionToolbar";
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
  images?: string[];
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


export default function WorkspaceEditor() {
  const {
    books,
    chapters,
    setChapters,
    activeChapterId,
    setActiveChapterId,
    settings,
    setSettings,
    profile,
    setProfile,
    rightTab,
    setRightTab,
    planningSections, setPlanningSections,
    planningCards, setPlanningCards,
    pinnedCardsList, setPinnedCardsList,
    deletedPlanningCards, setDeletedPlanningCards,
    planningBoards, setPlanningBoards,
    planningBlocks, setPlanningBlocks,
    pinnedNotes, setPinnedNotes,
    snapshots, setSnapshots,
    footnotes, setFootnotes,
    deletedChapters, setDeletedChapters
  } = useEditorStore();
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
  const [showEditorSettingsModal, setShowEditorSettingsModal] = useState(false);

  // Dialog elegante personalizado (substitui window.prompt e customConfirm)
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: 'prompt' | 'confirm';
    title: string;
    message: string;
    defaultValue: string;
    placeholder: string;
    onConfirm: (val: string) => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    defaultValue: '',
    placeholder: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const customPrompt = (title: string, message: string, defaultValue: string = '', placeholder: string = ''): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'prompt',
        title,
        message,
        defaultValue,
        placeholder,
        onConfirm: (val) => {
          setDialogState(prev => ({ ...prev, isOpen: false }));
          resolve(val);
        },
        onCancel: () => {
          setDialogState(prev => ({ ...prev, isOpen: false }));
          resolve(null);
        }
      });
    });
  };

  const customConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        type: 'confirm',
        title,
        message,
        defaultValue: '',
        placeholder: '',
        onConfirm: () => {
          setDialogState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setDialogState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  };

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

  // Theme — unified via next-themes
  const [trackChanges, setTrackChanges] = useState(false);
  const [spellingActive, setSpellingActive] = useState(true);
  const [suggestions, setSuggestions] = useState([
    { id: 's-1', type: 'cliche', original: 'beijar o horizonte', replacement: 'tocar a linha do horizonte', comment: 'Considere evitar o clichê "beijar o horizonte".' },
    { id: 's-2', type: 'repetition', original: 'folha', replacement: 'página', comment: 'Repetição da palavra "folha" em parágrafos adjacentes.' }
  ]);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';


  // Trash panel
  const [trashOpen, setTrashOpen] = useState(false);

  // Global search panel (left sidebar)
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Load and persist planning cards
  // Load and persist planning sections (Kanban columns)





















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
    const cleanText = text.replace(/<[^>]*>/g, ' ');
    return cleanText.trim().split(/\s+/).filter(Boolean).length;
  };

  const activeWords = activeChapter ? countWords(activeChapter.content) : 0;
  const totalWords = chapters.reduce((sum, ch) => sum + countWords(ch.content), 0);
  const totalChars = chapters.reduce((sum, ch) => sum + ch.content.length, 0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Sua inspiração começa a fluir... Escreva, edite e acompanhe os seus insights nas barras laterais.",
      }),
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: activeChapter ? activeChapter.content : '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSaveStatus('dirty');
      setChapters((prev: Chapter[]) => prev.map(ch => ch.id === activeChapterId ? { ...ch, content: html } : ch));
      
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('saved');
      }, 1200);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[380px] w-full",
      },
    },
  });

  useEffect(() => {
    if (editor && activeChapter && editor.getHTML() !== activeChapter.content) {
      editor.commands.setContent(activeChapter.content || "");
    }
  }, [activeChapterId, editor]);

  // Daily target updater
  useEffect(() => {
    const percentage = Math.min(Math.round((activeWords / settings.dailyGoal) * 100), 100);
    setDailyProgress(percentage);
  }, [activeWords, settings.dailyGoal]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setChapters((prev: Chapter[]) => prev.map(ch => {
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

  const triggerAddFrontPage = async () => {
    const title = await customPrompt("Nova Página Inicial", "Título da nova Página Inicial:", "", "Ex: Dedicatória, Agradecimentos...");
    if (title) handleAddPage('front', 'custom', title);
  };

  const triggerAddBodyPage = async () => {
    const isPart = await customConfirm("Criar Estrutura", "Deseja criar uma nova Parte ou um Capítulo? (Confirmar para Parte, Cancelar para Capítulo)");
    if (isPart) {
      const title = await customPrompt("Nova Parte", "Título da nova Parte:", "", "Ex: Parte I, Livro Um...");
      if (title) handleAddPage('body', 'part', title);
    } else {
      const title = await customPrompt("Novo Capítulo", "Título do novo Capítulo:", "", "Ex: Capítulo 1, Prólogo...");
      if (title) handleAddPage('body', 'chapter', title);
    }
  };

  const triggerAddChapterToPart = async (partId: string, partTitle: string) => {
    const chTitle = await customPrompt("Novo Capítulo", `Título do novo Capítulo para "${partTitle}":`, "", "Ex: Capítulo 1, Prólogo...");
    if (chTitle) handleAddPage('body', 'chapter', chTitle, partId);
  };

  const triggerDeletePart = async (partId: string, partTitle: string) => {
    const confirm = await customConfirm("Excluir Parte", `Excluir a parte "${partTitle}"? Os capítulos desta parte voltarão para o nível principal.`);
    if (confirm) {
      setChapters((prev: Chapter[]) => prev.map(c => c.partId === partId ? { ...c, partId: undefined } : c).filter(c => c.id !== partId));
    }
  };

  const triggerAddBackPage = async () => {
    const title = await customPrompt("Nova Página Final", "Título da nova Página Final:", "", "Ex: Sobre o Autor, Posfácio...");
    if (title) handleAddPage('back', 'custom', title);
  };

  const deleteChapter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapters.length <= 1) {
      toast('Você precisa ter pelo menos um capítulo em seu manuscrito.');
      return;
    }
    const chapterToDelete = chapters.find(c => c.id === id);
    if (!chapterToDelete) return;

    const confirmDelete = await customConfirm(
      'Delete chapter',
      `Are you sure you want to remove “${chapterToDelete.title}”? An entry will be created in your writing timeline in case you need to recover the content later.`
    );
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
    setChapters((prev: Chapter[]) => [...prev, ch]);
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


  // Auto-save logic
  useEffect(() => {
    if (!activeChapter) return;

    // Autosave snapshot every 60 seconds if content has changed
    const interval = setInterval(() => {
      if (saveStatus === 'saved') return; // Only save if there was a modification

      const newSnap: VersionSnapshot = {
        id: `snap-1783220373150`,
        chapterId: activeChapter.id,
        content: activeChapter.content,
        timestamp: new Date().toLocaleString('pt-BR'),
        title: `Salvo automaticamente`,
        charCount: activeChapter.content.length,
        isAuto: true
      };

      setSnapshots(prev => {
        // Keep maximum of 10 autosaves per chapter to avoid blowing up storage
        const chapterSnaps = prev.filter(s => s.chapterId === activeChapter.id && s.isAuto);
        let nextPrev = prev;
        if (chapterSnaps.length >= 10) {
          const oldestAuto = chapterSnaps.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())[0];
          nextPrev = prev.filter(s => s.id !== oldestAuto.id);
        }
        return [newSnap, ...nextPrev];
      });
      setSaveStatus('saved');
    }, 60000);

    return () => clearInterval(interval);
  }, [activeChapter, saveStatus, setSnapshots]);

  // Snapshots
  const createSnapshot = async () => {
    if (!activeChapter) return;
    const title = await customPrompt(
      'Criar Snapshot',
      'Dê um título para esta versão do capítulo:',
      `Snapshot do ${activeChapter.title}`,
      'Ex: Revisão final, Capítulo 1 v2...'
    );
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
      setChapters((prev: Chapter[]) => prev.map(ch => ch.id === activeChapterId ? { ...ch, content: newContent } : ch));
      toast('Substituição realizada com sucesso no capítulo atual.');
    } else {
      setChapters((prev: Chapter[]) => prev.map(ch => {
        const updatedContent = ch.content.replace(regex, replaceText);
        return { ...ch, content: updatedContent };
      }));
      toast('Substituição realizada em todos os capítulos do manuscrito.');
    }
  };

  // Planning board helpers
  const addPlanningCard = async (column: string, title?: string, content?: string) => {
    let cardTitle = title;
    if (cardTitle === undefined) {
      const res = await customPrompt('Novo Card de Planejamento', 'Digite o título para o seu card de planejamento:', '', 'Título do card...');
      cardTitle = res || '';
    }
    if (!cardTitle.trim()) return;

    let cardContent = content;
    if (cardContent === undefined) {
      const res = await customPrompt('Descrição do Card', 'Digite uma breve descrição para o card:', '', 'Descrição do card...');
      cardContent = res || '';
    }
    
    const newCard: PlanningCard = {
      id: `pc-${Date.now()}`,
      column,
      title: cardTitle.trim(),
      content: cardContent.trim(),
      tag: 'Geral'
    };
    setPlanningCards(prev => [...prev, newCard]);
  };

  const commitAddCard = (column: string) => {
    addPlanningCard(column, addCardTitle, addCardContent);
    setAddCardTitle('');
    setAddCardContent('');
    setAddCardOpenFor(null);
  };

  // Dynamic Kanban Sections helpers
  const addPlanningSection = async () => {
    const sectionName = await customPrompt('Nova Seção de Planejamento', 'Nome da nova seção:', 'Nova Seção', 'Ex: Cenário, Personagens...');
    if (sectionName && sectionName.trim()) {
      const newSection = {
        id: `sec-${Date.now()}`,
        name: sectionName.trim()
      };
      setPlanningSections(prev => [...prev, newSection]);
    }
  };

  const deletePlanningSection = async (id: string) => {
    if (planningSections.length <= 1) {
      toast('Você precisa manter pelo menos uma seção.');
      return;
    }
    const confirm = await customConfirm(
      'Excluir Seção',
      'Deseja realmente excluir esta seção? Todos os cards nela serão movidos para a primeira seção.'
    );
    if (confirm) {
      const firstSectionId = planningSections.find(s => s.id !== id)?.id || planningSections[0].id;
      setPlanningCards(prev => prev.map(card => card.column === id ? { ...card, column: firstSectionId } : card));
      setPlanningSections(prev => prev.filter(s => s.id !== id));
    }
  };

  const renamePlanningSection = async (id: string, currentName: string) => {
    const newName = await customPrompt('Renomear Seção', 'Novo nome para a seção:', currentName, 'Nome da seção...');
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
      toast('Por favor, informe o nome da ficha.');
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

  const handleDeleteBoard = async (boardId: string) => {
    const confirm = await customConfirm(
      'Excluir Pasta de Fichas',
      'Excluir esta pasta de fichas e todas as suas sub-fichas permanentemente?'
    );
    if (confirm) {
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
      toast('Por favor, insira o título do bloco.');
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

  const handleDeleteCard = async (cardId: string) => {
    const confirm = await customConfirm(
      'Excluir Bloco',
      'Excluir este bloco permanentemente?'
    );
    if (confirm) {
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
    toast('Card adicionado ao seu planejamento!');
  };



  // Local state for right active sidebar tool
  const [activeRightTool, setActiveRightTool] = useState<string | null>(null);

  return (
        <div className="w-full flex bg-surface dark:bg-surface h-screen max-h-screen overflow-hidden relative editor-workspace flex-col lg:flex-row">
      <MobileNav
        leftTab={leftTab} setLeftTab={setLeftTab}
        isLeftPanelOpen={isLeftPanelOpen} setIsLeftPanelOpen={setIsLeftPanelOpen}
        setShowProfileModal={setShowProfileModal} setGlobalSearchOpen={setGlobalSearchOpen}
        setTrashOpen={setTrashOpen} setShowExporterModal={setShowExporterModal}
        setShowEditorSettingsModal={setShowEditorSettingsModal}
        profile={profile}
      />
      
      {/* COLLAPSIBLE LEFT SIDEBAR ICON STRIP */}
      {!isDistractionFree && (
        <DesktopNav
          leftTab={leftTab}
          setLeftTab={setLeftTab}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
          setShowProfileModal={setShowProfileModal}
          setGlobalSearchOpen={setGlobalSearchOpen}
          globalSearchOpen={globalSearchOpen}
          trashOpen={trashOpen}
          setTrashOpen={setTrashOpen}
          profile={profile}
          isDark={isDark}
          setTheme={setTheme}
        />
      )}

      {/* LEFT SIDEBAR: MANUSCRITO OR PLANEJAMENTO */}
      {!isDistractionFree && isLeftPanelOpen && (
        <LeftSidebar
          leftTab={leftTab}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
          chapters={chapters}
          setChapters={setChapters}
          activeChapterId={activeChapterId}
          setActiveChapterId={setActiveChapterId}
          saveStatus={saveStatus}
          triggerAddFrontPage={triggerAddFrontPage}
          triggerAddBodyPage={triggerAddBodyPage}
          triggerAddChapterToPart={triggerAddChapterToPart}
          triggerDeletePart={triggerDeletePart}
          triggerAddBackPage={triggerAddBackPage}
          deleteChapter={deleteChapter}
          moveChapterInSection={moveChapterInSection}
          planningBlocks={planningBlocks}
          setPlanningBlocks={setPlanningBlocks}
          setEditingCard={setEditingCard}
          setCardFormTitle={setCardFormTitle}
          setCardFormType={setCardFormType}
          setCardFormContent={setCardFormContent}
          setCardFormEmoji={setCardFormEmoji}
          setIsNewCard={setIsNewCard}
          setShowCardModal={setShowCardModal}
          handleOpenEditCard={handleOpenEditCard}
          activeWords={activeWords}
          totalWords={totalWords}
          totalChars={totalChars}
          settings={settings}
          setSettings={setSettings}
          dailyProgress={dailyProgress}
          sessionMood={sessionMood}
          setSessionMood={setSessionMood}
          wordFrequency={wordFrequency}
          readingTime={readingTime}
        />
      )}

      {/* CENTER WRITING AREA & CANVAS */}
      <section className="flex-1 flex flex-col bg-surface dark:bg-surface relative overflow-hidden">
        
        {leftTab === 'planning' ? (
          /* FULL PAGE KANBAN PLANNING BOARD */
          <div className="flex-1 overflow-y-auto p-8 bg-surface dark:bg-surface text-neutral-800 dark:text-on-surface space-y-10 select-none">
            {/* Planning Header */}
            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-outline-variant pb-4">
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
                  <div className="flex justify-between items-center border-b border-neutral-200 dark:border-outline-variant pb-2">
                    <div className="flex items-center gap-2 select-none">
                      <span 
                        onClick={() => renamePlanningSection(section.id, section.name)}
                        className="text-lg font-bold text-neutral-800 dark:text-on-surface font-serif cursor-pointer hover:text-indigo-600"
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
                      className="bg-neutral-50 dark:bg-surface-container-lowest hover:bg-neutral-100 dark:hover:bg-neutral-850 text-indigo-600 dark:text-indigo-400 border border-neutral-200 dark:border-outline-variant text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
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
                          className="w-[245px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-outline-variant p-4 rounded-xl text-sm relative group space-y-2 cursor-grab active:cursor-grabbing hover:border-neutral-300 dark:hover:border-neutral-750 transition-all shadow-sm text-left flex flex-col justify-between min-h-[135px]"
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
                                  className="text-on-surface-variant hover:text-indigo-500 cursor-pointer transition-colors"
                                  title={isPinned ? "Desafixar" : "Fixar nas notas"}
                                >
                                  <Pin size={11} className={isPinned ? "fill-indigo-500 text-indigo-500" : ""} />
                                </button>
                                <span className="text-neutral-350 dark:text-neutral-700 cursor-grab">⋮⋮</span>
                              </div>
                            </div>
                            {card.images && card.images.length > 0 && (
                              <img 
                                src={card.images[0]} 
                                alt="Card Preview" 
                                className="w-full h-20 object-cover rounded-lg border border-neutral-200 dark:border-outline-variant my-1"
                              />
                            )}
                            <p className="text-on-surface-variant dark:text-on-surface-variant text-sm leading-relaxed font-sans mt-1.5 line-clamp-3">{card.content}</p>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-outline-variant mt-2">
                            <span className="text-[9px] bg-neutral-100 dark:bg-surface-container-lowest text-on-surface-variant dark:text-on-surface-variant px-2 py-0.5 rounded font-mono uppercase font-bold">{card.tag || 'Geral'}</span>
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
                      <div className="text-on-surface-variant dark:text-neutral-600 text-xs italic font-sans py-2 select-none">Sem cards nesta seção. Clique em "Add +" para criar.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* The Text Editor Canvas Sheet */
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 lg:px-20 flex justify-center bg-surface dark:bg-surface">
            <div className="w-full max-w-3xl flex flex-col bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-2xl p-8 md:p-14 relative min-h-[70vh] editor-paper">
              
              {/* Chapter Header */}
              <div className="mb-6 border-b border-outline-variant/80 pb-4">
                <input
                  type="text"
                  value={activeChapter ? activeChapter.title : ''}
                  onChange={handleTitleChange}
                  placeholder="Título do Capítulo..."
                  className="w-full font-serif text-2xl md:text-3xl text-white border-none bg-transparent focus:outline-none placeholder:text-neutral-700 font-medium"
                />
                <span className="text-[9px] font-mono text-on-surface-variant mt-1 block uppercase tracking-wider">
                  Última edição realizada hoje, às {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Selection Toolbar for editor */}
              {editor && <SelectionToolbar editor={editor} focusMode={isDistractionFree} />}

              {/* Writing Area */}
              <div 
                className={`flex-1 w-full text-left bg-transparent focus:outline-none ${getFontClass()} ${getFontSizeClass()} text-on-surface outline-none`}
                style={{ minHeight: '380px' }}
              >
                {editor && <EditorContent editor={editor} />}
              </div>

              {/* Distraction free overlay indicators */}
              {isDistractionFree && (
                <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center border-t border-outline-variant/50 pt-4 text-[10px] font-mono text-on-surface-variant select-none">
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
          <RightSidebar
            activeRightTool={activeRightTool}
            setActiveRightTool={setActiveRightTool}
            sessionMood={sessionMood}
            setSessionMood={setSessionMood}
            readingTime={readingTime}
            activeWords={activeWords}
            activeChapter={activeChapter}
            wordFrequency={wordFrequency}
            planningSections={planningSections}
            setPlanningCards={setPlanningCards}
            pinnedCardsList={pinnedCardsList}
            setPinnedCardsList={setPinnedCardsList}
            planningCards={planningCards}
            togglePinCard={togglePinCard}
            trackChanges={trackChanges}
            setTrackChanges={setTrackChanges}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            createSnapshot={createSnapshot}
            snapshots={snapshots}
            findText={findText}
            setFindText={setFindText}
            replaceText={replaceText}
            setReplaceText={setReplaceText}
            matchCase={matchCase}
            setMatchCase={setMatchCase}
            searchOnlyThisChapter={searchOnlyThisChapter}
            setSearchOnlyThisChapter={setSearchOnlyThisChapter}
            executeFindAndReplace={executeFindAndReplace}
            spellingActive={spellingActive}
            setSpellingActive={setSpellingActive}
            footnotes={footnotes}
            setFootnotes={setFootnotes}
            editor={editor}
          />

          {/* Collapsible right sidebar icon strip */}
          <aside className="w-16 border-l border-outline-variant bg-surface dark:bg-surface flex flex-col justify-between items-center py-4 shrink-0 select-none">
            {/* Top stack icons */}
            <div className="space-y-3.5 flex flex-col items-center">
              <button
                onClick={() => setActiveRightTool(activeRightTool === 'stats' ? null : 'stats')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'stats'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
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
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
                }`}
                title="Corretor Ortográfico"
              >
                <Type size={18} />
              </button>

              <button
                onClick={(e) => {
                  if (activeChapter) {
                    deleteChapter(activeChapter.id, e);
                  }
                }}
                className="p-2 rounded-xl border border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest transition-all cursor-pointer"
                title="Excluir Capítulo Atual"
              >
                <Trash2 size={18} />
              </button>

              <button
                onClick={() => setActiveRightTool(activeRightTool === 'footnotes' ? null : 'footnotes')}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  activeRightTool === 'footnotes'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-transparent text-on-surface-variant hover:text-white hover:bg-surface-container-lowest'
                }`}
                title="Notas de Rodapé"
              >
                <BookMarked size={18} />
              </button>
            </div>

            {/* Bottom stack: exporter and editor settings */}
            <div className="space-y-3.5 flex flex-col items-center">
              {/* Diagramador e exportador */}
              <button
                onClick={() => setShowExporterModal(true)}
                className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-lowest border border-transparent transition-all cursor-pointer"
                title="Diagramação & Exportação"
              >
                <Download size={18} />
              </button>

              {/* Configurações do Editor (Engrenagem) */}
              <button
                onClick={() => setShowEditorSettingsModal(true)}
                className="p-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-lowest border border-transparent transition-all cursor-pointer"
                title="Configurações do Editor (Fonte, Tamanho, etc.)"
              >
                <Settings size={18} />
              </button>
            </div>
          </aside>
        </div>
      )}

                              {/* MODAL 1: EXPORTER / DIAGRAMADOR MODAL */}
      {showExporterModal && <ExporterModal onClose={() => setShowExporterModal(false)} />}

      {showExporterModal && <ExporterModal onClose={() => setShowExporterModal(false)} />}

      {showExporterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface dark:bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <BookMarked size={18} className="text-indigo-400" />
                <span className="font-serif font-bold text-lg text-white">Configurações do Editor: Diagramador & Exportador</span>
              </div>
              <button 
                onClick={() => setShowExporterModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
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
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}

      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface dark:bg-[#0c0c0e]">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                <span className="font-serif font-bold text-lg text-white">Configurações do Perfil de Autor</span>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
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

                              {/* MODAL 2.5: EDITOR DETAILS SETTINGS MODAL */}
      {showEditorSettingsModal && <EditorSettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowEditorSettingsModal(false)} />}

      {showEditorSettingsModal && <EditorSettingsModal settings={settings} setSettings={setSettings} onClose={() => setShowEditorSettingsModal(false)} />}

      {showEditorSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-4 text-left">
            {/* Close Button */}
            <button 
              onClick={() => setShowEditorSettingsModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-indigo-400" />
              <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">Configurações do Editor</h3>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ajuste as preferências de visualização da área de escrita do editor. Essas configurações alteram apenas a sua visualização local.
            </p>

            <div className="space-y-4 pt-2">
              {/* Font Family Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Família de Fonte</label>
                <select
                  value={settings.preferredFont}
                  onChange={(e) => setSettings((prev: WritingSettings) => ({ ...prev, preferredFont: e.target.value as WritingSettings['preferredFont'] }))}
                  className="text-sm border border-neutral-200 dark:border-outline-variant bg-white dark:bg-surface-container-lowest text-neutral-800 dark:text-neutral-300 p-2.5 rounded-xl focus:outline-none w-full"
                >
                  <option value="serif">Garamond (Clássica/Serifada)</option>
                  <option value="sans">Inter (Moderna/Sem Serifas)</option>
                  <option value="mono">JetBrains Mono (Espaçamento Único)</option>
                </select>
              </div>

              {/* Font Size Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Tamanho do Texto</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setSettings((prev: WritingSettings) => ({ ...prev, fontSize: e.target.value as WritingSettings['fontSize'] }))}
                  className="text-sm border border-neutral-200 dark:border-outline-variant bg-white dark:bg-surface-container-lowest text-neutral-800 dark:text-neutral-300 p-2.5 rounded-xl focus:outline-none w-full"
                >
                  <option value="sm">Pequeno</option>
                  <option value="md">Médio</option>
                  <option value="lg">Grande</option>
                  <option value="xl">Extra Grande</option>
                </select>
              </div>

              {/* Layout Margins */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Margem do Editor</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { key: 'tight', name: 'Estreita' },
                    { key: 'normal', name: 'Padrão' },
                    { key: 'wide', name: 'Ampla' }
                  ] as const).map((margin) => (
                    <button
                      key={margin.key}
                      onClick={() => setSettings((prev: WritingSettings) => ({ ...prev, marginSize: margin.key }))}
                      className={`py-2 px-3 text-xs border rounded-xl text-center transition-all cursor-pointer ${
                        settings.marginSize === margin.key
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                          : 'border-neutral-200 dark:border-outline-variant hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-600 dark:text-on-surface-variant'
                      }`}
                    >
                      {margin.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowEditorSettingsModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW BOARD MODAL */}
      {showNewBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowNewBoardModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white">Criar Nova Pasta de Fichas</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-16 space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Ícone</label>
                  <input 
                    type="text" 
                    value={newBoardEmoji} 
                    onChange={(e) => setNewBoardEmoji(e.target.value)}
                    className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-center text-lg"
                    placeholder="📂"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Nome da Pasta</label>
                  <input 
                    type="text" 
                    value={newBoardName} 
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-xs text-white"
                    placeholder="Ex: Personagens Principais"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Descrição</label>
                <textarea 
                  value={newBoardDesc} 
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-xs text-white h-20 resize-none font-sans"
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
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => {
                setShowCardModal(false);
                setEditingCard(null);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white font-serif">
              {isNewCard ? 'Criar Ficha/Bloco' : 'Editar Ficha/Bloco'}
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-16 space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase">Ícone</label>
                  <input 
                    type="text" 
                    value={cardFormEmoji} 
                    onChange={(e) => setCardFormEmoji(e.target.value)}
                    className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-center text-lg"
                    placeholder="📝"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Título do Bloco</label>
                  <input 
                    type="text" 
                    value={cardFormTitle} 
                    onChange={(e) => setCardFormTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-xs text-white"
                    placeholder="Ex: Protagonista - Ficha"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Tipo de Elemento</label>
                <select 
                  value={cardFormType} 
                  onChange={(e) => setCardFormType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-xs text-white"
                >
                  <option value="character">Personagem</option>
                  <option value="location">Local</option>
                  <option value="event">Evento</option>
                  <option value="note">Nota</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase font-sans">Conteúdo da Ficha</label>
                <textarea 
                  value={cardFormContent} 
                  onChange={(e) => setCardFormContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2 text-xs text-white h-40 resize-none font-sans"
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
      {showAddPageModal && <AddPageWizardModal onClose={() => setShowAddPageModal(false)} />}

      {showAddPageModal && <AddPageWizardModal onClose={() => setShowAddPageModal(false)} />}

      {showAddPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4 select-none">
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setShowAddPageModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            <h3 className="font-serif font-bold text-lg text-white">Adicionar Nova Página ao Manuscrito</h3>

            <div className="space-y-4">
              {/* 1. Choose Section */}
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">1. Seção do Livro</label>
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
                          : 'border-outline-variant hover:bg-surface-container-lowest text-on-surface-variant font-medium'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Choose Template Type */}
              <div className="space-y-1">
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">2. Tipo de Página / Modelo</label>
                <select
                  value={addPageType}
                  onChange={(e) => setAddPageType(e.target.value)}
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2.5 text-xs text-white"
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
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">3. Título da Página</label>
                <input
                  type="text"
                  value={addPageTitle}
                  onChange={(e) => setAddPageTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg p-2.5 text-xs text-white"
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
          <div className="bg-surface dark:bg-surface border border-outline-variant rounded-2xl w-full max-w-4xl h-[75vh] flex overflow-hidden shadow-2xl relative animate-fade-in">
            {/* Sidebar filter list */}
            <div className="w-60 border-r border-outline-variant bg-surface dark:bg-[#0c0c0e] p-5 flex flex-col gap-4 shrink-0">
              <h3 className="font-sans font-bold text-sm text-neutral-300 uppercase tracking-widest pl-1">Ativos / Assets</h3>
              
              <div className="relative">
                <input 
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full bg-neutral-950 border border-outline-variant rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
                <Search size={13} className="absolute left-2.5 top-3 text-on-surface-variant" />
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
                        : 'border border-transparent text-on-surface-variant hover:bg-surface-container-lowest/60 hover:text-on-surface'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side templates list */}
            <div className="flex-1 flex flex-col h-full bg-surface dark:bg-surface">
              <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant select-none">
                <span className="font-serif font-bold text-base text-white">
                  {templateFilter === 'all' ? 'Todos os Templates' : templateFilter}
                </span>
                <button 
                  onClick={() => setShowTemplatesModal(false)}
                  className="p-1.5 hover:bg-neutral-800 rounded-lg text-on-surface-variant hover:text-white transition-colors cursor-pointer"
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
                      className="flex items-center justify-between border-b border-outline-variant/80 pb-4 select-none"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center justify-center text-xl shrink-0">
                          {tpl.emoji}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white font-sans">{tpl.title}</h4>
                          <p className="text-on-surface-variant text-[12px] leading-relaxed max-w-xl font-sans">{tpl.description}</p>
                          <span className="text-[9px] bg-neutral-950 border border-outline-variant text-on-surface-variant font-semibold px-2 py-0.5 rounded font-mono uppercase tracking-wider block w-fit">
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
      <TrashModal trashOpen={trashOpen} setTrashOpen={setTrashOpen} customConfirm={customConfirm} />

      {/* MODAL 8: GLOBAL SEARCH OVERLAY */}
      <GlobalSearchModal
        globalSearchOpen={globalSearchOpen} setGlobalSearchOpen={setGlobalSearchOpen}
        globalSearchQuery={globalSearchQuery} setGlobalSearchQuery={setGlobalSearchQuery}
        setActiveChapterId={setActiveChapterId} setLeftTab={setLeftTab}
        setIsLeftPanelOpen={setIsLeftPanelOpen} setActiveBoardId={setActiveBoardId}
        setActiveRightTool={setActiveRightTool}
      />

      {/* MODAL 9: CUSTOM STYLED DIALOG (PROMPT / CONFIRM) */}
      <PromptConfirmDialog
        isOpen={dialogState.isOpen}
        type={dialogState.type}
        title={dialogState.title}
        message={dialogState.message}
        defaultValue={dialogState.defaultValue}
        placeholder={dialogState.placeholder}
        onConfirm={dialogState.onConfirm}
        onCancel={dialogState.onCancel}
      />

      {/* PLANNING CARD DETAILS MODAL OVERLAY (Item 3) */}
      {activePlanningCardId && (() => {
        const card = planningCards.find(c => c.id === activePlanningCardId);
        if (!card) return null;
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm px-4">
            <div className="bg-surface dark:bg-[#0c0c0e] border border-neutral-200 dark:border-outline-variant rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4 text-left animate-fade-in">
              <button 
                onClick={() => setActivePlanningCardId(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
              
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Editar Card de Planejamento</div>
                <input 
                  type="text" 
                  value={card.title} 
                  onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))}
                  className="w-full text-2xl font-bold font-serif text-neutral-900 dark:text-white bg-transparent border-none focus:outline-none p-0"
                  placeholder="Título do card..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-on-surface-variant">Descrição / Conteúdo</label>
                <textarea 
                  value={card.content} 
                  rows={4}
                  onChange={(e) => setPlanningCards(prev => prev.map(c => c.id === card.id ? { ...c, content: e.target.value } : c))}
                  className="w-full bg-white dark:bg-surface-container-lowest border border-neutral-200 dark:border-outline-variant rounded-xl p-3 text-sm text-neutral-800 dark:text-white focus:outline-none leading-relaxed resize-none"
                  placeholder="Digite o conteúdo do card..."
                />
              </div>

              {/* Multiple Images Upload & Gallery */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-on-surface-variant block">Imagens anexadas</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {card.images && card.images.map((img, i) => (
                    <div key={i} className="relative group/img w-24 h-16 border border-neutral-200 dark:border-outline-variant rounded-xl overflow-hidden shadow-sm">
                      <img src={img} alt="Attached illustration" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => {
                          setPlanningCards(prev => prev.map(c => {
                            if (c.id === card.id && c.images) {
                              return { ...c, images: c.images.filter((_, idx) => idx !== i) };
                            }
                            return c;
                          }));
                        }}
                        className="absolute inset-0 bg-red-600/70 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity font-bold text-xs"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = (e: any) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          const readPromises = Array.from(files).map((file: any) => {
                            return new Promise<string>((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result as string);
                              reader.readAsDataURL(file);
                            });
                          });
                          Promise.all(readPromises).then(base64Images => {
                            setPlanningCards(prev => prev.map(c => {
                              if (c.id === card.id) {
                                return { ...c, images: [...(c.images || []), ...base64Images] };
                              }
                              return c;
                            }));
                          });
                        }
                      };
                      input.click();
                    }}
                    className="w-24 h-16 border-2 border-dashed border-neutral-300 dark:border-outline-variant hover:border-indigo-500 flex flex-col items-center justify-center text-on-surface-variant hover:text-indigo-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                    <span className="text-[9px] font-bold uppercase mt-1">Adicionar</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setActivePlanningCardId(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer shadow-md transition-colors"
                >
                  Salvar e Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
