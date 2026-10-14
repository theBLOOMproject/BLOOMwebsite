import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { SITE_TITLE } from "./src/content/terms";

/** Dev-only plugin: POST /__save-content to write JSON edits to disk */
function contentEditorPlugin(): Plugin {
  return {
    name: "content-editor",
    apply: "serve", // dev only
    configureServer(server) {
      server.middlewares.use("/__save-content", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }
        let body = "";
        req.on("data", (chunk: Buffer) => { body += chunk.toString(); });
        req.on("end", () => {
          try {
            const { file, path: keyPath, value } = JSON.parse(body);
            const filePath = path.resolve(__dirname, "src/content", file);

            // Safety: only allow writing inside src/content
            if (!filePath.startsWith(path.resolve(__dirname, "src/content"))) {
              res.statusCode = 403;
              res.end("Forbidden");
              return;
            }

            const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));

            // keyPath supports dot notation and array indices: "cards.0.desc"
            const keys = keyPath.split(".");
            let target = json;
            for (let i = 0; i < keys.length - 1; i++) {
              target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = value;

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + "\n");
            res.statusCode = 200;
            res.end("ok");
          } catch (e: unknown) {
            res.statusCode = 500;
            res.end(String(e));
          }
        });
      });
    },
  };
}

// Absolute site URL for link-preview tags (%VITE_SITE_URL% in the HTML pages)
process.env.VITE_SITE_URL ??= "https://bloom-project.org";
// Homepage title comes from the terms file (%VITE_SITE_TITLE% in index.html)
process.env.VITE_SITE_TITLE = SITE_TITLE;

export default defineConfig({
  // "/" for bloom-project.org; the fork's staging deploy sets BASE_PATH=/BLOOMwebsite/
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), contentEditorPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        news: path.resolve(__dirname, "news/index.html"),
        cohort: path.resolve(__dirname, "cohort/index.html"),
        people: path.resolve(__dirname, "people/index.html"),
        updates: path.resolve(__dirname, "updates/index.html"),
        "how-we-work": path.resolve(__dirname, "how-we-work/index.html"),
      },
    },
  },
});
