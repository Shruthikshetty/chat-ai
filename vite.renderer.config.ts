import { defineConfig } from "vite";
// eslint-disable-next-line import/no-unresolved
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
