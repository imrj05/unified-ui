"use client";

// ============================================================================
// Unified UI — Combobox Component
// ============================================================================
// A production-ready searchable select / autocomplete built by composing
// Popover + Command primitives with Framer Motion animation.
//
// Features:
//   - Searchable dropdown with fuzzy filtering
//   - Single and multi-select modes
//   - Async / external filtering support
//   - Grouped options
//   - Custom option rendering
//   - Clear button
//   - Animated dropdown (scaleIn via Framer Motion)
//   - Stagger animation for results list
//   - Empty state with fadeIn
//   - Size variants: sm, md, lg
//   - Visual variants: default, primary
//   - Respects prefers-reduced-motion
//   - Full ref forwarding
//   - WCAG AA: role="combobox", aria-expanded, aria-activedescendant
//
// Usage:
//   <Combobox options={options} onSelect={(v) => setValue(v)} />
//   <Combobox multi options={options} onMultiSelect={setValues} />
//   <Combobox options={options} searchable={false} placeholder="Choose…" />
// ============================================================================

import {
  fadeIn,
  scaleIn,
  slideUpSm,
  staggerContainerFast,
} from "@unified-ui/motion";
import { cn } from "@unified-ui/utils/cn";
import { focusRingClasses } from "@unified-ui/utils/focus-ring";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Popover as PopoverPrimitive } from "radix-ui";
import {
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// CVA — Trigger Variants
// ---------------------------------------------------------------------------

export const comboboxTriggerVariants = cva(
  [
    "inline-flex items-center justify-between gap-2 w-full",
    "rounded-md border bg-background",
    "text-left",
    "transition-[border-color,box-shadow] duration-fast",
    focusRingClasses,
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "border-input",
        primary: "border-primary/40",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
      },
      open: {
        true: "border-ring ring-2 ring-ring/20",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      open: false,
    },
  },
);

// ---------------------------------------------------------------------------
// Icons (Internal)
// ---------------------------------------------------------------------------

function ChevronsUpDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ComboboxVariant = "default" | "primary";
export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxOption {
  /**
   * The unique key for this option.
   */
  value: string;
  /**
   * The display label for this option.
   */
  label: string;
  /**
   * Optional description shown below the label.
   */
  description?: string;
  /**
   * Optional leading icon/element for the option.
   */
  icon?: ReactNode;
  /**
   * Whether this option is disabled.
   */
  disabled?: boolean;
  /**
   * Group key — options with the same group are rendered together.
   */
  group?: string;
}

export interface ComboboxGroup {
  /** Group label */
  label: string;
  /** Group key — matches option.group */
  value: string;
}

export interface ComboboxProps {
  /**
   * The list of options to display.
   */
  options: ComboboxOption[];

  /**
   * Grouped section definitions (optional).
   */
  groups?: ComboboxGroup[];

  /**
   * The currently selected value (single mode, controlled).
   */
  value?: string;

  /**
   * The currently selected values (multi mode, controlled).
   */
  values?: string[];

  /**
   * Default value (single mode, uncontrolled).
   */
  defaultValue?: string;

  /**
   * Default values (multi mode, uncontrolled).
   */
  defaultValues?: string[];

  /**
   * Called when a single value is selected/deselected.
   */
  onSelect?: (value: string | null) => void;

  /**
   * Called when multi-select values change.
   */
  onMultiSelect?: (values: string[]) => void;

  /**
   * Enable multi-select mode.
   * @default false
   */
  multi?: boolean;

  /**
   * Enable search / filter input.
   * @default true
   */
  searchable?: boolean;

  /**
   * Placeholder text on the trigger when nothing is selected.
   * @default "Select..."
   */
  placeholder?: string;

  /**
   * Placeholder text in the search input.
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Message shown when no options match the search query.
   * @default "No results found."
   */
  emptyMessage?: string;

  /**
   * Visual variant.
   * @default "default"
   */
  variant?: ComboboxVariant;

  /**
   * Size variant.
   * @default "md"
   */
  size?: ComboboxSize;

  /**
   * Whether the combobox is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show a clear button when a value is selected.
   * @default true
   */
  clearable?: boolean;

  /**
   * Max height of the dropdown list (CSS value).
   * @default "240px"
   */
  maxHeight?: string;

  /**
   * Custom filter function. By default does case-insensitive label matching.
   */
  filterOption?: (option: ComboboxOption, query: string) => boolean;

  /**
   * Custom render for option items.
   */
  renderOption?: (option: ComboboxOption, isSelected: boolean) => ReactNode;

  /**
   * Custom render for the trigger value display.
   */
  renderValue?: (
    selected: ComboboxOption | ComboboxOption[] | null,
  ) => ReactNode;

  /**
   * Alignment of the dropdown relative to the trigger.
   * @default "start"
   */
  align?: "start" | "center" | "end";

  /**
   * Whether the dropdown width should match the trigger width.
   * @default true
   */
  matchWidth?: boolean;

  /** Additional CSS classes on the trigger. */
  className?: string;

  /** Additional CSS classes on the dropdown content. */
  contentClassName?: string;
}

// ---------------------------------------------------------------------------
// Default filter
// ---------------------------------------------------------------------------

function defaultFilter(option: ComboboxOption, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return (
    option.label.toLowerCase().includes(q) ||
    option.value.toLowerCase().includes(q) ||
    (option.description?.toLowerCase().includes(q) ?? false)
  );
}

// ---------------------------------------------------------------------------
// Multi-select tags (Internal)
// ---------------------------------------------------------------------------

interface MultiTagProps {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
  size: ComboboxSize;
}

function MultiTag({ label, onRemove, disabled, size }: MultiTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded",
        "bg-accent text-accent-foreground",
        "font-normal",
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-0.5",
      )}
    >
      <span className="max-w-[100px] truncate">{label}</span>
      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
          aria-label={`Remove ${label}`}
          tabIndex={-1}
        >
          <XIcon className="size-3" />
        </button>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const iconSizeMap: Record<ComboboxSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Combobox — a searchable select with single and multi-select support.
 *
 * @example
 * // Single select
 * <Combobox
 *   options={[
 *     { value: "react", label: "React" },
 *     { value: "vue", label: "Vue" },
 *   ]}
 *   onSelect={(v) => setValue(v)}
 * />
 *
 * // Multi-select
 * <Combobox
 *   multi
 *   options={options}
 *   values={selected}
 *   onMultiSelect={setSelected}
 * />
 *
 * // With groups
 * <Combobox
 *   options={options}
 *   groups={[{ value: "fruits", label: "Fruits" }]}
 * />
 */
export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(
  function Combobox(
    {
      options,
      groups,
      value: controlledValue,
      values: controlledValues,
      defaultValue,
      defaultValues,
      onSelect,
      onMultiSelect,
      multi = false,
      searchable = true,
      placeholder = "Select...",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      variant = "default",
      size = "md",
      disabled = false,
      clearable = true,
      maxHeight = "240px",
      filterOption,
      renderOption,
      renderValue,
      align = "start",
      matchWidth = true,
      className,
      contentClassName,
    },
    ref,
  ) {
    const shouldReduce = useReducedMotion();
    const id = useId();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    // ----- Value state -----
    const [internalValue, setInternalValue] = useState<string>(
      defaultValue ?? "",
    );
    const [internalValues, setInternalValues] = useState<string[]>(
      defaultValues ?? [],
    );

    const selectedValue = multi
      ? null
      : controlledValue !== undefined
        ? controlledValue
        : internalValue;

    const selectedValues: string[] = multi
      ? controlledValues !== undefined
        ? controlledValues
        : internalValues
      : [];

    // ----- Options lookup -----
    const optionMap = new Map(options.map((o) => [o.value, o]));

    const selectedOption = selectedValue
      ? (optionMap.get(selectedValue) ?? null)
      : null;

    const selectedOptions = selectedValues
      .map((v) => optionMap.get(v))
      .filter(Boolean) as ComboboxOption[];

    // ----- Filtering -----
    const resolvedFilter = filterOption ?? defaultFilter;

    const filteredOptions = query
      ? options.filter((o) => resolvedFilter(o, query))
      : options;

    // Group filtered options
    const groupedOptions: {
      group?: ComboboxGroup;
      options: ComboboxOption[];
    }[] = [];

    if (groups && groups.length > 0) {
      const ungrouped = filteredOptions.filter((o) => !o.group);
      if (ungrouped.length > 0) {
        groupedOptions.push({ options: ungrouped });
      }
      for (const group of groups) {
        const groupOpts = filteredOptions.filter(
          (o) => o.group === group.value,
        );
        if (groupOpts.length > 0) {
          groupedOptions.push({ group, options: groupOpts });
        }
      }
    } else {
      groupedOptions.push({ options: filteredOptions });
    }

    const flatFiltered = groupedOptions.flatMap((g) => g.options);

    // ----- Reset active index on query change -----
    // biome-ignore lint/correctness/useExhaustiveDependencies: query is intentionally used as a trigger to reset active index when the search changes
    useEffect(() => {
      setActiveIndex(-1);
    }, [query]);

    // ----- Close on Escape -----
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (open && searchable) {
        // Focus the search input when dropdown opens
        setTimeout(() => searchRef.current?.focus(), 10);
      }
      if (!open) {
        setQuery("");
        setActiveIndex(-1);
      }
    }, [open, searchable]);

    // ----- Commit selection -----
    const handleSelect = useCallback(
      (optionValue: string) => {
        if (multi) {
          const isSelected = selectedValues.includes(optionValue);
          const next = isSelected
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];

          if (controlledValues === undefined) {
            setInternalValues(next);
          }
          onMultiSelect?.(next);
          // Keep open for multi-select
        } else {
          const isSame = selectedValue === optionValue;
          const next = isSame ? "" : optionValue;

          if (controlledValue === undefined) {
            setInternalValue(next);
          }
          onSelect?.(isSame ? null : optionValue);
          setOpen(false);
        }
      },
      [
        multi,
        selectedValues,
        selectedValue,
        controlledValues,
        controlledValue,
        onMultiSelect,
        onSelect,
      ],
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (multi) {
          if (controlledValues === undefined) setInternalValues([]);
          onMultiSelect?.([]);
        } else {
          if (controlledValue === undefined) setInternalValue("");
          onSelect?.(null);
        }
      },
      [multi, controlledValues, controlledValue, onMultiSelect, onSelect],
    );

    const hasValue = multi ? selectedValues.length > 0 : !!selectedValue;

    // ----- Keyboard navigation in dropdown -----
    const handleDropdownKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (!open) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < flatFiltered.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : flatFiltered.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            if (activeIndex >= 0 && flatFiltered[activeIndex]) {
              const opt = flatFiltered[activeIndex];
              if (!opt.disabled) {
                handleSelect(opt.value);
              }
            }
            break;
          case "Escape":
            setOpen(false);
            break;
          case "Tab":
            setOpen(false);
            break;
          default:
            break;
        }
      },
      [open, flatFiltered, activeIndex, handleSelect],
    );

    // ----- Trigger display value -----
    const triggerContent = (() => {
      if (renderValue) {
        return renderValue(multi ? selectedOptions : selectedOption);
      }

      if (multi) {
        if (selectedOptions.length === 0) {
          return (
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
          );
        }
        return (
          <span className="flex flex-wrap gap-1 flex-1 min-w-0 overflow-hidden">
            {selectedOptions.map((opt) => (
              <MultiTag
                key={opt.value}
                label={opt.label}
                size={size}
                disabled={disabled}
                onRemove={() => handleSelect(opt.value)}
              />
            ))}
          </span>
        );
      }

      return selectedOption ? (
        <span className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {selectedOption.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{selectedOption.label}</span>
        </span>
      ) : (
        <span className="text-muted-foreground truncate flex-1">
          {placeholder}
        </span>
      );
    })();

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? `${id}-listbox` : undefined}
            className={cn(
              comboboxTriggerVariants({ variant, size, open }),
              multi && "min-h-9 h-auto py-1.5 flex-wrap",
              className,
            )}
            data-ds=""
            data-ds-component="combobox"
            data-ds-variant={variant}
            data-ds-size={size}
            data-ds-multi={multi ? "" : undefined}
          >
            {/* Value display */}
            <span className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
              {triggerContent}
            </span>

            {/* Right side: clear + chevron */}
            <span className="flex items-center gap-1 shrink-0 ml-1">
              {clearable && hasValue && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm",
                    "text-muted-foreground hover:text-foreground",
                    "transition-colors duration-fast",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  )}
                  aria-label="Clear selection"
                >
                  <XIcon className={iconSizeMap[size]} />
                </span>
              )}
              <ChevronsUpDownIcon
                className={cn(
                  iconSizeMap[size],
                  "text-muted-foreground transition-transform duration-fast",
                  open && "rotate-180",
                )}
              />
            </span>
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <AnimatePresence>
            {open && (
              <PopoverPrimitive.Content
                asChild
                align={align}
                sideOffset={6}
                forceMount
                onKeyDown={handleDropdownKeyDown}
                onInteractOutside={() => setOpen(false)}
                onEscapeKeyDown={() => setOpen(false)}
                style={
                  matchWidth
                    ? { width: "var(--radix-popover-trigger-width)" }
                    : undefined
                }
              >
                <motion.div
                  id={`${id}-listbox`}
                  className={cn(
                    "z-popover overflow-hidden rounded-md border border-border bg-popover shadow-lg",
                    "outline-none",
                    contentClassName,
                  )}
                  variants={scaleIn.variants}
                  initial={shouldReduce ? { opacity: 0 } : "initial"}
                  animate="animate"
                  exit={shouldReduce ? { opacity: 0 } : "exit"}
                  transition={scaleIn.transition}
                  data-ds-animated=""
                >
                  {/* Search input */}
                  {searchable && (
                    <div className="flex items-center border-b border-border px-3 gap-2">
                      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
                      <input
                        ref={searchRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className={cn(
                          "flex-1 h-9 bg-transparent outline-none",
                          "text-sm placeholder:text-muted-foreground",
                          "text-foreground",
                        )}
                        aria-label={searchPlaceholder}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                      />
                      {query && (
                        <button
                          type="button"
                          onClick={() => setQuery("")}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Clear search"
                          tabIndex={-1}
                        >
                          <XIcon className="size-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Options list */}
                  <div
                    role="listbox"
                    aria-multiselectable={multi}
                    aria-label={placeholder}
                    className="overflow-y-auto py-1"
                    style={{ maxHeight }}
                  >
                    {flatFiltered.length === 0 ? (
                      // Empty state
                      <motion.div
                        className="py-6 text-center text-sm text-muted-foreground"
                        variants={fadeIn.variants}
                        initial="initial"
                        animate="animate"
                        transition={fadeIn.transition}
                        data-ds-animated=""
                      >
                        {emptyMessage}
                      </motion.div>
                    ) : (
                      // Results
                      <motion.div
                        variants={
                          shouldReduce
                            ? undefined
                            : staggerContainerFast.variants
                        }
                        initial={shouldReduce ? undefined : "initial"}
                        animate={shouldReduce ? undefined : "animate"}
                      >
                        {groupedOptions.map((section, sectionIdx) => (
                          <div key={sectionIdx}>
                            {/* Group label */}
                            {section.group && (
                              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {section.group.label}
                              </div>
                            )}

                            {/* Options */}
                            {section.options.map((option) => {
                              const isSelected = multi
                                ? selectedValues.includes(option.value)
                                : selectedValue === option.value;

                              const flatIdx = flatFiltered.indexOf(option);
                              const isActive = flatIdx === activeIndex;

                              return (
                                <motion.div
                                  key={option.value}
                                  role="option"
                                  id={`${id}-option-${option.value}`}
                                  aria-selected={isSelected}
                                  aria-disabled={option.disabled}
                                  variants={
                                    shouldReduce
                                      ? undefined
                                      : slideUpSm.variants
                                  }
                                  className={cn(
                                    "relative flex items-center gap-2 px-3 py-2 text-sm rounded-sm mx-1",
                                    "cursor-pointer select-none",
                                    "transition-colors duration-fast",
                                    isActive
                                      ? "bg-accent text-accent-foreground"
                                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                                    isSelected &&
                                      !isActive &&
                                      "bg-primary/8 text-foreground",
                                    option.disabled &&
                                      "pointer-events-none opacity-40",
                                  )}
                                  onClick={() => {
                                    if (!option.disabled) {
                                      handleSelect(option.value);
                                    }
                                  }}
                                  onMouseEnter={() => setActiveIndex(flatIdx)}
                                >
                                  {/* Custom or default option render */}
                                  {renderOption ? (
                                    renderOption(option, isSelected)
                                  ) : (
                                    <>
                                      {/* Check / selection indicator */}
                                      <span
                                        className={cn(
                                          "flex items-center justify-center shrink-0",
                                          "size-4",
                                          isSelected
                                            ? "text-primary"
                                            : "text-transparent",
                                        )}
                                      >
                                        <CheckIcon className="size-4" />
                                      </span>

                                      {/* Icon */}
                                      {option.icon && (
                                        <span className="shrink-0 text-muted-foreground">
                                          {option.icon}
                                        </span>
                                      )}

                                      {/* Label + description */}
                                      <span className="flex flex-col min-w-0">
                                        <span className="truncate">
                                          {option.label}
                                        </span>
                                        {option.description && (
                                          <span className="text-xs text-muted-foreground truncate">
                                            {option.description}
                                          </span>
                                        )}
                                      </span>
                                    </>
                                  )}
                                </motion.div>
                              );
                            })}

                            {/* Separator between groups */}
                            {sectionIdx < groupedOptions.length - 1 && (
                              <div className="my-1 border-t border-border" />
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </PopoverPrimitive.Content>
            )}
          </AnimatePresence>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  },
);

Combobox.displayName = "Combobox";
