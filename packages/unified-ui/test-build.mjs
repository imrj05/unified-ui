// ============================================================================
// @unified-ui/react — Build Smoke Test
// ============================================================================
// Quick integration test that imports every entry point from the built dist/
// and verifies the expected exports exist. Run with:
//
//   node test-build.mjs
//
// This file is NOT published to npm (excluded by .npmignore and files[]).
// ============================================================================

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.error(`  ❌ ${label}`);
  }
}

function assertExports(label, mod, expectedKeys) {
  for (const key of expectedKeys) {
    assert(`${label} exports "${key}"`, key in mod);
  }
}

console.log();
console.log("═".repeat(60));
console.log("  @unified-ui/react — Build Smoke Test");
console.log("═".repeat(60));
console.log();

// ---------------------------------------------------------------------------
// 1. ESM imports (via dist/*.mjs)
// ---------------------------------------------------------------------------

console.log("▸ ESM Entry Points");
console.log();

// --- Root barrel ---
console.log("  [index]");
const index = await import(join(__dirname, "dist/index.mjs"));
assertExports("index", index, [
  "UNIFIED_UI_VERSION",
  "Button",
  "Heading",
  "Body",
  "Typography",
  "Stack",
  "Container",
  "Grid",
  "Divider",
  "DSThemeProvider",
  "useDSTheme",
  "fadeIn",
  "slideUp",
  "motionProps",
  "cn",
  "mergeSlots",
  "composeRefs",
  "dsAttr",
  "spacing",
  "radius",
  "shadow",
  "brand",
  "duration",
  "easing",
]);
assert(
  "index: UNIFIED_UI_VERSION is '0.3.7'",
  index.UNIFIED_UI_VERSION === "0.3.7",
);
console.log();

// --- Tokens ---
console.log("  [tokens]");
const tokens = await import(join(__dirname, "dist/tokens/index.mjs"));
assertExports("tokens", tokens, [
  "spacing",
  "radius",
  "shadow",
  "shadowDark",
  "zIndex",
  "brand",
  "slate",
  "semanticLight",
  "semanticDark",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "typographyVariants",
  "duration",
  "durationCSS",
  "durationSeconds",
  "easing",
  "easingCSS",
  "spring",
  "stagger",
]);
assert("tokens: spacing is an object", typeof tokens.spacing === "object");
assert("tokens: radius is an object", typeof tokens.radius === "object");
console.log();

// --- Theme ---
console.log("  [theme]");
const theme = await import(join(__dirname, "dist/theme/index.mjs"));
assertExports("theme", theme, [
  "contract",
  "cssVar",
  "buildLightThemeVars",
  "buildDarkThemeVars",
  "buildThemeCSS",
  "DSThemeProvider",
  "useDSTheme",
]);
assert("theme: contract is an object", typeof theme.contract === "object");
assert(
  "theme: cssVar is an object with methods",
  typeof theme.cssVar === "object" && typeof theme.cssVar.color === "function",
);
assert(
  "theme: DSThemeProvider is a function",
  typeof theme.DSThemeProvider === "function",
);
console.log();

// --- Primitives ---
console.log("  [primitives]");
const primitives = await import(join(__dirname, "dist/primitives/index.mjs"));
assertExports("primitives", primitives, [
  "Typography",
  "Heading",
  "Subheading",
  "Body",
  "Caption",
  "Label",
  "Overline",
  "InlineCode",
  "Container",
  "Stack",
  "Grid",
  "Divider",
]);
assert(
  "primitives: Typography is a component",
  typeof primitives.Typography === "object" ||
    typeof primitives.Typography === "function",
);
assert(
  "primitives: Stack is a component",
  typeof primitives.Stack === "object" ||
    typeof primitives.Stack === "function",
);
console.log();

// --- Components ---
console.log("  [components]");
const components = await import(join(__dirname, "dist/components/index.mjs"));
assertExports("components", components, [
  "Button",
  "buttonVariants",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "CheckboxGroup",
  "RadioGroup",
  "RadioGroupItem",
  "RadioCard",
  "Switch",
  "Card",
  "CardHeader",
  "CardBody",
  "CardFooter",
  "Badge",
  "Avatar",
  "AvatarGroup",
  "Tooltip",
  "TooltipProvider",
  "Popover",
  "PopoverTrigger",
  "PopoverContent",
  "Dialog",
  "DialogContent",
  "DialogTrigger",
  "DropdownMenu",
  "DropdownMenuItem",
  "Sheet",
  "SheetContent",
  "Tabs",
  "TabsList",
  "TabsTrigger",
  "TabsContent",
  "Accordion",
  "AccordionItem",
  "AccordionTrigger",
  "AccordionContent",
  "Alert",
  "Skeleton",
  "SkeletonText",
  "SkeletonCircle",
  "Table",
  "TableHeader",
  "TableBody",
  "TableRow",
  "TableHead",
  "TableCell",
  "Pagination",
  "Breadcrumb",
  "BreadcrumbNav",
  "ToastProvider",
  "useToast",
]);
assert(
  "components: Button is a component",
  typeof components.Button === "object" ||
    typeof components.Button === "function",
);
assert(
  "components: buttonVariants is a function",
  typeof components.buttonVariants === "function",
);
console.log();

// --- Motion ---
console.log("  [motion]");
const motion = await import(join(__dirname, "dist/motion/index.mjs"));
assertExports("motion", motion, [
  "fadeIn",
  "fadeInFast",
  "fadeInSlow",
  "slideUp",
  "slideUpSm",
  "slideUpLg",
  "slideUpSpring",
  "slideDown",
  "slideDownSm",
  "slideLeft",
  "slideRight",
  "scaleIn",
  "scaleInLg",
  "scaleInSpring",
  "blurIn",
  "blurInSubtle",
  "overlayBackdrop",
  "modalContent",
  "modalContentSpring",
  "toastSlideIn",
  "toastSlideUp",
  "expandHeight",
  "press",
  "tapScale",
  "hoverScale",
  "hoverLift",
  "pop",
  "pulse",
  "spin",
  "staggerContainer",
  "motionProps",
  "reduceMotion",
  "withReducedMotion",
  "useMotion",
  "useMotionProps",
  "useReducedMotion",
  "MotionSafe",
]);
assert(
  "motion: fadeIn has variants with initial/animate/exit",
  "variants" in motion.fadeIn &&
    "initial" in motion.fadeIn.variants &&
    "animate" in motion.fadeIn.variants,
);
assert(
  "motion: motionProps is a function",
  typeof motion.motionProps === "function",
);
console.log();

// --- Utils ---
console.log("  [utils]");
const utils = await import(join(__dirname, "dist/utils/index.mjs"));
assertExports("utils", utils, [
  "cn",
  "mergeSlots",
  "composeRefs",
  "dsAttr",
  "dsStateAttr",
  "dsVar",
  "dsColorVar",
  "typedKeys",
  "noop",
  "dsDataAttrs",
  "focusRingClasses",
  "focusRingClassList",
  "focusRingCompactClasses",
  "focusRingInsetClasses",
  "contrastRatio",
  "relativeLuminance",
  "meetsAA",
  "meetsAAA",
  "checkHexContrast",
  "auditContrast",
]);
assert("utils: cn is a function", typeof utils.cn === "function");
assert(
  'utils: cn("a", "b") returns string',
  typeof utils.cn("a", "b") === "string",
);
assert(
  "utils: dsAttr returns data-ds attributes",
  "data-ds" in utils.dsAttr("button"),
);
assert(
  'utils: dsVar("radius","md") returns var()',
  utils.dsVar("radius", "md") === "var(--ds-radius-md)",
);
// NOTE: dsVar produces --ds-<category>-<name> and is intended for non-color tokens
// (radius, shadow, z, duration, easing, font). For color tokens, use dsColorVar()
// which produces var(--<name>) with no --ds- prefix.
console.log();

// ---------------------------------------------------------------------------
// 2. CJS require (via dist/*.cjs)
// ---------------------------------------------------------------------------

console.log("▸ CJS Entry Points");
console.log();

const cjsEntries = [
  "index",
  "tokens/index",
  "theme/index",
  "primitives/index",
  "components/index",
  "motion/index",
  "utils/index",
];
for (const entry of cjsEntries) {
  try {
    const mod = require(join(__dirname, `dist/${entry}.cjs`));
    const keyCount = Object.keys(mod).length;
    assert(
      `CJS ${entry}: loads successfully (${keyCount} exports)`,
      keyCount > 0,
    );
  } catch (err) {
    assert(`CJS ${entry}: loads successfully`, false);
    console.error(`    Error: ${err.message}`);
  }
}
console.log();

// ---------------------------------------------------------------------------
// 3. Type declarations exist
// ---------------------------------------------------------------------------

console.log("▸ Type Declarations");
console.log();

import { existsSync } from "node:fs";

for (const entry of cjsEntries) {
  assert(
    `${entry}.d.ts exists`,
    existsSync(join(__dirname, `dist/${entry}.d.ts`)),
  );
  assert(
    `${entry}.d.cts exists`,
    existsSync(join(__dirname, `dist/${entry}.d.cts`)),
  );
}
console.log();

// ---------------------------------------------------------------------------
// 4. CSS file exists
// ---------------------------------------------------------------------------

console.log("▸ CSS Stylesheet");
console.log();

import { readFileSync } from "node:fs";

const cssPath = join(__dirname, "styles.css");
assert("styles.css exists", existsSync(cssPath));

const css = readFileSync(cssPath, "utf-8");
assert("styles.css contains --primary (color var)", css.includes("--primary:"));
assert("styles.css contains --ds-radius-md", css.includes("--ds-radius-md"));
assert("styles.css contains --ds-shadow-lg", css.includes("--ds-shadow-lg"));
assert("styles.css contains @theme block", css.includes("@theme"));
assert("styles.css contains .dark selector", css.includes(".dark"));
console.log();

// ---------------------------------------------------------------------------
// 5. Functional checks
// ---------------------------------------------------------------------------

console.log("▸ Functional Checks");
console.log();

// cn merges classes correctly
assert("cn merges duplicates", utils.cn("px-4 py-2", "px-8") === "py-2 px-8");

// mergeSlots works
const merged = utils.mergeSlots(
  { root: "flex items-center", icon: "size-4" },
  { root: "gap-2" },
);
assert(
  "mergeSlots merges root slot",
  merged.root.includes("flex") && merged.root.includes("gap-2"),
);
assert("mergeSlots preserves icon slot", merged.icon.includes("size-4"));

// dsAttr produces correct attributes
const attrs = utils.dsAttr("button");
assert('dsAttr: data-ds is ""', attrs["data-ds"] === "");
assert(
  'dsAttr: data-ds-component is "button"',
  attrs["data-ds-component"] === "button",
);

// dsStateAttr conditional
assert(
  "dsStateAttr(active, true) sets attr",
  "data-ds-active" in utils.dsStateAttr("active", true),
);
assert(
  "dsStateAttr(active, false) is empty",
  Object.keys(utils.dsStateAttr("active", false)).length === 0,
);

// dsColorVar
assert(
  "dsColorVar('primary') returns var(--primary)",
  utils.dsColorVar("primary") === "var(--primary)",
);
assert(
  "dsColorVar('primary', 0.5) returns color-mix()",
  utils.dsColorVar("primary", 0.5) ===
    "color-mix(in oklch, var(--primary) 50%, transparent)",
);

// contrast utilities
assert(
  "contrastRatio(white, black) ≈ 21",
  Math.abs(utils.contrastRatio([255, 255, 255], [0, 0, 0]) - 21) < 0.1,
);
assert("meetsAA(21) is true", utils.meetsAA(21));
assert("meetsAAA(21) is true", utils.meetsAAA(21));
assert("meetsAA(3) is false", !utils.meetsAA(3));

// token values
assert("spacing[4] is '16px'", tokens.spacing[4] === "16px");
assert("radius has 'md' key", "md" in tokens.radius);
assert("brand palette has 500", "500" in tokens.brand);

// theme contract
assert(
  "contract has color entries",
  typeof theme.contract === "object" && Object.keys(theme.contract).length > 0,
);
assert(
  "cssVar.color returns var(--primary)",
  theme.cssVar.color("primary") === "var(--primary)",
);

// motionProps spread helper
const spread = motion.motionProps(motion.fadeIn);
assert("motionProps has 'initial' key", "initial" in spread);
assert("motionProps has 'animate' key", "animate" in spread);
assert("motionProps has 'exit' key", "exit" in spread);

console.log();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log("═".repeat(60));
console.log();
if (failed === 0) {
  console.log(`  ✅ ALL ${passed} CHECKS PASSED`);
} else {
  console.log(`  ❌ ${failed} FAILED, ${passed} passed`);
}
console.log();
console.log("═".repeat(60));
console.log();

process.exit(failed > 0 ? 1 : 0);
