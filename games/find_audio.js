const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';
fs.readdirSync(path).forEach(f => {
  const code = fs.readFileSync(path + f, 'utf8');
  if (code.includes('.wav') || code.includes('.mid') || code.includes('Manager.createPlayer') || code.includes('Sound')) {
    console.log(`Found audio reference in ${f}`);
    code.split('\n').forEach((l, idx) => {
      if (l.includes('.wav') || l.includes('.mid') || l.includes('createPlayer')) {
        console.log(`  ${idx+1}: ${l.trim()}`);
      }
    });
  }
});
