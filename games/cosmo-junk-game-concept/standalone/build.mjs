// ============================================================
// Сборка АВТОНОМНОЙ версии COSMO-JUNK (выполняется один раз
// на машине разработчика или хоста — вам НЕ нужен npm install:
// собранные файлы уже лежат в standalone/assets/).
//
//   node standalone/build.mjs
//
// Требует: node_modules исходного проекта (react, lucide-react,
// qrcode, esbuild, @tailwindcss/postcss) — то есть репозиторий.
// Пакет results: standalone/assets/app.js + app.css.
// ============================================================

import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
// node_modules + исходники берём из рабочего репозитория (там, где делали npm install).
// По умолчанию — D:\Projects\cosmo-junk-game-concept; можно переопределить:
//   COSMO_BUILD_ROOT=D:\path\to\repo node standalone/build.mjs
const PROJECT = fs.existsSync(process.env.COSMO_BUILD_ROOT ?? "")
  ? path.resolve(process.env.COSMO_BUILD_ROOT)
  : "D:\\Projects\\cosmo-junk-game-concept";
const require = createRequire(path.join(PROJECT, "no-such-file.js"));

const esbuild = require("esbuild");

const OUT_JS = path.join(HERE, "assets", "app.js");
const OUT_CSS = path.join(HERE, "assets", "app.css");
fs.mkdirSync(path.join(HERE, "assets"), { recursive: true });

// ---------- 1) JS бандл ----------
const EXT_ORDER = ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js", "/index.jsx"];

// Плагин: "@/lib/game/sim" → <PROJECT>/src/lib/game/sim(.tsx?|.ts?|/index.ts...)
const atAlias = {
  name: "at-alias",
  setup(build) {
    build.onResolve({ filter: /^@\/.*/ }, (args) => {
      const sub = args.path.slice(2);
      for (const ext of EXT_ORDER) {
        const candidate = path.join(PROJECT, "src", sub + ext);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return { path: candidate };
        }
      }
      return { errors: [{ text: `Не найден файл для "${args.path}"` }] };
    });
  },
};

const alias = {
  "next/navigation": path.join(HERE, "src", "next-shims", "navigation.ts"),
  "next/link": path.join(HERE, "src", "next-shims", "link.tsx"),
};

const result = await esbuild.build({
  entryPoints: [path.join(HERE, "src", "main.tsx")],
  outfile: OUT_JS,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020", "chrome105", "safari15"],
  jsx: "automatic",
  legalComments: "none",
  minify: true,
  alias,
  plugins: [atAlias],
  nodePaths: [path.join(PROJECT, "node_modules")],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  logLevel: "info",
});
void result;

// ---------- 2) CSS (Tailwind v4) ----------
process.chdir(PROJECT); // чтобы автодетект источников видел src/** и standalone/**
const postcssMod = require("postcss");
const postcss = postcssMod.default ?? postcssMod;
const twMod = require("@tailwindcss/postcss");
const tailwind = twMod.default ?? twMod;

const cssIn = fs.readFileSync(path.join(PROJECT, "src", "app", "globals.css"), "utf8");
const cssOut = await postcss([tailwind()]).process(cssIn, {
  from: path.join(PROJECT, "src", "app", "globals.css"),
  to: OUT_CSS,
});
fs.writeFileSync(OUT_CSS, cssOut.css, "utf8");

// ---------- 3) иконка ----------
try {
  fs.copyFileSync(
    path.join(PROJECT, "src", "app", "icon.svg"),
    path.join(HERE, "assets", "icon.svg")
  );
} catch {
  /* иконка не критична */
}

const kb = (f) => (fs.statSync(f).size / 1024).toFixed(1);
console.log("");
console.log("Готово:");
console.log(`  ${path.relative(PROJECT, OUT_JS)}  (${kb(OUT_JS)} KB)`);
console.log(`  ${path.relative(PROJECT, OUT_CSS)}  (${kb(OUT_CSS)} KB)`);
console.log("");
console.log("Запуск игры на хост-устройстве:  node standalone/server.js  (без npm install)");
