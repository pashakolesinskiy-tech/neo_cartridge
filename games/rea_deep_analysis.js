const fs = require('fs');
const dir = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';

console.log('=== 1. SEARCHING ALL IMAGE.CREATEIMAGE CALLS ===');
fs.readdirSync(dir).forEach(f => {
  const code = fs.readFileSync(dir + f, 'utf8');
  if (code.includes('createImage')) {
    console.log(`\n--- In ${f} ---`);
    code.split('\n').forEach((l, idx) => {
      if (l.includes('createImage') || l.includes('.png')) {
        console.log(`  L${idx+1}: ${l.trim()}`);
      }
    });
  }
});
