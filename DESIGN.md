# Design System — GospelReads Editor

Referência completa de design tokens usados no editor.
Todos os valores foram extraídos diretamente dos arquivos fonte:
`src/app/globals.css`, `src/app/layout.tsx`, `packages/ui/src/components/button.tsx`,
`src/components/theme/ThemeToggle.tsx`, `components.json`.

---

## 1. Font Families

| Token CSS | Família | Fallback | Uso | Peso Disponível |
|-----------|---------|----------|-----|-----------------|
| `--font-sans` | Inter | system-ui, sans-serif | Body, labels, captions, headings por padrão | 300, 400, 500, 600, 700 |
| `--font-serif` | EB Garamond | Georgia, serif | Headlines (display-lg, headline-lg, headline-md) | 400–800 (variável) |
| `--font-mono` | JetBrains Mono | monospace | Código, blocos `<pre>`, `<code>` | 400, 500, 600, 700 |

> **Nota histórica:** `Playfair Display` era carregada via `next/font/google` mas foi removida
> por não ter uso real na UI (apenas como opção de exportação em settings). A fonte serif
> efetiva é **EB Garamond**, carregada via Google Fonts `@import`.

### Mapeamento de tokens tipográficos por família

| Token | Família Associada |
|-------|-------------------|
| `--font-display-lg` | `--font-serif` (EB Garamond) |
| `--font-headline-lg` | `--font-serif` (EB Garamond) |
| `--font-headline-lg-mobile` | `--font-serif` (EB Garamond) |
| `--font-headline-md` | `--font-serif` (EB Garamond) |
| `--font-body-lg` | `--font-sans` (Inter) |
| `--font-body-md` | `--font-sans` (Inter) |
| `--font-label-lg` | `--font-sans` (Inter) |
| `--font-label-md` | `--font-sans` (Inter) |
| `--font-caption` | `--font-sans` (Inter) |
| `--font-heading` | `--font-sans` (Inter) |

---

## 2. Font Size Scale

| Token | Tamanho | Line-height | Letter-spacing | Weight |
|-------|---------|-------------|----------------|--------|
| `display-lg` | 64px | 1.1 | -0.02em | 700 |
| `headline-lg` | 40px | 1.2 | — | 700 |
| `headline-lg-mobile` | 32px | 1.2 | — | 700 |
| `headline-md` | 24px | — | — | — |
| `body-lg` | 18px | 1.6 | — | 400 |
| `body-md` | 17px | 1.6 | — | 400 |
| `label-lg` | 14px | 1.2 | 0.05em | 600 |
| `label-md` | 12px | 1.2 | 0.05em | 500 |
| `caption` | 12px | 1.4 | — | 400 |

---

## 3. Color Palette — Light Mode (`:root`)

### Surface Hierarchy

| Token | Valor |
|-------|-------|
| `--surface` | `#fdf8f8` |
| `--surface-dim` | `#ddd9d8` |
| `--surface-bright` | `#fdf8f8` |
| `--surface-container-lowest` | `#ffffff` |
| `--surface-container-low` | `#f7f3f2` |
| `--surface-container` | `#f1edec` |
| `--surface-container-high` | `#ebe7e6` |
| `--surface-container-highest` | `#e5e2e1` |

### On-surface / Text

| Token | Valor |
|-------|-------|
| `--on-surface` | `#1c1b1b` |
| `--on-surface-variant` | `#444748` |

### Inverse

| Token | Valor |
|-------|-------|
| `--inverse-surface` | `#313030` |
| `--inverse-on-surface` | `#f4f0ef` |
| `--inverse-primary` | `#c8c6c5` |

### Outline

| Token | Valor |
|-------|-------|
| `--outline` | `#5c6060` |
| `--outline-variant` | `#858989` |

### Surface Tint

| Token | Valor |
|-------|-------|
| `--surface-tint` | `#5f5e5e` |

### Containers

| Token | Valor |
|-------|-------|
| `--primary-container` | `#1c1b1b` |
| `--on-primary-container` | `#858383` |
| `--secondary-container` | `#e3e2e2` |
| `--on-secondary-container` | `#646464` |
| `--tertiary-container` | `#1d1b1a` |
| `--on-tertiary-container` | `#868381` |
| `--error-container` | `#ffdad6` |
| `--on-error-container` | `#93000a` |

### Fixed Colors

| Token | Valor |
|-------|-------|
| `--primary-fixed` | `#e5e2e1` |
| `--primary-fixed-dim` | `#c8c6c5` |
| `--on-primary-fixed` | `#1c1b1b` |
| `--on-primary-fixed-variant` | `#474646` |
| `--secondary-fixed` | `#e3e2e2` |
| `--secondary-fixed-dim` | `#c7c6c6` |
| `--on-secondary-fixed` | `#1b1c1c` |
| `--on-secondary-fixed-variant` | `#464747` |
| `--tertiary-fixed` | `#e6e1df` |
| `--tertiary-fixed-dim` | `#cac6c3` |
| `--on-tertiary-fixed` | `#1d1b1a` |
| `--on-tertiary-fixed-variant` | `#484645` |

### shadcn/ui Aliases

| Token | Valor | Descrição |
|-------|-------|-----------|
| `--primary` | `#000000` | Preto puro (botões primários, links) |
| `--primary-fg` | `#ffffff` | Texto sobre primário |
| `--secondary` | `#5e5e5e` | Cinza escuro |
| `--secondary-fg` | `#ffffff` | Texto sobre secundário |
| `--destructive` | `#ba1a1a` | Vermelho destrutivo |
| `--input` | `transparent` | Fundo de inputs |
| `--radius` | `0` | Bordas retas |

### Flowbite Tokens

| Token | Valor |
|-------|-------|
| `--neutral-primary` | `#ffffff` |
| `--neutral-primary-medium` | `#f3f4f6` |
| `--neutral-primary-soft` | `#f9fafb` |
| `--neutral-secondary-soft` | `#f3f4f6` |
| `--neutral-tertiary-medium` | `#e5e7eb` |
| `--neutral-tertiary` | `#f3f4f6` |
| `--neutral-750` | `#e5e2d9` |
| `--neutral-800` | `#e5e2d9` |
| `--neutral-850` | `#e5e2d9` |
| `--neutral-900` | `#f4f3ef` |
| `--neutral-950` | `#f6f5f0` |
| `--brand-color` | `#4f46e5` (indigo-600) |
| `--brand-strong` | `#4338ca` (indigo-700) |
| `--brand-medium` | `rgba(99, 102, 241, 0.5)` |
| `--success-soft` | `#def7ec` |
| `--danger-soft` | `#fde8e8` |
| `--warning-soft` | `#fdf6b2` |
| `--text-heading` | `#111827` |
| `--text-body` | `#4b5563` |
| `--text-body-subtle` | `#6b7280` |
| `--fg-brand` | `#4f46e5` |
| `--fg-success` | `#03543f` |
| `--fg-danger` | `#9b1c1c` |
| `--fg-warning` | `#723b13` |
| `--border-default` | `#e5e7eb` |
| `--border-default-medium` | `#d1d5db` |
| `--rounded-base` | `0.5rem` |

---

## 4. Color Palette — Dark Mode (`.dark`)

### Surface Hierarchy

| Token | Valor |
|-------|-------|
| `--surface` | `#0a0a0f` |
| `--surface-dim` | `#06060a` |
| `--surface-bright` | `#12121b` |
| `--surface-container-lowest` | `#08080c` |
| `--surface-container-low` | `#0a0a0f` |
| `--surface-container` | `#0f0f18` |
| `--surface-container-high` | `#12121b` |
| `--surface-container-highest` | `#171724` |

### On-surface / Text

| Token | Valor |
|-------|-------|
| `--on-surface` | `#F7F7F5` |
| `--on-surface-variant` | `#999999` |

### Inverse

| Token | Valor |
|-------|-------|
| `--inverse-surface` | `#F7F7F5` |
| `--inverse-on-surface` | `#0a0a0f` |
| `--inverse-primary` | `#5f5e5e` |

### Outline

| Token | Valor |
|-------|-------|
| `--outline` | `#7a7a9e` |
| `--outline-variant` | `#5a5a98` |

### Surface Tint

| Token | Valor |
|-------|-------|
| `--surface-tint` | `#999999` |

### Containers

| Token | Valor |
|-------|-------|
| `--primary-container` | `#1a1a2a` |
| `--on-primary-container` | `#cccccc` |
| `--secondary-container` | `#12121c` |
| `--on-secondary-container` | `#999999` |
| `--tertiary-container` | `#12121c` |
| `--on-tertiary-container` | `#999999` |
| `--error-container` | `#3b0004` |
| `--on-error-container` | `#ffdad6` |

### Fixed Colors

| Token | Valor |
|-------|-------|
| `--primary-fixed` | `#1a1a2a` |
| `--primary-fixed-dim` | `#12121c` |
| `--on-primary-fixed` | `#F7F7F5` |
| `--on-primary-fixed-variant` | `#cccccc` |
| `--secondary-fixed` | `#12121c` |
| `--secondary-fixed-dim` | `#0a0a0f` |
| `--on-secondary-fixed` | `#F7F7F5` |
| `--on-secondary-fixed-variant` | `#cccccc` |
| `--tertiary-fixed` | `#12121c` |
| `--tertiary-fixed-dim` | `#0a0a0f` |
| `--on-tertiary-fixed` | `#F7F7F5` |
| `--on-tertiary-fixed-variant` | `#cccccc` |

### shadcn/ui Aliases

| Token | Valor | Descrição |
|-------|-------|-----------|
| `--primary` | `#F7F7F5` | Quase branco (botões primários, links) |
| `--primary-fg` | `#0a0a0f` | Texto escuro sobre primário |
| `--secondary` | `#4a4a5a` | Cinza-azulado escuro |
| `--secondary-fg` | `#F7F7F5` | Texto claro sobre secundário |
| `--destructive` | `#ff6b6b` | Vermelho claro destrutivo |
| `--input` | `transparent` | Fundo de inputs |
| `--radius` | `0` | Bordas retas |

### Flowbite Tokens

| Token | Valor |
|-------|-------|
| `--neutral-primary` | `#09090e` |
| `--neutral-primary-medium` | `#111119` |
| `--neutral-primary-soft` | `#171724` |
| `--neutral-secondary-soft` | `#111119` |
| `--neutral-tertiary-medium` | `#171724` |
| `--neutral-tertiary` | `#1c1c2b` |
| `--neutral-750` | `#1a1a2b` |
| `--neutral-800` | `#141422` |
| `--neutral-850` | `#11111b` |
| `--neutral-900` | `#0a0a0f` |
| `--neutral-950` | `#07070a` |
| `--brand-color` | `#6366f1` (indigo-500) |
| `--brand-strong` | `#4f46e5` (indigo-600) |
| `--brand-medium` | `rgba(99, 102, 241, 0.3)` |
| `--success-soft` | `rgba(16, 185, 129, 0.1)` |
| `--danger-soft` | `rgba(239, 68, 68, 0.1)` |
| `--warning-soft` | `rgba(245, 158, 11, 0.1)` |
| `--text-heading` | `#f4f4f5` |
| `--text-body` | `#a1a1aa` |
| `--text-body-subtle` | `#a1a1aa` |
| `--fg-brand` | `#818cf8` |
| `--fg-success` | `#34d399` |
| `--fg-danger` | `#f87171` |
| `--fg-warning` | `#fbbf24` |
| `--border-default` | `#171724` |
| `--border-default-medium` | `#1c1c2b` |
| `--rounded-base` | `0.5rem` |

---

## 5. Spacing Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--spacing-container-max` | 1280px | Largura máxima de container |

---

## 6. Border Radius

Todos os tokens de radius são `0` (bordas retas / sharp corners), definidos no bloco `@theme inline`:

| Token | Valor |
|-------|-------|
| `--radius` | 0 |
| `--radius-sm` | 0 |
| `--radius-md` | 0 |
| `--radius-lg` | 0 |
| `--radius-xl` | 0 |
| `--radius-2xl` | 0 |
| `--radius-3xl` | 0 |
| `--radius-4xl` | 0 |

Exceção: `--rounded-base: 0.5rem` (8px) — token Flowbite usado apenas para componentes herdados.

---

## 7. Component Styles

### 7.1 Button (shadcn/ui — `packages/ui/src/components/button.tsx`)

Base: `inline-flex shrink-0 items-center justify-center rounded-md border border-transparent
bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none`

#### Variants

| Variant | Classes |
|---------|---------|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/80` |
| `outline` | `border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]` |
| `ghost` | `hover:bg-muted hover:text-foreground dark:hover:bg-muted/50` |
| `destructive` | `bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30` |
| `link` | `text-primary underline-offset-4 hover:underline` |

#### Sizes

| Size | Height | Padding | Font Size | SVG Size |
|------|--------|---------|-----------|----------|
| `default` | h-7 (28px) | px-2 | text-xs | size-3.5 (14px) |
| `xs` | h-5 (20px) | px-2 | 0.625rem (10px) | size-2.5 (10px) |
| `sm` | h-6 (24px) | px-2 | text-xs | size-3 (12px) |
| `lg` | h-8 (32px) | px-2.5 | text-xs | size-4 (16px) |
| `icon` | size-7 (28px) | — | — | size-3.5 (14px) |
| `icon-xs` | size-5 (20px) | — | — | size-2.5 (10px) |
| `icon-sm` | size-6 (24px) | — | — | size-3 (12px) |
| `icon-lg` | size-8 (32px) | — | — | size-4 (16px) |

Focus: `focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30`
Disabled: `disabled:pointer-events-none disabled:opacity-50`
Invalid: `aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20`

### 7.2 Input (shadcn/ui — `src/components/ui/input.tsx`)

```
h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5
text-sm transition-colors outline-none
placeholder:text-muted-foreground
focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30
disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
md:text-xs/relaxed
dark:bg-input/30
```

### 7.3 ProseMirror / Tiptap Editor

| Elemento | Estilo |
|----------|--------|
| `.ProseMirror` | `outline-none min-h-[300px] py-8 px-0` |
| `p` | `mb-4 leading-relaxed` |
| `h1` | `text-2xl font-semibold mb-4 mt-0 leading-snug` |
| `h2` | `text-xl font-semibold mb-4 mt-0 leading-snug` |
| `h3` | `text-lg font-semibold mb-3 mt-0 leading-snug` |
| `ul, ol` | `pl-6 mb-4` |
| `li` | `mb-1` |
| `blockquote` | `border-l-4 border-outline-variant pl-4 ml-0 mr-0 italic text-on-surface-variant` |
| `code` | `bg-surface-container px-1 py-0.5 font-mono text-[0.9em]` |
| `pre` | `bg-surface-container p-4 overflow-x-auto mb-4` |
| `pre code` | `bg-transparent p-0` |
| `hr` | `border-none border-t border-outline-variant my-8` |
| `a` | `text-primary underline` |
| Placeholder | `float-left text-on-surface-variant pointer-events-none h-0` |
| `::selection` | `bg-primary/15 text-on-surface` |

### 7.4 Scrollbar

| Propriedade | Valor |
|-------------|-------|
| Largura / Altura | 6px |
| Track | `transparent` / `rgba(255, 255, 255, 0.01)` |
| Thumb | `var(--outline-variant)` / `rgba(99, 102, 241, 0.2)` |
| Thumb border-radius | 3px |
| Thumb hover | `var(--on-surface-variant)` |

### 7.5 Bento Card

```
box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(0, 0, 0, 0.04);
border: 1px solid var(--outline-variant);
```

### 7.6 Custom Buttons (`.emerald-btn`, `.primary-btn`, `.outline-btn`)

| Classe | Background | Cor texto | Borda | Border-radius | Hover |
|--------|-----------|-----------|-------|---------------|-------|
| `.emerald-btn`, `.primary-btn` | `var(--brand-color)` | `#ffffff` | none | 1.5rem (24px) | bg → `var(--brand-strong)`, glow: `rgba(99,102,241,0.4)` |
| `.outline-btn` | transparent | `var(--on-surface)` | 1px `var(--outline-variant)` | 1.5rem (24px) | bg → `var(--surface-container-high)`, border → `var(--brand-color)` |

### 7.7 CTA Form / Input

| Classe | Estilo |
|--------|--------|
| `.cta-form` | `bg: var(--surface-container-low)`, `border: 1px solid var(--outline-variant)` |
| `.cta-input` | `bg: transparent`, `border: none`, `color: var(--on-surface)` |
| `.cta-input:focus` | `outline: none`, `box-shadow: none` |

### 7.8 Theme Toggle (`src/components/theme/ThemeToggle.tsx`)

- Ícones: `Sun` / `Moon` do `lucide-react`
- Tamanho dos ícones: `h-4 w-4` (16px × 16px)
- Botão: `p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors`
- Focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`

### 7.9 Editor Workspace — Light Mode Overrides

O editor aplica overrides específicos para o modo claro dentro de `.editor-workspace`,
sobrescrevendo classes Tailwind com referências às CSS variables do design system:

| Elemento | Light Override |
|----------|---------------|
| `.editor-workspace` | `bg: var(--surface-container-low)`, `color: var(--on-surface)` |
| `.bg-[#09090b]` (canvas) | `bg: var(--surface-container-low)`, `color: var(--on-surface)` |
| `.bg-neutral-900` (papel) | `bg: var(--surface-container-lowest)`, `color: var(--on-surface)` |
| `.bg-neutral-950` (inputs/cards) | `bg: var(--surface-container-low)`, `color: var(--on-surface)` |
| `.bg-neutral-900/60`, `.bg-neutral-950/40` etc. | `bg: var(--surface-container)` |
| `.bg-neutral-800`, `-850`, `-750` | `bg: var(--surface-container-high)` |
| `input, textarea, select` | `bg: var(--surface-container-lowest)`, `color: var(--on-surface)`, `border: var(--outline-variant)` |
| `input:focus, textarea:focus, select:focus` | `border: var(--brand-color)` |
| `input::placeholder` | `color: #6b665f` |
| `.text-neutral-100` a `.text-white` | `color: var(--on-surface)` |
| `.text-neutral-200, .text-neutral-300` | `color: var(--on-surface)` |
| `.text-neutral-400, .text-neutral-500` | `color: var(--on-surface-variant)` |
| Bordas (`border-neutral-*`, `hr`) | `border-color: var(--outline-variant)` |
| `.text-indigo-300/400/500` | `color: var(--brand-strong)` |
| `.bg-indigo-500/*` | `bg: rgba(79,70,229,0.08)`, `color: var(--brand-strong)` |
| `.hover:bg-neutral-*` | `bg: var(--surface-container-high)`, `color: var(--on-surface)` |
| Modal overlay | `bg: rgba(0, 0, 0, 0.45)` |
| `.bg-indigo-600` (botão) | `color: #ffffff` |

### 7.10 Mobile Nav Drawer

```
.mobile-nav-drawer {
  background-color: var(--surface);
  border-color: var(--outline-variant);
}
```

---

## 8. Dependencies

| Pacote | Versão | Papel |
|--------|--------|-------|
| Tailwind CSS | ^4.2.4 | Framework CSS utilitário |
| shadcn/ui | ^4.11.0 | Biblioteca de componentes (style: `radix-mira`, baseColor: `neutral`) |
| next-themes | ^0.4.6 | Tema claro/escuro com persistência |
| class-variance-authority | ^0.7.1 | Variantes de componentes (CVA) |
| tw-animate-css | ^1.4.0 | Animações CSS para Tailwind |
| Radix UI | ^1.6.0 | Primitivos headless (Dropdown, Slot) |
| lucide-react | ^1.14.0 | Ícones (Sun, Moon no ThemeToggle) |
| @hugeicons/core-free-icons | ^4.2.1 | Ícones (configurado como `iconLibrary` no shadcn) |
| Motion | ^12.42.0 | Animações React (ex-Framer Motion) |
| Tailwind Merge | ^3.6.0 | Merge de classes Tailwind |
| clsx | ^2.1.1 | Utilitário de classes condicionais |
| Tiptap | ^2.27.2 | Editor rich-text (ProseMirror) |
| Zustand | ^4.5.7 | Gerenciamento de estado |
| Sonner | ^2.0.7 | Toasts |
| Drizzle ORM | ^0.45.2 | ORM de banco de dados |
| Next.js | 16.2.4 | Framework React |
| React | ^19.2.5 | Biblioteca UI |
