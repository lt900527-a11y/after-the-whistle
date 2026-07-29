import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "github-pages",
  publicDir: "../public",
  base: "/after-the-whistle/",
  plugins: [react()],
  build: {
    outDir: "../github-pages-dist",
    emptyOutDir: true,
  },
});
