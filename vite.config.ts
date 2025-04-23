import { defineConfig } from "vite";

export default defineConfig({
  // Base public path when served in production
  base: "./",

  build: {
    outDir: "docs",
  },

  // Development server configuration
  server: {
    // Open browser on server start
    open: true,
  },

  // Configure esbuild to support top-level await
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
});
