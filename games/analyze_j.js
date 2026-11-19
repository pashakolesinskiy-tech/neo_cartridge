const fs = require('fs');
const code = fs.readFileSync('neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/j.java', 'utf8');
code.split('\n').forEach((l, idx) => {
  if (l.includes('public final void ') || l.includes('public static void ') || l.includes('crater') || l.includes('explosion') || l.includes('tile')) {
    if (l.includes('void ') || l.includes('int[] ') || l.includes('draw')) {
      console.log(`${idx+1}: ${l.trim()}`);
    }
  }
});
