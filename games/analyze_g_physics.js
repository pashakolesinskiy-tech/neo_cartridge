const fs = require('fs');
const code = fs.readFileSync('neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/g.java', 'utf8');
code.split('\n').forEach((l, idx) => {
  if (l.includes('wind') || l.includes('gravity') || l.includes('power') || l.includes('fuse') || l.includes('angle')) {
    console.log(`${idx+1}: ${l.trim()}`);
  }
});
