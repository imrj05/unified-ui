# @work-rjkashyap/unified-ui

> A scalable, token-driven React design system with 75+ components, built with Tailwind CSS v4, Radix UI, and Framer Motion.

[![npm version](https://img.shields.io/npm/v/@work-rjkashyap/unified-ui)](https://www.npmjs.com/package/@work-rjkashyap/unified-ui)
[![npm downloads](https://img.shields.io/npm/dm/@work-rjkashyap/unified-ui)](https://www.npmjs.com/package/@work-rjkashyap/unified-ui)
[![license](https://img.shields.io/npm/l/@work-rjkashyap/unified-ui)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8)](https://tailwindcss.com/)

---

## Features

- **Token-driven** — Every color, spacing, radius, shadow, and motion value flows from a single source of truth
- **75+ components** — Production-ready composites built on Radix UI primitives
- **Tailwind CSS v4** — First-class integration via `@theme` with direct utility classes
- **Framer Motion** — Consistent animation presets with `prefers-reduced-motion` support
- **Accessible** — WCAG AA contrast, keyboard navigation, ARIA attributes, and focus management
- **Tree-shakeable** — 7 independent entry points with ESM/CJS dual output and code splitting
- **Type-safe** — Full TypeScript coverage with exported types for every prop, variant, and token
- **Dark mode** — CSS variable–based theming with automatic `.dark` class support

---

## Installation

```bash
npm install @work-rjkashyap/unified-ui
```

### Peer Dependencies

| Package       | Version  | Required |
| ------------- | -------- | -------- |
| `react`       | ≥ 19.0.0 | Yes      |
| `react-dom`   | ≥ 19.0.0 | Yes      |
| `tailwindcss` | ≥ 4.0.0  | Optional |

Radix UI primitives, Framer Motion, and TanStack Table are optional — install only the ones you use:

```bash
# If using motion presets
npm install framer-motion

# If using the DataTable component
npm install @tanstack/react-table

# If using Radix-based components (Dialog, Select, Tabs, etc.)
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
# ... and any other @radix-ui/* packages for the components you need
```

---

## Quick Start

### 1. Import the CSS

Add the stylesheet to your global CSS file **before** any component usage. This registers all CSS custom properties and Tailwind `@theme` utilities.

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "@work-rjkashyap/unified-ui/styles.css";
```

### 2. Load Fonts (Recommended)

Unified UI references four font families via CSS variables. Load them in your root layout:

```tsx
// src/app/layout.tsx
import { Outfit, Inter, Lora, JetBrains_Mono } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${lora.variable} ${jetbrainsMono.variable} ${outfit.className}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

If you don't load these fonts, the system gracefully falls back to system font stacks.

### 3. Wrap with Theme Provider (Optional)

If you need programmatic light/dark/system theme toggling:

```tsx
import { DSThemeProvider } from "@work-rjkashyap/unified-ui";

export default function Providers({ children }) {
  return <DSThemeProvider>{children}</DSThemeProvider>;
}
```

If you already use `next-themes` or another provider that toggles the `.dark` class on `<html>`, the CSS variables respond automatically — no `DSThemeProvider` needed.

### 4. Use Components

```tsx
import { Button, Heading, Body, Stack } from "@work-rjkashyap/unified-ui";

export function Hero() {
  return (
    <Stack direction="column" gap={4}>
      <Heading level={1}>Welcome to Unified UI</Heading>
      <Body>A token-driven design system for React applications.</Body>
      <Button variant="primary" size="md">
        Get Started
      </Button>
    </Stack>
  );
}
```

---

## Import Patterns

### Barrel import (most common)

```tsx
import { Button, Typography, fadeIn, cn } from "@work-rjkashyap/unified-ui";
```

### Layer-specific imports (better tree-shaking in large apps)

```tsx
import { spacing, radius } from "@work-rjkashyap/unified-ui/tokens";
import { DSThemeProvider } from "@work-rjkashyap/unified-ui/theme";
import { Typography, Heading } from "@work-rjkashyap/unified-ui/primitives";
import { Button, Dialog, DataTable } from "@work-rjkashyap/unified-ui/components";
import { slideUp, motionProps } from "@work-rjkashyap/unified-ui/motion";
import { cn, mergeSlots } from "@work-rjkashyap/unified-ui/utils";
```

---

## Architecture

The design system is organized into strict layers. Each layer only depends on the layers below it — never sideways or upward.

```
┌─────────────────────────────────────────────────┐
│  Layer 6: Utilities         src/utils/           │
│  Layer 5: Motion System     src/motion/          │
│  Layer 4: Components        src/components/      │
│  Layer 3: Primitives        src/primitives/      │
│  Layer 2: Theme System      src/theme/           │
│  Layer 1: Design Tokens     src/tokens/          │
└─────────────────────────────────────────────────┘
```

### Layer 1 — Design Tokens (`tokens/`)

Raw design values: colors, spacing, typography, radius, shadows, z-index, and motion timing. The **single source of truth** for all visual properties.

| File            | Contents                                                    |
| --------------- | ----------------------------------------------------------- |
| `colors.ts`     | Color palettes + semantic maps for light/dark               |
| `spacing.ts`    | 4px-grid spacing scale                                      |
| `typography.ts` | Font families, sizes, weights, line heights, letter spacing |
| `radius.ts`     | Border radius scale                                         |
| `shadows.ts`    | Box shadow elevation scale (light + dark)                   |
| `z-index.ts`    | Z-index layering scale                                      |
| `motion.ts`     | Duration, easing, spring, and stagger tokens                |

### Layer 2 — Theme System (`theme/`)

Bridges tokens to runtime via CSS custom properties and React context.

| File           | Contents                                                    |
| -------------- | ----------------------------------------------------------- |
| `contract.ts`  | Maps token keys → CSS variable names, `cssVar` helper       |
| `provider.tsx` | `DSThemeProvider` + `useDSTheme` hook                       |

### Layer 3 — Primitives (`primitives/`)

Foundational UI building blocks:

- **Typography** — `Typography`, `Heading`, `Subheading`, `Body`, `Caption`, `Label`, `Overline`, `InlineCode`
- **Layout** — `Container`, `Stack`, `Grid`
- **Structural** — `Divider`

### Layer 4 — Components (`components/`)

75+ production-ready composite components including:

| Component      | Component       | Component      |
| -------------- | --------------- | -------------- |
| Accordion      | Dialog          | Select         |
| Alert          | DropdownMenu    | Sheet          |
| Avatar         | Input           | Skeleton       |
| Badge          | Pagination      | Switch         |
| Breadcrumb     | Popover         | Table          |
| Button         | Radio           | Tabs           |
| Card           | Checkbox        | Textarea       |
| DataTable      | Calendar        | Toast / Tooltip|
| Combobox       | DatePicker      | Sidebar        |
| Command        | ColorPicker     | TreeView       |
| Carousel       | FileUpload      | VideoPlayer    |

### Layer 5 — Motion (`motion/`)

Framer Motion animation presets: `fadeIn`, `slideUp`, `scaleIn`, `modalContent`, `toastSlideIn`, stagger containers, micro-interactions, and reduced-motion utilities.

Hooks: `useMotion`, `useMotionProps`, `useMotionSpringConfig`, `useReducedMotion`, and the `MotionSafe` wrapper component.

### Layer 6 — Utilities (`utils/`)

- `cn()` — class merging (clsx + tailwind-merge)
- `mergeSlots()` — slot-based class composition
- `composeRefs()` — combine multiple refs
- `dsAttr()` / `dsStateAttr()` — data attribute generators
- `dsVar()` / `dsColorVar()` — CSS variable reference helpers
- Focus ring utilities (`focusRingClasses`, `focusRingInsetClasses`, etc.)
- WCAG contrast checking utilities (`checkHexContrast`, `auditContrast`, etc.)
- Polymorphic component types

---

## CSS Variable Prefix

All CSS custom properties use plain `--` prefix with no namespace infix:

```
--primary
--radius-md
--shadow-lg
--duration-normal
--easing-standard
--font-sans
```

### Tailwind Utility Classes

After importing the CSS, use standard Tailwind utilities:

```html
<!-- Colors (supports opacity modifier) -->
<div class="bg-primary text-primary-foreground">Primary</div>
<div class="bg-muted/50">Semi-transparent muted</div>

<!-- Radius, shadows, transitions -->
<div class="rounded-md shadow-lg">Elevated card</div>
<button class="duration-fast ease-standard">Animated</button>

<!-- Fonts -->
<p class="font-serif">Editorial text</p>
<code class="font-mono">console.log("hello")</code>
```

### Data Attributes

Components emit `data-ds` attributes for CSS scoping and testing:

```html
<button data-ds data-ds-component="button" data-ds-variant="primary" data-ds-size="md">
  Click me
</button>
```

---

## Entry Points

The package provides 7 independently importable entry points for optimal tree-shaking:

| Entry Point | Import Path                              | Contains                          |
| ----------- | ---------------------------------------- | --------------------------------- |
| Root        | `@work-rjkashyap/unified-ui`            | Everything (barrel)               |
| Tokens      | `@work-rjkashyap/unified-ui/tokens`     | Design tokens (pure JS, no React) |
| Theme       | `@work-rjkashyap/unified-ui/theme`      | Theme provider, contract, hooks   |
| Primitives  | `@work-rjkashyap/unified-ui/primitives` | Typography, Layout, Divider       |
| Components  | `@work-rjkashyap/unified-ui/components` | All 75+ composite components      |
| Motion      | `@work-rjkashyap/unified-ui/motion`     | Animation presets and utilities    |
| Utils       | `@work-rjkashyap/unified-ui/utils`      | cn, mergeSlots, contrast, etc.    |
| CSS         | `@work-rjkashyap/unified-ui/styles.css` | Tailwind @theme + CSS variables   |

---

## Build

The package is built with [tsup](https://tsup.egoist.dev/), producing:

- **ESM** (`.mjs`) and **CJS** (`.cjs`) formats
- **TypeScript declarations** (`.d.ts` / `.d.cts`)
- Code splitting enabled for optimal bundle size
- Selective `"use client"` directive on client entry points (tokens/utils remain server-safe)

```bash
# Build the package
npm run build

# Watch mode for development
npm run dev

# Type check
npm run typecheck

# Clean dist/
npm run clean
```

---

## Key Rules

1. **Never hardcode design values.** All colors, spacing, radii, shadows, and motion values must come from tokens.
2. **Always use `cn()` for class merging.** Never concatenate class strings manually.
3. **Components must emit `data-ds` attributes** for scoping and testability.
4. **Respect the layer hierarchy.** Tokens → Theme → Primitives → Components. No upward imports.
5. **All components must support `ref` forwarding** via `React.forwardRef`.
6. **Accessibility is mandatory.** Focus rings, ARIA attributes, keyboard navigation, and `prefers-reduced-motion` support.

---

## Adding a New Component

1. Create `src/components/<name>.tsx`
2. Use CVA for variant composition (if the component has variants)
3. Use `cn()` for all class merging
4. Forward refs with `React.forwardRef`
5. Add `data-ds`, `data-ds-component`, and relevant `data-ds-*` state attributes
6. Export from `src/components/index.ts`
7. Re-export from `src/index.ts`

---

## Version

Check the installed version programmatically:

```tsx
import { UNIFIED_UI_VERSION } from "@work-rjkashyap/unified-ui";
console.log(UNIFIED_UI_VERSION); // "0.3.7"
```

---

## Troubleshooting

### `bg-primary` and other Tailwind utilities aren't working

Make sure you import the CSS **after** `@import "tailwindcss"` in your global stylesheet. The `@theme` block must be processed by Tailwind.

### Fonts aren't loading

Verify that the CSS variables (`--font-outfit`, `--font-inter`, etc.) are applied to the `<html>` element. Inspect with DevTools → Computed Styles.

### Dark mode isn't switching

Unified UI uses the `.dark` class on `<html>` for dark mode. Ensure your theme provider toggles this class.

### Bundle size is larger than expected

Use layer-specific imports (`@work-rjkashyap/unified-ui/components`) instead of the barrel import to improve tree-shaking.

### DataTable peer dependency error

The `DataTable` component requires `@tanstack/react-table` ≥ 8.0.0. Install it separately:

```bash
npm install @tanstack/react-table
```

---

## Documentation

Full interactive documentation with live component previews is available in the monorepo's Next.js docs app. To run it locally:

```bash
git clone https://github.com/imrj05/unified-ui.git
cd unified-ui
npm install
npm run dev
```

---

## Contributing

Contributions are welcome! Please see the [GitHub repository](https://github.com/imrj05/unified-ui) for guidelines.

1. Fork the repo and create a feature branch
2. Make your changes in `packages/unified-ui/src/`
3. Run `npm run build:ds` to verify the build
4. Submit a pull request

---

## License

MIT © [Rajeshwar Kashyap](https://github.com/imrj05)
