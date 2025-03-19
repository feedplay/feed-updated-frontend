import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Dynamic import inside function to avoid top-level await issues
async function setupPlugins(mode: string) {
  const plugins = [react()];

  if (mode === "development") {
    try {
      const { componentTagger } = await import("lovable-tagger");
      plugins.push(componentTagger());
    } catch (error) {
      console.warn("⚠️ Could not load lovable-tagger:", error);
    }
  }

  return plugins;
}

// Export ESM config
export default defineConfig(async ({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: await setupPlugins(mode),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: "dist",
  },
  optimizeDeps: {
    esbuildOptions: {
      format: "esm",
    },
  },
}));
