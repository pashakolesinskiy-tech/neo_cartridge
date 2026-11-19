const fs = require('fs');
const code = fs.readFileSync('neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/g.java', 'utf8');
code.split('\n').forEach((l, idx) => {
  if (l.includes('int[][] e') || l.includes('e = new int') || l.includes('e = {') || l.includes('int[] a =')) {
    console.log(`${idx+1}: ${l.trim()}`);
  }
});
