import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Dynamic import for `lovable-tagger` (ESM-compatible)
let componentTagger;
try {
  componentTagger = (await import("lovable-tagger")).componentTagger;
} catch (error) {
  console.warn("⚠️ Could not load lovable-tagger:", error);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger ? componentTagger() : undefined,
  ].filter(Boolean), // Removes falsy values to avoid errors
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      transformMixedEsModules: true, // Allow ESM in CommonJS
    },
    outDir: "dist",
  },
  optimizeDeps: {
    esbuildOptions: {
      format: "esm", // Ensure Vite builds in ESM mode
    },
  },
}));
