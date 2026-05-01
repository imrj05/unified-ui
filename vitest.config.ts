import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test-setup.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".next", "template", "starters"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".next/",
        "template/",
        "starters/",
        "scripts/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/index.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@unified-ui/utils/cn": path.resolve(
        __dirname,
        "./packages/unified-ui/src/utils/cn.ts",
      ),
      "@unified-ui/utils/focus-ring": path.resolve(
        __dirname,
        "./packages/unified-ui/src/utils/focus-ring.ts",
      ),
      "@work-rjkashyap/unified-ui": path.resolve(
        __dirname,
        "./packages/unified-ui/src/index.ts",
      ),
      "@work-rjkashyap/unified-ui/tokens": path.resolve(
        __dirname,
        "./packages/unified-ui/src/tokens/index.ts",
      ),
      "@work-rjkashyap/unified-ui/theme": path.resolve(
        __dirname,
        "./packages/unified-ui/src/theme/index.ts",
      ),
      "@work-rjkashyap/unified-ui/primitives": path.resolve(
        __dirname,
        "./packages/unified-ui/src/primitives/index.ts",
      ),
      "@work-rjkashyap/unified-ui/components": path.resolve(
        __dirname,
        "./packages/unified-ui/src/components/index.ts",
      ),
      "@work-rjkashyap/unified-ui/motion": path.resolve(
        __dirname,
        "./packages/unified-ui/src/motion/index.ts",
      ),
      "@work-rjkashyap/unified-ui/utils": path.resolve(
        __dirname,
        "./packages/unified-ui/src/utils/index.ts",
      ),
    },
  },
});
