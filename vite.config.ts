import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path when served in production
  base: './',

  // Configure build output
  build: {
    // Output directory (same as webpack)
    outDir: 'docs',
  },

  // Development server configuration
  server: {
    // Open browser on server start
    open: true,
  },
});
