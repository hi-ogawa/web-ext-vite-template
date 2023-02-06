import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  appType: "mpa",
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        options: path.resolve(__dirname, "src/options/index.html"),
        popup: path.resolve(__dirname, "src/popup/index.html"),
      },
    },
  },
  plugins: [unocss(), react()],
});
