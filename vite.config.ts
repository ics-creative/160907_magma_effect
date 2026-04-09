import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path when served in production
  base: './',

  // Configure build output
  build: {
    // Output directory
    outDir: 'docs',
  },
});
