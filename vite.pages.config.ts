import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/metabolic-flow-sync/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@/lib/stripe": new URL("./src/lib/stripe.pages.ts", import.meta.url).pathname,
    },
  },
  build: {
    outDir: "dist",
  },
});