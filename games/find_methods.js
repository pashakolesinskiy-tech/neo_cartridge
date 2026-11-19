const fs = require('fs');
const code = fs.readFileSync('neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/r.java', 'utf8');
code.split('\n').forEach((l, idx) => {
  if (l.includes('public final void ') || l.includes('public void ')) {
    console.log(`${idx+1}: ${l.trim()}`);
  }
});
