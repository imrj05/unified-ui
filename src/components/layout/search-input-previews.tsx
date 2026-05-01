"use client";

// ============================================================================
// SearchInput Component Previews
// ============================================================================
// Self-contained "use client" preview components for SearchInput.
// These are registered in src/mdx-components.tsx and used in place of inline
// arrow functions inside the preview= prop of <ComponentPage> in MDX files.
//
// Why this exists: MDX files rendered via RSC cannot pass function props
// (e.g. onDebouncedChange) across the RSC → Client serialisation boundary.
//
// The fix: encapsulate all previews that use function props into named
// "use client" components here. They are then referenced by name in MDX,
// never requiring a function to be passed as a prop across the boundary.
// ============================================================================

import { SearchInput } from "@work-rjkashyap/unified-ui";

// ---------------------------------------------------------------------------
// SearchInput — Debounced Change Preview
// ---------------------------------------------------------------------------

export function SearchInputDebouncedPreview() {
  return (
    <div className="w-full max-w-sm">
      <SearchInput
        placeholder="Type to search..."
        debounce={400}
        onDebouncedChange={() => {}}
      />
    </div>
  );
}
