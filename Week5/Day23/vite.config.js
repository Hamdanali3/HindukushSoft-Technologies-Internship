import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the TallyLab counter & theme-switch demo.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
