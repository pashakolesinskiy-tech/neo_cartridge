const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';

function inspectFile(name, pattern) {
  const code = fs.readFileSync(path + name, 'utf8');
  const lines = code.split('\n');
  console.log(`=== ${name} ===`);
  lines.forEach((line, i) => {
    if (pattern.test(line)) {
      console.log(`${(i+1).toString().padStart(4)}: ${line.trim()}`);
    }
  });
}

inspectFile('e.java', /\.wav|\.mid|Player|sound|volume/i);
