import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },

  // ✅ FORCE VITE TO NOT BREAK ON TANSTACK SPLIT PACKAGE
  optimizeDeps: {
    include: ["@tanstack/query-core"],
  },

  // ✅ THIS IS THE KEY FIX DYAD IS TALKING ABOUT
  build: {
    rollupOptions: {
      external: ["@tanstack/query-core"],
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
}));