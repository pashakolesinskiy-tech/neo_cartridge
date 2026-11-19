const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';
fs.readdirSync(path).forEach(f => {
  const code = fs.readFileSync(path + f, 'utf8');
  if (code.includes('worms_wiiiconstrip24px') || code.includes('wiiiconstrip')) {
    console.log(`Found wiiiconstrip in ${f}`);
    code.split('\n').forEach((l, idx) => {
      if (l.includes('wiiiconstrip')) {
        console.log(`  ${idx+1}: ${l.trim()}`);
      }
    });
  }
});
