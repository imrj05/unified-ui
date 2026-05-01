"use client";

import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@work-rjkashyap/unified-ui";
import {
  ArrowRight,
  Blocks,
  Check,
  Copy,
  Github,
  Package,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Shared ButtonLink                                                  */
/* ------------------------------------------------------------------ */

function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  className,
  ...rest
}: ComponentProps<typeof Link> & {
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  iconLeft?: ComponentProps<typeof Button>["iconLeft"];
  iconRight?: ComponentProps<typeof Button>["iconRight"];
}) {
  return (
    <Link href={href} className="contents" {...rest}>
      <Button
        as="span"
        variant={variant}
        size={size}
        iconLeft={iconLeft}
        iconRight={iconRight}
        className={className}
      >
        {children}
      </Button>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Getting-started steps                                              */
/* ------------------------------------------------------------------ */

const npmSteps = [
  {
    step: "1",
    title: "Install the package",
    code: "npm i @work-rjkashyap/unified-ui",
  },
  {
    step: "2",
    title: "Import the styles",
    code: `import "@work-rjkashyap/unified-ui/styles.css";`,
  },
  {
    step: "3",
    title: "Wrap with the theme provider",
    code: `import { DSThemeProvider } from "@work-rjkashyap/unified-ui/theme";

export default function Layout({ children }) {
  return <DSThemeProvider>{children}</DSThemeProvider>;
}`,
  },
  {
    step: "4",
    title: "Start building",
    code: `import { Button, Dialog, Badge } from "@work-rjkashyap/unified-ui";`,
  },
];

const cliSteps = [
  {
    step: "1",
    title: "Initialize your project",
    code: "npx @work-rjkashyap/unified-ui init",
  },
  {
    step: "2",
    title: "Add components you need",
    code: "npx @work-rjkashyap/unified-ui add button card badge",
  },
  {
    step: "3",
    title: "Import from your project",
    code: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";`,
  },
  {
    step: "4",
    title: "Customize freely — you own the code",
    code: `// Edit src/components/ui/button.tsx directly
// Change variants, sizes, animations — it's yours`,
  },
];

/* ------------------------------------------------------------------ */
/*  Package manager install commands                                   */
/* ------------------------------------------------------------------ */

const packageManagers: Record<string, string> = {
  npm: "npm i @work-rjkashyap/unified-ui",
  pnpm: "pnpm add @work-rjkashyap/unified-ui",
  yarn: "yarn add @work-rjkashyap/unified-ui",
  bun: "bun add @work-rjkashyap/unified-ui",
};

/* ------------------------------------------------------------------ */
/*  Copy button                                                        */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 rounded-md hover:bg-fd-muted transition-colors shrink-0"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-fd-muted-foreground" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Step card                                                          */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
}: {
  step: { step: string; title: string; code: string };
}) {
  return (
    <div className="rounded-lg border border-fd-border bg-fd-background/80 hover:border-fd-muted-foreground/20 transition-colors duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-fd-border/50 bg-fd-muted/20">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
            {step.step}
          </span>
          <span className="text-sm font-semibold text-fd-foreground tracking-tight">
            {step.title}
          </span>
        </div>
        <CopyButton text={step.code} />
      </div>
      {/* Code */}
      <div className="px-3 py-2.5">
        <pre className="text-sm font-mono leading-relaxed text-fd-foreground/80 whitespace-pre-wrap wrap-break-word">
          <code>{step.code}</code>
        </pre>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function CTASection({ version = "0.3.7" }: { version?: string }) {
  return (
    <section className="relative py-14 bg-fd-background overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-px bg-linear-to-r from-transparent via-fd-border to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <div className="text-center mb-8">
          <Badge variant="primary" size="sm" className="mb-3">
            Get Started
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3">
            Two ways to use. One design system.
          </h2>
          <p className="text-base text-fd-muted-foreground leading-7 max-w-lg mx-auto">
            Install the full npm package for zero-config convenience, or
            copy-paste individual components for full ownership.
          </p>
        </div>

        {/* ── Dual-mode tabs ── */}
        <Tabs defaultValue="package" variant="underline" size="sm">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="package" className="gap-1.5">
                <Package className="size-3.5" />
                npm Package
              </TabsTrigger>
              <TabsTrigger value="cli" className="gap-1.5">
                <Blocks className="size-3.5" />
                Copy &amp; Paste
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ─── Tab 1: npm package ─── */}
          <TabsContent value="package">
            <div className="rounded-xl border border-fd-border bg-fd-card/40 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left — messaging */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge
                    variant="info"
                    size="sm"
                    icon={<Package className="w-3 h-3" />}
                    className="mb-4 w-fit"
                  >
                    Full Package
                  </Badge>

                  <h3 className="text-xl font-bold tracking-tight mb-2">
                    Single install, everything included
                  </h3>

                  <p className="text-base text-fd-muted-foreground leading-7 mb-5">
                    75+ components, design tokens, theme provider, motion
                    presets, and utilities — all in one versioned npm package.
                    Tree-shakeable and always in sync.
                  </p>

                  {/* Package manager mini-tabs */}
                  <div className="mb-6">
                    <Tabs defaultValue="npm" variant="pills" size="sm">
                      <TabsList className="mb-2">
                        {Object.keys(packageManagers).map((pm) => (
                          <TabsTrigger key={pm} value={pm}>
                            {pm}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {Object.entries(packageManagers).map(([pm, cmd]) => (
                        <TabsContent key={pm} value={pm}>
                          <div className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background/80 px-3 py-2.5">
                            <Package className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <code className="text-sm font-mono text-fd-foreground flex-1 truncate">
                              {cmd}
                            </code>
                            <CopyButton text={cmd} />
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                    <ButtonLink
                      href="/docs"
                      variant="primary"
                      size="md"
                      iconRight={<ArrowRight className="size-3.5" />}
                      className="rounded-full px-6"
                    >
                      Read the Docs
                    </ButtonLink>
                    <ButtonLink
                      href="https://github.com/imrj05/unified-ui"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="md"
                      iconLeft={<Github className="size-3.5" />}
                      className="rounded-full px-6"
                    >
                      Star on GitHub
                    </ButtonLink>
                  </div>

                  {/* Package badges */}
                  <div className="mt-5 pt-4 border-t border-fd-border/50 flex flex-row flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      size="sm"
                      icon={<Package className="w-3 h-3" />}
                      className="font-mono"
                    >
                      @work-rjkashyap/unified-ui
                    </Badge>
                    <Badge variant="info" size="sm">
                      v{version}
                    </Badge>
                    <Badge variant="success" size="sm" dot>
                      MIT
                    </Badge>
                  </div>
                </div>

                {/* Right — Steps */}
                <div className="border-t lg:border-t-0 lg:border-l border-fd-border bg-fd-muted/15 p-4 md:p-6 flex flex-col gap-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
                    Setup Guide
                  </p>
                  {npmSteps.map((step) => (
                    <StepCard key={step.step} step={step} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ─── Tab 2: Copy & Paste CLI ─── */}
          <TabsContent value="cli">
            <div className="rounded-xl border border-fd-border bg-fd-card/40 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left — messaging */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <Badge
                    variant="warning"
                    size="sm"
                    icon={<Terminal className="w-3 h-3" />}
                    className="mb-4 w-fit"
                  >
                    Copy &amp; Paste
                  </Badge>

                  <h3 className="text-xl font-bold tracking-tight mb-2">
                    Own the source. Customize everything.
                  </h3>

                  <p className="text-base text-fd-muted-foreground leading-7 mb-5">
                    Like shadcn/ui but for Unified UI. Components are copied
                    directly into your project — you own the code. The CLI
                    resolves the full dependency tree automatically.
                  </p>

                  {/* CLI quick commands */}
                  <div className="space-y-2 mb-6">
                    {[
                      {
                        label: "Init",
                        code: "npx @work-rjkashyap/unified-ui init",
                      },
                      {
                        label: "Add",
                        code: "npx @work-rjkashyap/unified-ui add button card",
                      },
                      {
                        label: "List",
                        code: "npx @work-rjkashyap/unified-ui list",
                      },
                    ].map((cmd) => (
                      <div
                        key={cmd.label}
                        className="flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background/80 px-3 py-2"
                      >
                        <Terminal className="w-3 h-3 text-cyan-500 shrink-0" />
                        <code className="text-sm font-mono text-fd-foreground flex-1 truncate">
                          {cmd.code}
                        </code>
                        <CopyButton text={cmd.code} />
                      </div>
                    ))}
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                    <ButtonLink
                      href="/docs"
                      variant="primary"
                      size="md"
                      iconRight={<ArrowRight className="size-3.5" />}
                      className="rounded-full px-6"
                    >
                      Read the Docs
                    </ButtonLink>
                    <ButtonLink
                      href="https://github.com/imrj05/unified-ui"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                      size="md"
                      iconLeft={<Github className="size-3.5" />}
                      className="rounded-full px-6"
                    >
                      Star on GitHub
                    </ButtonLink>
                  </div>

                  {/* Ownership badges */}
                  <div className="mt-5 pt-4 border-t border-fd-border/50 flex flex-row flex-wrap items-center gap-2">
                    <Badge variant="outline" size="sm" className="font-mono">
                      src/components/ui/
                    </Badge>
                    <Badge variant="info" size="sm">
                      auto-resolved deps
                    </Badge>
                    <Badge variant="success" size="sm" dot>
                      you own the code
                    </Badge>
                  </div>
                </div>

                {/* Right — Steps */}
                <div className="border-t lg:border-t-0 lg:border-l border-fd-border bg-fd-muted/15 p-4 md:p-6 flex flex-col gap-2.5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-fd-muted-foreground mb-1">
                    CLI Workflow
                  </p>
                  {cliSteps.map((step) => (
                    <StepCard key={step.step} step={step} />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Comparison strip ── */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 rounded-xl border border-fd-border bg-fd-card/40 p-4 hover:border-fd-muted-foreground/20 transition-colors duration-200">
            <div className="p-1.5 rounded-md bg-fd-background border border-fd-border shrink-0 mt-0.5">
              <Package className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-base font-bold tracking-tight mb-0.5">
                npm Package
              </h4>
              <p className="text-sm text-fd-muted-foreground leading-6">
                Best for teams that want zero-config setup, automatic updates,
                and consistent components across projects.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-fd-border bg-fd-card/40 p-4 hover:border-fd-muted-foreground/20 transition-colors duration-200">
            <div className="p-1.5 rounded-md bg-fd-background border border-fd-border shrink-0 mt-0.5">
              <Blocks className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <div>
              <h4 className="text-base font-bold tracking-tight mb-0.5">
                Copy &amp; Paste
              </h4>
              <p className="text-sm text-fd-muted-foreground leading-6">
                Best for developers who want full control over source, deep
                customization, or the shadcn/ui workflow.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom note ── */}
        <div className="mt-6 text-center">
          <p className="text-sm text-fd-muted-foreground leading-6">
            Both methods use the same components, tokens, and accessibility.{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-fd-foreground hover:text-purple-500 transition-colors underline underline-offset-2 decoration-fd-border hover:decoration-purple-500/50"
            >
              Inspired by shadcn/ui
            </a>{" "}
            · Open source under MIT
          </p>
        </div>
      </div>
    </section>
  );
}
