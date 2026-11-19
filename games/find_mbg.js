const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';
fs.readdirSync(path).forEach(f => {
  const code = fs.readFileSync(path + f, 'utf8');
  if (code.includes('.mbg') || code.includes('mbgt')) {
    console.log(`Found .mbg in ${f}`);
    code.split('\n').forEach((l, idx) => {
      if (l.includes('.mbg') || l.includes('mbgt')) {
        console.log(`  ${idx+1}: ${l.trim()}`);
      }
    });
  }
});
