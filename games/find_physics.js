const fs = require('fs');
const code = fs.readFileSync('neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/r.java', 'utf8');
code.split('\n').forEach((l, idx) => {
  if (l.includes('gravity') || l.includes('jump') || l.includes('backflip') || l.includes('velocity') || l.includes('speed') || l.includes('this.y') || l.includes('this.x')) {
    if (l.includes('+=') || l.includes('-=') || l.includes('jump') || l.includes('backflip')) {
      console.log(`${idx+1}: ${l.trim()}`);
    }
  }
});
