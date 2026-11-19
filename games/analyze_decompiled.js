const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';
const files = fs.readdirSync(path);

console.log('--- REA: J2ME Worms 2008 Class Analysis ---');
files.forEach(f => {
  const code = fs.readFileSync(path + f, 'utf8');
  const lines = code.split('\n');
  const strMatches = code.match(/"([^"\\]|\\.)*"/g) || [];
  const cleanStrs = strMatches.map(s => s.replace(/"/g, '')).filter(s => s.length > 2 && !s.includes('\n'));
  const pngs = cleanStrs.filter(s => s.endsWith('.png') || s.endsWith('.wav'));
  console.log(`${f.padEnd(16)} | lines: ${lines.length.toString().padEnd(5)} | assets: ${pngs.slice(0, 6).join(', ')}`);
});
