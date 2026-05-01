"use client";

import {
  Badge,
  Button,
  Card,
  CardBody,
  Input,
  Progress,
  Switch,
  Tooltip,
  TooltipProvider,
} from "@work-rjkashyap/unified-ui";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Github,
  Package,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
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

function CopyButton({ text, className }: { text: string; className?: string }) {
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
      className={cn(
        "p-1 rounded-md hover:bg-fd-muted transition-colors",
        className,
      )}
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
/*  Animated typing terminal                                           */
/* ------------------------------------------------------------------ */

const terminalLines = [
  { prompt: true, text: "npm i @work-rjkashyap/unified-ui", delay: 40 },
  { prompt: false, text: "added 1 package in 2.1s", delay: 0 },
  { prompt: false, text: "", delay: 0 },
  {
    prompt: true,
    text: 'import { Button, Dialog } from "@work-rjkashyap/unified-ui"',
    delay: 30,
  },
];

function AnimatedTerminal() {
  const [displayedLines, setDisplayedLines] = useState<
    { text: string; prompt: boolean; typing: boolean }[]
  >([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const _intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      // Reset after a pause
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const line = terminalLines[currentLine];

    if (line.delay === 0 || !line.prompt) {
      // Instant line
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [
          ...prev.map((l) => ({ ...l, typing: false })),
          { text: line.text, prompt: line.prompt, typing: false },
        ]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timeout);
    }

    // Typing effect
    if (currentChar === 0) {
      setDisplayedLines((prev) => [
        ...prev.map((l) => ({ ...l, typing: false })),
        { text: "", prompt: line.prompt, typing: true },
      ]);
    }

    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last) {
            updated[updated.length - 1] = {
              ...last,
              text: line.text.slice(0, currentChar + 1),
            };
          }
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, line.delay);
      return () => clearTimeout(timeout);
    }

    // Line complete
    const timeout = setTimeout(() => {
      setDisplayedLines((prev) => prev.map((l) => ({ ...l, typing: false })));
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar]);

  return (
    <div className="rounded-xl border border-fd-border bg-fd-card overflow-hidden shadow-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-fd-border bg-fd-muted/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-fd-muted-foreground/20" />
        </div>
        <span className="text-xs text-fd-muted-foreground font-medium ml-1">
          Terminal
        </span>
      </div>
      {/* Body */}
      <div className="p-4 font-mono text-sm leading-7 min-h-30">
        {displayedLines.map((line, i) => (
          <div key={`${i}-${line.text}`} className="flex items-start gap-1.5">
            {line.prompt && (
              <ChevronRight className="w-3 h-3 text-green-500 mt-1.5 shrink-0" />
            )}
            <span
              className={cn(
                line.prompt ? "text-fd-foreground" : "text-fd-muted-foreground",
              )}
            >
              {line.text}
              {line.typing && (
                <span className="inline-block w-1.5 h-3.5 bg-fd-foreground/70 ml-0.5 animate-pulse align-middle" />
              )}
            </span>
          </div>
        ))}
        {displayedLines.length === 0 && (
          <div className="flex items-start gap-1.5">
            <ChevronRight className="w-3 h-3 text-green-500 mt-1.5 shrink-0" />
            <span className="inline-block w-1.5 h-3.5 bg-fd-foreground/70 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live component showcase cards                                      */
/* ------------------------------------------------------------------ */

function LiveComponentShowcase() {
  const [darkMode, setDarkMode] = useState(false);
  const [progress] = useState(68);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {/* Card 1 — Buttons */}
      <Card className="bg-fd-card border-fd-border">
        <CardBody className="space-y-3 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fd-muted-foreground">
            Buttons
          </p>
          <div className="flex flex-row flex-wrap gap-1.5">
            <Button size="sm" variant="primary">
              Primary
            </Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
          </div>
          <div className="flex flex-row flex-wrap gap-1.5">
            <Button
              size="sm"
              variant="danger"
              iconLeft={<Sparkles className="size-3" />}
            >
              Danger
            </Button>
            <Button size="sm" variant="primary" loading loadingText="Saving…" />
          </div>
        </CardBody>
      </Card>

      {/* Card 2 — Badges + Switch */}
      <Card className="bg-fd-card border-fd-border">
        <CardBody className="space-y-3 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fd-muted-foreground">
            Badges & Toggle
          </p>
          <div className="flex flex-row flex-wrap gap-1">
            <Badge variant="default" size="sm">
              Default
            </Badge>
            <Badge variant="success" size="sm">
              Success
            </Badge>
            <Badge variant="warning" size="sm">
              Warning
            </Badge>
            <Badge variant="danger" size="sm">
              Danger
            </Badge>
          </div>
          <Switch
            label="Dark mode"
            size="sm"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </CardBody>
      </Card>

      {/* Card 3 — Input + Progress */}
      <Card className="bg-fd-card border-fd-border">
        <CardBody className="space-y-3 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-fd-muted-foreground">
            Input & Progress
          </p>
          <Input
            placeholder="Search…"
            size="sm"
            iconLeft={<Search className="size-3.5" />}
          />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fd-muted-foreground font-medium">
                Upload
              </span>
              <span className="text-xs font-mono text-fd-muted-foreground">
                {progress}%
              </span>
            </div>
            <Progress value={progress} size="sm" variant="primary" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats strip                                                        */
/* ------------------------------------------------------------------ */

const stats = [
  { value: "75+", label: "Components" },
  { value: "6", label: "Layers" },
  { value: "100%", label: "TypeScript" },
  { value: "v4", label: "Tailwind CSS" },
];

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

const installCmd = "npm i @work-rjkashyap/unified-ui";
const cliCmd = "npx @work-rjkashyap/unified-ui add button";

export function HeroSection({ version = "0.3.7" }: { version?: string }) {
  return (
    <TooltipProvider delayDuration={300}>
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-b from-purple-500/7 via-transparent to-transparent rounded-full blur-[80px]" />
          <div className="absolute top-[30%] right-0 w-75 h-75 bg-cyan-500/4 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-fd-border to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          {/* ── Top: headline + install + CTAs ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left column — copy */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Version badge */}
              <div className="animate-fade-in">
                <Badge
                  variant="outline"
                  size="sm"
                  icon={<Sparkles className="text-purple-500" />}
                >
                  v{version} — Inspired by shadcn/ui
                </Badge>
              </div>

              {/* Headline */}
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]">
                  Build faster with{" "}
                  <span className="bg-linear-to-r from-[#659287] via-[#B1C29E] to-[#DEAA79] bg-clip-text text-transparent">
                    Unified UI
                  </span>
                </h1>
                <p className="mt-4 text-base md:text-lg text-fd-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                  A scalable, token-driven React design system.{" "}
                  <span className="text-fd-foreground font-medium">
                    75+ components
                  </span>{" "}
                  built on Tailwind CSS v4, Radix UI &amp; Framer Motion.
                  Install the npm package or copy-paste with the CLI.
                </p>
              </div>

              {/* Install commands */}
              <div className="space-y-2.5 animate-fade-in-up animation-delay-200">
                <Tooltip content="Full package — one install, everything included">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-fd-card border border-fd-border font-mono text-sm w-full max-w-md">
                    <Package className="w-4 h-4 text-purple-500 shrink-0" />
                    <code className="text-fd-foreground flex-1 truncate">
                      {installCmd}
                    </code>
                    <CopyButton text={installCmd} />
                  </div>
                </Tooltip>

                <Tooltip content="Copy individual components into your project">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-fd-card border border-fd-border font-mono text-sm w-full max-w-md">
                    <Terminal className="w-4 h-4 text-cyan-500 shrink-0" />
                    <code className="text-fd-foreground flex-1 truncate">
                      {cliCmd}
                    </code>
                    <CopyButton text={cliCmd} />
                  </div>
                </Tooltip>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-row gap-3 justify-center lg:justify-start animate-fade-in-up animation-delay-400">
                <ButtonLink
                  href="/docs"
                  variant="primary"
                  size="md"
                  iconRight={<ArrowRight className="size-3.5" />}
                  className="rounded-full px-6"
                >
                  Get Started
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
                  GitHub
                </ButtonLink>
              </div>
            </div>

            {/* Right column — animated terminal */}
            <div className="animate-fade-in-up animation-delay-400 lg:pl-4">
              <AnimatedTerminal />
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="mt-12 pt-6 border-t border-fd-border/50 animate-fade-in-up animation-delay-600">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold tracking-tighter text-fd-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-fd-muted-foreground uppercase tracking-widest font-semibold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Live component preview ── */}
          <div className="mt-10 animate-fade-in-up animation-delay-600">
            <p className="text-xs font-bold text-fd-muted-foreground uppercase tracking-[0.2em] mb-4 text-center">
              Live components — try them
            </p>
            <LiveComponentShowcase />
          </div>

          {/* ── Tech stack ── */}
          <div className="mt-8 animate-fade-in-up animation-delay-600">
            <div className="flex flex-wrap justify-center items-center gap-6">
              {[
                "Radix UI",
                "Tailwind CSS v4",
                "Framer Motion",
                "CVA",
                "TypeScript",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-sm font-medium text-fd-muted-foreground/50 hover:text-fd-foreground transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}
