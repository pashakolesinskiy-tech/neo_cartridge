import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES = [
  'constants.js',
  'audio.js',
  'sprites.js',
  'terrain.js',
  'camera.js',
  'particles.js',
  'weapons.js',
  'entities.js',
  'ai.js',
  'qr.js',
  'net.js',
  'renderer.js',
  'game.js',
  'main.js',
];

function transformModule(filename, code) {
  let out = code;
  const exportsList = [];

  out = out.replace(
    /^[ \t]*import\s*\{([\s\S]*?)\}\s*from\s*['"]\.\/([^'"]+)['"];?[ \t]*$/gm,
    (_m, names, modPath) => {
      const normalized = names.replace(/\s+/g, ' ').replace(/\bas\b/g, ':').trim();
      return `const { ${normalized} } = __require('./${modPath}');`;
    }
  );

  out = out.replace(
    /^([ \t]*)export\s+(?:(async)\s+)?(function|class)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm,
    (_m, indent, isAsync, kind, name) => {
      exportsList.push(name);
      return `${indent}${isAsync ? 'async ' : ''}${kind} ${name}`;
    }
  );

  out = out.replace(
    /^([ \t]*)export\s+(const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm,
    (_m, indent, decl, name) => {
      exportsList.push(name);
      return `${indent}${decl} ${name}`;
    }
  );

  const exportLines = exportsList.map((n) => `  __exports.${n} = ${n};`).join('\n');
  return `'./${filename}': function(__exports, __require) {\n${out}\n${exportLines}\n}`;
}

export function buildCartridge({
  rootDir = __dirname,
  outPath = path.join(__dirname, 'dist', 'worms_armageddon.html'),
  assetBase = 'worms-armageddon/assets/',
} = {}) {
  const htmlRaw = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const cssRaw = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');

  const factories = MODULES.map((name) => {
    const srcCode = fs.readFileSync(path.join(rootDir, 'src', name), 'utf8');
    return transformModule(name, srcCode);
  });

  const bundleScript = `(function () {
  'use strict';
  window.__WORMS_ASSET_BASE__ = ${JSON.stringify(assetBase)};
  const __cache = Object.create(null);
  const __modules = {
${factories.join(',\n')}
  };
  function __require(id) {
    if (__cache[id]) return __cache[id].exports;
    const fn = __modules[id];
    if (!fn) throw new Error('Unknown bundled module: ' + id);
    const mod = { exports: {} };
    __cache[id] = mod;
    fn(mod.exports, __require);
    return mod.exports;
  }
  __require('./main.js');
})();`;

  // Validate compiled JS syntax cleanly before emitting HTML
  new Function(bundleScript);

  const safeCss = cssRaw.replace(/<\/style/gi, '<\\/style');
  const safeJs = bundleScript.replace(/<\/script/gi, '<\\/script');

  let outHtml = htmlRaw.replace(
    /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css["']\s*\/?>/i,
    () => `<style>\n${safeCss}\n</style>`
  );
  outHtml = outHtml.replace(
    /<script\s+type=["']module["']\s+src=["']src\/main\.js["']\s*><\/script>/i,
    () => `<script>\n${safeJs}\n</script>`
  );

  if (outHtml === htmlRaw || outHtml.includes('type="module"')) {
    throw new Error('Failed to inline styles.css or src/main.js cleanly into cartridge HTML');
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, outHtml, 'utf8');
  return { outPath, bytes: Buffer.byteLength(outHtml, 'utf8') };
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isCli) {
  const outArg = process.argv[2] || path.join(__dirname, 'dist', 'worms_armageddon.html');
  const assetArg = process.argv[3] || 'worms-armageddon/assets/';
  const res = buildCartridge({ outPath: path.resolve(outArg), assetBase: assetArg });
  console.log(`Built NEO-CARTRIDGE bundle: ${res.outPath} (${res.bytes} bytes)`);
}
