import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path is set to the repository name so the build works on
// GitHub Pages project sites (https://<user>.github.io/<repo>/).
// Override locally with BASE_PATH env var if needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/pyxis/",
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "esnext",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          codemirror: ["@uiw/react-codemirror", "@codemirror/lang-python", "@codemirror/lang-markdown", "@codemirror/theme-one-dark"],
          markdown: ["react-markdown", "remark-gfm"],
          tiptap: [
            "@tiptap/react",
            "@tiptap/core",
            "@tiptap/starter-kit",
            "@tiptap/extension-image",
            "@tiptap/extension-placeholder",
            "@tiptap/extension-table",
            "@tiptap/extension-task-list",
            "@tiptap/extension-task-item",
            "tiptap-markdown"
          ]
        }
      }
    }
  },
  worker: {
    format: "es"
  }
});
