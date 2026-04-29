import fs from "fs";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appName = env.APP_NAME || env.VITE_APP_NAME || "Serandip Prime";
  const mainRepoWebDir = path.resolve(__dirname, "../Web");
  const buildOutDir = fs.existsSync(mainRepoWebDir)
    ? path.join(mainRepoWebDir, "dist")
    : path.resolve(__dirname, "dist");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    build: {
      outDir: buildOutDir,
      emptyOutDir: true,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
    define: {
      "import.meta.env.VITE_APP_NAME": JSON.stringify(appName),
    },
  };
});
