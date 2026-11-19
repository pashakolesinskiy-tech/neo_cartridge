const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';
fs.readdirSync(path).forEach(f => {
  const code = fs.readFileSync(path + f, 'utf8');
  if (code.includes('com.mnemonicstudios.novusapp.n.x') || code.includes('n.x')) {
    console.log(`Found n.x in ${f}`);
    code.split('\n').forEach((l, idx) => {
      if (l.includes('.x.') || l.includes('n.x')) {
        console.log(`  ${idx+1}: ${l.trim()}`);
      }
    });
  }
});
