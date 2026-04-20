import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const BASE_URL = env.VITE_BASE_URL;
  const PORT = env.VITE_BACKEND_PORT;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: `${BASE_URL}:${PORT}`,
          changeOrigin: true,
          secure: mode === "production",
        },
      },
    },
  };
});