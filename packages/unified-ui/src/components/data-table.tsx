"use client";

// ============================================================================
// Unified UI — DataTable Component (powered by TanStack Table)
// ============================================================================
// A high-level, feature-rich data table built on @tanstack/react-table that
// renders using the existing Unified UI Table primitives for consistent
// styling.
//
// Features:
//   - Column definitions via TanStack Table's ColumnDef API
//   - Client-side sorting with sort indicators
//   - Client-side filtering (global search + per-column filters)
//   - Client-side pagination with integrated Pagination component
//   - Row selection (single / multi) with checkbox column
//   - Column visibility toggling
//   - Column pinning (left/right)
//   - Empty state / loading state / custom caption
//   - Full design-system styling via existing Table sub-components
//   - Forwarded ref on root wrapper
//   - All visual values from CSS custom properties — no hardcoded values
//
// Usage:
//   import { DataTable } from "@work-rjkashyap/unified-ui/components";
//   import { type ColumnDef } from "@tanstack/react-table";
//
//   const columns: ColumnDef<Person>[] = [
//     { accessorKey: "name", header: "Name" },
//     { accessorKey: "email", header: "Email" },
//     { accessorKey: "age", header: "Age", enableSorting: true },
//   ];
//
//   <DataTable columns={columns} data={people} sorting pagination />
// ============================================================================

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanStackTable,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { cn } from "@unified-ui/utils/cn";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Table,
  type TableAlign,
  TableBody,
  TableCaption,
  TableCell,
  type TableDensity,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
} from "./table";

// ---------------------------------------------------------------------------
// Re-export TanStack Table types consumers will need
// ---------------------------------------------------------------------------

export type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export { createColumnHelper } from "@tanstack/react-table";

// ---------------------------------------------------------------------------
// Extended column meta for Unified UI integration
// ---------------------------------------------------------------------------

/**
 * Extend TanStack Table's ColumnMeta with Unified UI specific properties.
 * Consumers can use these in their ColumnDef `meta` field.
 */
export interface DataTableColumnMeta {
  /** Text alignment for the column header and cells. */
  align?: TableAlign;
  /** Whether this column should have a sticky header. */
  sticky?: boolean;
  /** Custom CSS class for header cells. */
  headerClassName?: string;
  /** Custom CSS class for body cells. */
  cellClassName?: string;
  /** Whether to show a filter input for this column. */
  filterable?: boolean;
  /** Placeholder text for the column filter input. */
  filterPlaceholder?: string;
  /**
   * Enable a dropdown header menu (Asc / Desc / Hide) on this column.
   * When `true`, clicking the column header opens a dropdown instead of
   * directly toggling the sort direction.
   * @default false
   */
  enableHeaderMenu?: boolean;
}

/**
 * Configuration for a faceted filter button shown in the toolbar.
 * Each entry creates a pill-style button that opens a popover with
 * checkbox options derived from the column's unique values.
 */
export interface DataTableFacetedFilter {
  /** The column ID to filter on (must match a `ColumnDef` accessorKey or id). */
  columnId: string;
  /** Display label for the filter button. */
  title: string;
  /**
   * Optional icon rendered before the title.
   * Pass a React element (e.g. a Lucide icon).
   */
  icon?: ReactNode;
  /**
   * Explicit list of filter options. If omitted the component will
   * derive options from the column's unique faceted values.
   */
  options?: { label: string; value: string; icon?: ReactNode }[];
}

// ---------------------------------------------------------------------------
// DataTable Props
// ---------------------------------------------------------------------------

export interface DataTableProps<TData> {
  // -- Data & Columns -------------------------------------------------------

  /** The data array to render. Each item becomes a row. */
  data: TData[];

  /**
   * TanStack Table column definitions.
   * @see https://tanstack.com/table/latest/docs/guide/column-defs
   */
  columns: ColumnDef<TData, any>[];

  // -- Faceted Filters ------------------------------------------------------

  /**
   * Faceted filter buttons rendered in the toolbar.
   * Each entry creates a pill-style button that opens a checkbox popover
   * filtered by that column's unique values.
   */
  facetedFilters?: DataTableFacetedFilter[];

  // -- Sorting --------------------------------------------------------------

  /**
   * Enable client-side sorting.
   * @default false
   */
  sorting?: boolean;

  /**
   * Controlled sorting state. When provided, sorting becomes controlled.
   * Use with `onSortingChange`.
   */
  sortingState?: SortingState;

  /** Callback for controlled sorting state changes. */
  onSortingChange?: OnChangeFn<SortingState>;

  /**
   * Enable multi-column sorting (hold Shift to sort by multiple columns).
   * @default false
   */
  multiSort?: boolean;

  // -- Filtering ------------------------------------------------------------

  /**
   * Enable client-side filtering (global + per-column).
   * @default false
   */
  filtering?: boolean;

  /**
   * Controlled global filter value.
   */
  globalFilter?: string;

  /** Callback for controlled global filter changes. */
  onGlobalFilterChange?: OnChangeFn<string>;

  /**
   * Controlled column filters state.
   */
  columnFilters?: ColumnFiltersState;

  /** Callback for controlled column filter changes. */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;

  /**
   * Show a global search input above the table.
   * Requires `filtering` to be enabled.
   * @default false
   */
  showGlobalFilter?: boolean;

  /** Placeholder for the global search input. */
  globalFilterPlaceholder?: string;

  // -- Pagination -----------------------------------------------------------

  /**
   * Enable client-side pagination.
   * @default false
   */
  pagination?: boolean;

  /**
   * Number of rows per page.
   * @default 10
   */
  pageSize?: number;

  /**
   * Controlled pagination state.
   */
  paginationState?: PaginationState;

  /** Callback for controlled pagination changes. */
  onPaginationChange?: OnChangeFn<PaginationState>;

  /**
   * Available page size options for the page-size selector.
   * Set to `false` to hide the selector.
   * @default [10, 20, 30, 50, 100]
   */
  pageSizeOptions?: number[] | false;

  // -- Row Selection --------------------------------------------------------

  /**
   * Enable row selection.
   * - `"single"` — only one row at a time
   * - `"multi"` — multiple rows via checkboxes
   * - `false` — disabled
   * @default false
   */
  rowSelection?: "single" | "multi" | false;

  /**
   * Controlled row selection state.
   * Keys are row IDs (by default the row index).
   */
  rowSelectionState?: RowSelectionState;

  /** Callback for controlled row selection changes. */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;

  /**
   * Callback when selected rows change. Receives the full Row objects.
   * Convenience wrapper around `onRowSelectionChange`.
   */
  onSelectedRowsChange?: (rows: Row<TData>[]) => void;

  /**
   * Function to determine if a row can be selected.
   */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);

  /**
   * Custom row ID accessor. By default, the row index is used.
   */
  getRowId?: (originalRow: TData, index: number) => string;

  // -- Column Visibility ----------------------------------------------------

  /**
   * Enable column visibility toggling.
   * @default false
   */
  columnVisibility?: boolean;

  /**
   * Controlled column visibility state.
   */
  columnVisibilityState?: VisibilityState;

  /** Callback for controlled column visibility changes. */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  // -- Column Pinning -------------------------------------------------------

  /**
   * Controlled column pinning state.
   */
  columnPinning?: ColumnPinningState;

  /** Callback for controlled column pinning changes. */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;

  // -- Table Appearance -----------------------------------------------------

  /**
   * Row height density.
   * @default "comfortable"
   */
  density?: TableDensity;

  /**
   * Alternate row background color for readability.
   * @default false
   */
  striped?: boolean;

  /**
   * Highlight rows on hover.
   * @default true
   */
  hoverable?: boolean;

  /**
   * Add borders between cells.
   * @default false
   */
  bordered?: boolean;

  /**
   * Wrap the table in a horizontally-scrollable container.
   * @default true
   */
  responsive?: boolean;

  // -- States ---------------------------------------------------------------

  /**
   * Show a loading skeleton overlay.
   * @default false
   */
  loading?: boolean;

  /**
   * Custom content to show when data is empty.
   */
  emptyState?: ReactNode;

  /**
   * Table caption (accessibility).
   */
  caption?: ReactNode;

  /**
   * Render a footer row. If true, column footers from ColumnDef are rendered.
   * @default false
   */
  showFooter?: boolean;

  // -- Slots & Customization ------------------------------------------------

  /**
   * Content rendered above the table (e.g., filters, actions toolbar).
   * Receives the table instance for advanced usage.
   */
  toolbar?: ReactNode | ((table: TanStackTable<TData>) => ReactNode);

  /**
   * Content rendered below the table (e.g., custom pagination, summary).
   * Receives the table instance for advanced usage.
   */
  footer?: ReactNode | ((table: TanStackTable<TData>) => ReactNode);

  /** Additional CSS classes for the outermost wrapper. */
  className?: string;

  /** Additional CSS classes for the table element. */
  tableClassName?: string;

  /** Additional CSS classes for the responsive wrapper. */
  wrapperClassName?: string;

  /**
   * Callback when a row is clicked.
   */
  onRowClick?: (row: Row<TData>, event: React.MouseEvent) => void;

  /**
   * Expose the table instance to the parent via ref callback.
   */
  onTableInstance?: (table: TanStackTable<TData>) => void;
}

// ---------------------------------------------------------------------------
// Internal: Dropdown wrapper (click-outside aware)
// ---------------------------------------------------------------------------

function Dropdown({
  trigger,
  children,
  align = "start",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute top-full z-[var(--z-dropdown)] mt-1",
            align === "end" ? "right-0" : "left-0",
            "min-w-[8rem] rounded-md py-1",
            "border border-border bg-popover text-popover-foreground",
            "shadow-md",
          )}
          role="menu"
          data-ds=""
          data-ds-component="data-table-dropdown"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-2 py-1.5 text-sm",
        "cursor-pointer rounded-sm",
        active
          ? "bg-muted text-foreground"
          : "text-foreground hover:bg-muted/50",
        "transition-colors duration-fast",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Internal: Column header dropdown menu (Asc / Desc / Hide)
// ---------------------------------------------------------------------------

function DataTableColumnHeaderMenu<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const isSorted = column.getIsSorted();

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 -ml-1 px-1 py-0.5",
            "cursor-pointer select-none rounded-sm",
            "hover:bg-muted/50",
            "transition-colors duration-fast",
            "text-muted-foreground font-semibold whitespace-nowrap",
          )}
        >
          {title}
          {isSorted === "asc" ? (
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          ) : isSorted === "desc" ? (
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          ) : (
            <svg
              className="size-3.5 opacity-40"
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
          )}
        </button>
      }
    >
      <div className="px-1">
        <DropdownItem
          onClick={() => column.toggleSorting(false)}
          active={isSorted === "asc"}
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
          Asc
        </DropdownItem>
        <DropdownItem
          onClick={() => column.toggleSorting(true)}
          active={isSorted === "desc"}
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          Desc
        </DropdownItem>
        {column.getCanHide() && (
          <>
            <div className="my-1 h-px bg-border" />
            <DropdownItem onClick={() => column.toggleVisibility(false)}>
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.749 10.749 0 0 1 4.446-5.143" />
                <path d="m2 2 20 20" />
              </svg>
              Hide
            </DropdownItem>
          </>
        )}
      </div>
    </Dropdown>
  );
}

// ---------------------------------------------------------------------------
// Internal: Faceted filter button (pill + popover with checkboxes)
// ---------------------------------------------------------------------------

function DataTableFacetedFilterButton<TData>({
  column,
  title,
  icon,
  options: explicitOptions,
}: {
  column: Column<TData, unknown> | undefined;
  title: string;
  icon?: ReactNode;
  options?: { label: string; value: string; icon?: ReactNode }[];
}) {
  if (!column) return null;

  const facets = column.getFacetedUniqueValues();
  const selectedValues = new Set((column.getFilterValue() as string[]) ?? []);

  const options: { label: string; value: string; icon?: ReactNode }[] =
    explicitOptions ??
    Array.from(facets.keys())
      .sort()
      .map((value) => ({ label: String(value), value: String(value) }));

  const toggleValue = (value: string) => {
    const next = new Set(selectedValues);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    const filterValue = next.size > 0 ? Array.from(next) : undefined;
    column.setFilterValue(filterValue);
  };

  const clearFilter = () => {
    column.setFilterValue(undefined);
  };

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 h-8",
            "text-xs font-medium text-foreground",
            "border border-dashed border-border bg-background",
            "hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:border-border-strong",
            "transition-colors duration-fast",
          )}
          data-ds=""
          data-ds-component="data-table-faceted-filter"
        >
          {icon && <span className="size-3.5">{icon}</span>}
          {title}
          {selectedValues.size > 0 && (
            <>
              <span className="mx-0.5 h-4 w-px bg-border" />
              <span className="inline-flex items-center justify-center rounded-sm bg-muted px-1.5 text-[10px] font-semibold">
                {selectedValues.size}
              </span>
            </>
          )}
        </button>
      }
    >
      <div className="px-1 max-h-64 overflow-y-auto">
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value);
          const count = facets.get(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5",
                "text-sm text-foreground",
                "hover:bg-muted/50",
                "transition-colors duration-fast",
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleValue(option.value)}
                className="size-3.5 rounded-sm accent-primary"
              />
              {option.icon && (
                <span className="size-3.5 shrink-0">{option.icon}</span>
              )}
              <span className="flex-1 truncate">{option.label}</span>
              {count !== undefined && (
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {count}
                </span>
              )}
            </label>
          );
        })}
        {selectedValues.size > 0 && (
          <>
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              onClick={clearFilter}
              className={cn(
                "w-full rounded-sm px-2 py-1.5 text-center text-sm",
                "text-foreground hover:bg-muted/50",
                "transition-colors duration-fast",
              )}
            >
              Clear filter
            </button>
          </>
        )}
      </div>
    </Dropdown>
  );
}

// ---------------------------------------------------------------------------
// Internal: Sort badge (shows count of sorted columns)
// ---------------------------------------------------------------------------

function DataTableSortBadge<TData>({ table }: { table: TanStackTable<TData> }) {
  const sorting = table.getState().sorting;
  if (sorting.length === 0) return null;

  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 h-8",
            "text-xs font-medium text-foreground",
            "border border-border bg-background",
            "hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:border-border-strong",
            "transition-colors duration-fast",
          )}
          data-ds=""
          data-ds-component="data-table-sort-badge"
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
          </svg>
          Sort
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold">
            {sorting.length}
          </span>
        </button>
      }
    >
      <div className="px-1">
        {sorting.map((sort) => {
          const col = table.getColumn(sort.id);
          const label =
            col && typeof col.columnDef.header === "string"
              ? col.columnDef.header
              : sort.id;
          return (
            <DropdownItem key={sort.id} onClick={() => col?.clearSorting()}>
              {sort.desc ? (
                <svg
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              ) : (
                <svg
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              )}
              <span className="flex-1">{label}</span>
              <span className="text-xs text-muted-foreground">
                {sort.desc ? "desc" : "asc"}
              </span>
            </DropdownItem>
          );
        })}
        {sorting.length > 0 && (
          <>
            <div className="my-1 h-px bg-border" />
            <DropdownItem onClick={() => table.resetSorting()}>
              Clear all sorts
            </DropdownItem>
          </>
        )}
      </div>
    </Dropdown>
  );
}

// ---------------------------------------------------------------------------
// Internal: View button (column visibility dropdown — replaces old toggle)
// ---------------------------------------------------------------------------

function DataTableViewButton<TData>({
  table,
}: {
  table: TanStackTable<TData>;
}) {
  return (
    <Dropdown
      align="end"
      trigger={
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 h-8",
            "text-xs font-medium text-foreground",
            "border border-border bg-background",
            "hover:bg-muted/50",
            "focus-visible:outline-none focus-visible:border-border-strong",
            "transition-colors duration-fast",
          )}
          data-ds=""
          data-ds-component="data-table-view-button"
        >
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="21" x2="14" y1="4" y2="4" />
            <line x1="10" x2="3" y1="4" y2="4" />
            <line x1="21" x2="12" y1="12" y2="12" />
            <line x1="8" x2="3" y1="12" y2="12" />
            <line x1="21" x2="16" y1="20" y2="20" />
            <line x1="12" x2="3" y1="20" y2="20" />
          </svg>
          View
        </button>
      }
    >
      <div className="px-1">
        {table.getAllLeafColumns().map((column) => {
          if (column.id === "select" || !column.getCanHide()) return null;

          return (
            <label
              key={column.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5",
                "text-sm text-foreground",
                "hover:bg-muted/50",
                "transition-colors duration-fast",
              )}
            >
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className="size-3.5 rounded-sm accent-primary"
              />
              {typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id}
            </label>
          );
        })}
      </div>
    </Dropdown>
  );
}

// ---------------------------------------------------------------------------
// Internal: Checkbox component (minimal, avoids importing external dep)
// ---------------------------------------------------------------------------

function DataTableCheckbox({
  checked,
  indeterminate,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const ref = useCallback(
    (el: HTMLInputElement | null) => {
      if (el) {
        el.indeterminate = indeterminate ?? false;
      }
    },
    [indeterminate],
  );

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "size-4 cursor-pointer rounded-sm",
        "border border-border",
        "accent-primary",
        "focus-visible:outline-none focus-visible:border-border-strong",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    />
  );
}

// ---------------------------------------------------------------------------
// Internal: Global filter input
// ---------------------------------------------------------------------------

function DataTableGlobalFilter({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search..."}
      className={cn(
        "h-9 w-full max-w-xs rounded-md px-3 text-sm",
        "border border-border bg-background text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-border-strong",
        "transition-colors duration-fast",
      )}
      data-ds=""
      data-ds-component="data-table-search"
    />
  );
}

// ---------------------------------------------------------------------------
// Internal: Column filter input
// ---------------------------------------------------------------------------

function DataTableColumnFilter({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Filter..."}
      className={cn(
        "mt-1 h-7 w-full rounded-sm px-2 text-xs",
        "border border-border-muted bg-background text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:border-border-strong",
        "transition-colors duration-fast",
      )}
      data-ds=""
      data-ds-component="data-table-column-filter"
    />
  );
}

// ---------------------------------------------------------------------------
// Internal: Column visibility toggle dropdown
// ---------------------------------------------------------------------------

function _DataTableColumnVisibility<TData>({
  table,
}: {
  table: TanStackTable<TData>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5",
          "text-sm font-medium text-foreground",
          "border border-border bg-background",
          "hover:bg-muted/50",
          "focus-visible:outline-none focus-visible:border-border-strong",
          "transition-colors duration-fast",
        )}
        data-ds=""
        data-ds-component="data-table-column-toggle"
      >
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v18" />
          <rect width="6" height="18" x="3" y="3" rx="2" />
          <rect width="6" height="18" x="15" y="3" rx="2" />
        </svg>
        Columns
      </button>

      {open && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-[var(--z-dropdown)]"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            aria-hidden="true"
          />
          <div
            className={cn(
              "absolute right-0 top-full z-[var(--z-dropdown)] mt-1",
              "min-w-[10rem] rounded-md p-1",
              "border border-border bg-popover text-popover-foreground",
              "shadow-md",
              "animate-in fade-in-0 zoom-in-95",
            )}
            role="menu"
            data-ds=""
            data-ds-component="data-table-column-menu"
          >
            {table.getAllLeafColumns().map((column) => {
              if (column.id === "select") return null;

              return (
                <label
                  key={column.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5",
                    "text-sm text-foreground",
                    "hover:bg-muted/50",
                    "transition-colors duration-fast",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className={cn("size-3.5 rounded-sm", "accent-primary")}
                  />
                  {typeof column.columnDef.header === "string"
                    ? column.columnDef.header
                    : column.id}
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal: Pagination bar
// ---------------------------------------------------------------------------

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: {
  table: TanStackTable<TData>;
  pageSizeOptions?: number[] | false;
}) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-2 py-3",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
      data-ds=""
      data-ds-component="data-table-pagination"
    >
      {/* Left: selection info */}
      <div className="text-xs text-muted-foreground">
        {selectedCount} of {totalRows} row(s) selected.
      </div>

      {/* Right: rows per page + page info + nav */}
      <div className="flex items-center gap-6">
        {/* Rows per page */}
        {pageSizeOptions !== false && (
          <div className="flex items-center gap-2 text-xs text-foreground">
            <span className="whitespace-nowrap">Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={cn(
                "h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground",
                "focus-visible:outline-none focus-visible:border-border-strong",
                "appearance-none cursor-pointer pr-6",
                "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23888%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
                "bg-[position:right_0.4rem_center] bg-no-repeat",
              )}
            >
              {(pageSizeOptions || [10, 20, 30, 50, 100]).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page info */}
        <span className="text-xs text-foreground whitespace-nowrap">
          Page {pageIndex + 1} of {pageCount || 1}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <PaginationButton
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m11 17-5-5 5-5" />
              <path d="m18 17-5-5 5-5" />
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </PaginationButton>

          <PaginationButton
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m13 17 5-5-5-5" />
              <path d="m6 17 5-5-5-5" />
            </svg>
          </PaginationButton>
        </div>
      </div>
    </div>
  );
}

function PaginationButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md",
        "border border-border bg-background text-foreground",
        "hover:bg-muted/50",
        "focus-visible:outline-none focus-visible:border-border-strong",
        "disabled:pointer-events-none disabled:opacity-50",
        "transition-colors duration-fast",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Internal: Loading skeleton rows
// ---------------------------------------------------------------------------

function DataTableSkeleton({
  columnCount,
  rowCount = 5,
  density,
}: {
  columnCount: number;
  rowCount?: number;
  density: TableDensity;
}) {
  const heightClass = density === "compact" ? "h-3" : "h-4";

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="animate-pulse">
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div
                className={cn(
                  heightClass,
                  "rounded-sm bg-muted",
                  colIndex === 0
                    ? "w-3/4"
                    : colIndex === columnCount - 1
                      ? "w-1/3"
                      : "w-2/3",
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ===========================================================================
// DataTable Component
// ===========================================================================

/**
 * DataTable — a feature-rich data table powered by TanStack Table,
 * rendered with Unified UI's styled Table primitives.
 *
 * Supports sorting, filtering, pagination, row selection, column visibility,
 * loading/empty states, and custom toolbar/footer slots.
 *
 * @example
 * ```tsx
 * import { DataTable, type ColumnDef } from "@work-rjkashyap/unified-ui";
 *
 * type Person = { name: string; email: string; age: number };
 *
 * const columns: ColumnDef<Person>[] = [
 *   { accessorKey: "name", header: "Name" },
 *   { accessorKey: "email", header: "Email" },
 *   { accessorKey: "age", header: "Age" },
 * ];
 *
 * <DataTable
 *   data={people}
 *   columns={columns}
 *   sorting
 *   pagination
 *   pageSize={20}
 *   striped
 *   hoverable
 * />
 * ```
 */
export const DataTable = forwardRef<HTMLDivElement, DataTableProps<any>>(
  function DataTable(
    {
      // Data
      data,
      columns: userColumns,

      // Faceted filters
      facetedFilters,

      // Sorting
      sorting: enableSorting = false,
      sortingState: controlledSorting,
      onSortingChange: onControlledSortingChange,
      multiSort = false,

      // Filtering
      filtering: enableFiltering = false,
      globalFilter: controlledGlobalFilter,
      onGlobalFilterChange: onControlledGlobalFilterChange,
      columnFilters: controlledColumnFilters,
      onColumnFiltersChange: onControlledColumnFiltersChange,
      showGlobalFilter = false,
      globalFilterPlaceholder,

      // Pagination
      pagination: enablePagination = false,
      pageSize = 10,
      paginationState: controlledPagination,
      onPaginationChange: onControlledPaginationChange,
      pageSizeOptions,

      // Row selection
      rowSelection: rowSelectionMode = false,
      rowSelectionState: controlledRowSelection,
      onRowSelectionChange: onControlledRowSelectionChange,
      onSelectedRowsChange,
      enableRowSelection = true,
      getRowId,

      // Column visibility
      columnVisibility: enableColumnVisibility = false,
      columnVisibilityState: controlledColumnVisibility,
      onColumnVisibilityChange: onControlledColumnVisibilityChange,

      // Column pinning
      columnPinning: controlledColumnPinning,
      onColumnPinningChange: onControlledColumnPinningChange,

      // Faceted filtering requires filtering to be enabled
      // (handled below in table config)

      // Appearance
      density = "comfortable",
      striped = false,
      hoverable = true,
      bordered = false,
      responsive = true,

      // States
      loading = false,
      emptyState,
      caption,
      showFooter = false,

      // Slots
      toolbar,
      footer,

      // Classes
      className,
      tableClassName,
      wrapperClassName,

      // Events
      onRowClick,
      onTableInstance,
    },
    ref,
  ) {
    // -- Internal state (uncontrolled mode) ---------------------------------

    const [internalSorting, setInternalSorting] = useState<SortingState>([]);
    const [internalGlobalFilter, setInternalGlobalFilter] =
      useState<string>("");
    const [internalColumnFilters, setInternalColumnFilters] =
      useState<ColumnFiltersState>([]);
    const [internalPagination, setInternalPagination] =
      useState<PaginationState>({
        pageIndex: 0,
        pageSize,
      });
    const [internalRowSelection, setInternalRowSelection] =
      useState<RowSelectionState>({});
    const [internalColumnVisibility, setInternalColumnVisibility] =
      useState<VisibilityState>({});
    const [internalColumnPinning, setInternalColumnPinning] =
      useState<ColumnPinningState>({});

    // -- Resolve controlled vs uncontrolled ---------------------------------

    const sortingValue = controlledSorting ?? internalSorting;
    const onSortingChange = onControlledSortingChange ?? setInternalSorting;

    const globalFilterValue = controlledGlobalFilter ?? internalGlobalFilter;
    const onGlobalFilterChange =
      onControlledGlobalFilterChange ?? setInternalGlobalFilter;

    const columnFiltersValue = controlledColumnFilters ?? internalColumnFilters;
    const onColumnFiltersChange =
      onControlledColumnFiltersChange ?? setInternalColumnFilters;

    const paginationValue = controlledPagination ?? internalPagination;
    const onPaginationChange =
      onControlledPaginationChange ?? setInternalPagination;

    const rowSelectionValue = controlledRowSelection ?? internalRowSelection;
    const onRowSelectionChange =
      onControlledRowSelectionChange ?? setInternalRowSelection;

    const columnVisibilityValue =
      controlledColumnVisibility ?? internalColumnVisibility;
    const onColumnVisibilityChange =
      onControlledColumnVisibilityChange ?? setInternalColumnVisibility;

    const columnPinningValue = controlledColumnPinning ?? internalColumnPinning;
    const onColumnPinningChange =
      onControlledColumnPinningChange ?? setInternalColumnPinning;

    // -- Build selection column if needed ------------------------------------

    const columns = useMemo(() => {
      if (!rowSelectionMode) return userColumns;

      const selectionColumn: ColumnDef<any, any> = {
        id: "select",
        header:
          rowSelectionMode === "multi"
            ? ({ table: t }) => (
                <DataTableCheckbox
                  checked={t.getIsAllPageRowsSelected()}
                  indeterminate={t.getIsSomePageRowsSelected()}
                  onChange={t.getToggleAllPageRowsSelectedHandler()}
                  aria-label="Select all rows"
                />
              )
            : undefined,
        cell: ({ row }) => (
          <DataTableCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label={`Select row ${row.index + 1}`}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      };

      return [selectionColumn, ...userColumns];
    }, [userColumns, rowSelectionMode]);

    // -- Derived flags --------------------------------------------------------

    const hasFacetedFilters = !!(facetedFilters && facetedFilters.length > 0);

    // -- Initialize TanStack Table ------------------------------------------

    const table = useReactTable<any>({
      data,
      columns,
      getRowId,
      state: {
        sorting: sortingValue,
        globalFilter: globalFilterValue,
        columnFilters: columnFiltersValue,
        pagination: paginationValue,
        rowSelection: rowSelectionValue,
        columnVisibility: columnVisibilityValue,
        columnPinning: columnPinningValue,
      },

      // Sorting
      onSortingChange,
      enableSorting,
      enableMultiSort: multiSort,
      getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,

      // Filtering
      onGlobalFilterChange,
      onColumnFiltersChange,
      enableFilters: enableFiltering || hasFacetedFilters,
      getFilteredRowModel:
        enableFiltering || hasFacetedFilters
          ? getFilteredRowModel()
          : undefined,

      // Faceted models (for unique value counts in filter popovers)
      ...(hasFacetedFilters
        ? {
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues(),
          }
        : {}),

      // Pagination
      onPaginationChange,
      getPaginationRowModel: enablePagination
        ? getPaginationRowModel()
        : undefined,

      // Row selection
      onRowSelectionChange: (updater) => {
        onRowSelectionChange(updater);
        // Fire convenience callback
        if (onSelectedRowsChange) {
          const next =
            typeof updater === "function"
              ? updater(rowSelectionValue)
              : updater;
          // We schedule this to fire after state is applied
          setTimeout(() => {
            const selectedRows = table
              .getRowModel()
              .rows.filter((row) => next[row.id]);
            onSelectedRowsChange(selectedRows);
          }, 0);
        }
      },
      enableRowSelection:
        rowSelectionMode === false ? false : enableRowSelection,
      enableMultiRowSelection: rowSelectionMode === "multi",

      // Column visibility
      onColumnVisibilityChange,

      // Column pinning
      onColumnPinningChange,

      // Core
      getCoreRowModel: getCoreRowModel(),
    });

    // Expose table instance
    if (onTableInstance) {
      onTableInstance(table);
    }

    // -- Helpers --------------------------------------------------------------

    const headerGroups = table.getHeaderGroups();
    const rows = table.getRowModel().rows;
    const footerGroups = table.getFooterGroups();
    const visibleColumnCount = table.getVisibleLeafColumns().length;

    const hasToolbar =
      showGlobalFilter ||
      enableColumnVisibility ||
      toolbar ||
      hasFacetedFilters ||
      (enableSorting && sortingValue.length > 0);

    // Map TanStack sort direction to our TableSortDirection
    const toSortDir = (
      dir: false | "asc" | "desc",
    ): TableSortDirection | undefined => {
      if (dir === "asc") return "asc";
      if (dir === "desc") return "desc";
      return undefined;
    };

    // -- Render ---------------------------------------------------------------

    return (
      <div
        ref={ref}
        className={cn("not-prose", "flex flex-col gap-3", className)}
        data-ds=""
        data-ds-component="data-table"
      >
        {/* Toolbar */}
        {hasToolbar && (
          <div
            className="flex flex-wrap items-center gap-2"
            data-ds=""
            data-ds-component="data-table-toolbar"
          >
            {showGlobalFilter && (enableFiltering || hasFacetedFilters) && (
              <DataTableGlobalFilter
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder={globalFilterPlaceholder}
              />
            )}

            {/* Faceted filter buttons */}
            {hasFacetedFilters &&
              facetedFilters.map((filter) => (
                <DataTableFacetedFilterButton
                  key={filter.columnId}
                  column={table.getColumn(filter.columnId)}
                  title={filter.title}
                  icon={filter.icon}
                  options={filter.options}
                />
              ))}

            {/* Push remaining toolbar items to the right */}
            <div className="flex-1" />

            {typeof toolbar === "function" ? toolbar(table) : toolbar}

            {/* Sort badge */}
            {enableSorting && sortingValue.length > 0 && (
              <DataTableSortBadge table={table} />
            )}

            {/* View button (column visibility) */}
            {enableColumnVisibility && <DataTableViewButton table={table} />}
          </div>
        )}

        {/* Table */}
        <Table
          density={density}
          striped={striped}
          hoverable={hoverable}
          bordered={bordered}
          responsive={responsive}
          wrapperClassName={wrapperClassName}
          className={tableClassName}
        >
          {caption && <TableCaption>{caption}</TableCaption>}

          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    | DataTableColumnMeta
                    | undefined;
                  const canSort = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  const canFilter =
                    enableFiltering &&
                    header.column.getCanFilter() &&
                    meta?.filterable !== false;
                  const showColumnFilter =
                    canFilter && meta?.filterable === true;
                  const useHeaderMenu = meta?.enableHeaderMenu && canSort;

                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                      align={meta?.align}
                      sortable={!useHeaderMenu && canSort}
                      sorted={!useHeaderMenu ? toSortDir(sortDir) : undefined}
                      onSort={
                        !useHeaderMenu && canSort
                          ? () => header.column.toggleSorting()
                          : undefined
                      }
                      sticky={meta?.sticky}
                      className={cn(
                        header.column.id === "select" && "w-[40px]",
                        meta?.headerClassName,
                      )}
                      style={
                        header.column.getSize() !== 150
                          ? {
                              width: header.column.getSize(),
                              minWidth: header.column.getSize(),
                            }
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : useHeaderMenu ? (
                        <DataTableColumnHeaderMenu
                          column={header.column}
                          title={
                            typeof header.column.columnDef.header === "string"
                              ? header.column.columnDef.header
                              : header.column.id
                          }
                        />
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}

                      {/* Per-column filter */}
                      {showColumnFilter && (
                        <DataTableColumnFilter
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(val) =>
                            header.column.setFilterValue(val || undefined)
                          }
                          placeholder={meta?.filterPlaceholder}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <DataTableSkeleton
                columnCount={visibleColumnCount}
                density={density}
              />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="h-24 text-center"
                >
                  {emptyState ?? (
                    <span className="text-muted-foreground">No results.</span>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  selected={row.getIsSelected()}
                  onClick={onRowClick ? (e) => onRowClick(row, e) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                  data-ds-row-index={rowIndex % 2 === 0 ? "even" : "odd"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as
                      | DataTableColumnMeta
                      | undefined;

                    return (
                      <TableCell
                        key={cell.id}
                        align={meta?.align}
                        className={meta?.cellClassName}
                        style={
                          cell.column.getSize() !== 150
                            ? {
                                width: cell.column.getSize(),
                                minWidth: cell.column.getSize(),
                              }
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>

          {showFooter && (
            <TableFooter>
              {footerGroups.map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>

        {/* Pagination */}
        {enablePagination && (
          <DataTablePagination
            table={table}
            pageSizeOptions={pageSizeOptions}
          />
        )}

        {/* Custom footer */}
        {footer && (typeof footer === "function" ? footer(table) : footer)}
      </div>
    );
  },
) as <TData>(
  props: DataTableProps<TData> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

(DataTable as any).displayName = "DataTable";

// ---------------------------------------------------------------------------
// useDataTable hook — convenience for advanced controlled usage
// ---------------------------------------------------------------------------

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialSorting?: SortingState;
  initialPagination?: Partial<PaginationState>;
  initialColumnFilters?: ColumnFiltersState;
  initialRowSelection?: RowSelectionState;
  initialColumnVisibility?: VisibilityState;
  initialGlobalFilter?: string;
}

export interface UseDataTableReturn<_TData> {
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  globalFilter: string;
  onGlobalFilterChange: OnChangeFn<string>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  rowSelection: RowSelectionState;
  onRowSelectionChange: OnChangeFn<RowSelectionState>;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  /** Spread these into <DataTable /> for full controlled mode. */
  tableProps: {
    sortingState: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    globalFilter: string;
    onGlobalFilterChange: OnChangeFn<string>;
    columnFilters: ColumnFiltersState;
    onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
    paginationState: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    rowSelectionState: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
    columnVisibilityState: VisibilityState;
    onColumnVisibilityChange: OnChangeFn<VisibilityState>;
  };
  /** Reset all state back to initial values. */
  reset: () => void;
}

/**
 * useDataTable — a convenience hook that manages all table state in one place.
 *
 * Spread `tableProps` into `<DataTable />` for fully controlled usage:
 *
 * @example
 * ```tsx
 * const { tableProps, sorting, rowSelection, reset } = useDataTable({
 *   data,
 *   columns,
 *   initialSorting: [{ id: "name", desc: false }],
 *   initialPagination: { pageSize: 20 },
 * });
 *
 * <DataTable
 *   data={data}
 *   columns={columns}
 *   sorting
 *   pagination
 *   rowSelection="multi"
 *   {...tableProps}
 * />
 * ```
 */
export function useDataTable<TData>(
  options: UseDataTableOptions<TData>,
): UseDataTableReturn<TData> {
  const [sorting, onSortingChange] = useState<SortingState>(
    options.initialSorting ?? [],
  );
  const [globalFilter, onGlobalFilterChange] = useState<string>(
    options.initialGlobalFilter ?? "",
  );
  const [columnFilters, onColumnFiltersChange] = useState<ColumnFiltersState>(
    options.initialColumnFilters ?? [],
  );
  const [pagination, onPaginationChange] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    ...options.initialPagination,
  });
  const [rowSelection, onRowSelectionChange] = useState<RowSelectionState>(
    options.initialRowSelection ?? {},
  );
  const [columnVisibility, onColumnVisibilityChange] =
    useState<VisibilityState>(options.initialColumnVisibility ?? {});

  const reset = useCallback(() => {
    onSortingChange(options.initialSorting ?? []);
    onGlobalFilterChange(options.initialGlobalFilter ?? "");
    onColumnFiltersChange(options.initialColumnFilters ?? []);
    onPaginationChange({
      pageIndex: 0,
      pageSize: 10,
      ...options.initialPagination,
    });
    onRowSelectionChange(options.initialRowSelection ?? {});
    onColumnVisibilityChange(options.initialColumnVisibility ?? {});
  }, [options]);

  return {
    sorting,
    onSortingChange,
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    rowSelection,
    onRowSelectionChange,
    columnVisibility,
    onColumnVisibilityChange,
    tableProps: {
      sortingState: sorting,
      onSortingChange,
      globalFilter,
      onGlobalFilterChange,
      columnFilters,
      onColumnFiltersChange,
      paginationState: pagination,
      onPaginationChange,
      rowSelectionState: rowSelection,
      onRowSelectionChange,
      columnVisibilityState: columnVisibility,
      onColumnVisibilityChange,
    },
    reset,
  };
}
