import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' — działa zarówno lokalnie, jak i na GitHub Pages w podkatalogu.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
