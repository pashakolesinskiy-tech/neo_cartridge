const fs = require('fs');
const path = 'neo_cartridge/games/worms_decompiled/com/mnemonicstudios/novusapp/';

function searchWords(file, words) {
  const code = fs.readFileSync(path + file, 'utf8');
  console.log(`=== Searching in ${file} ===`);
  code.split('\n').forEach((l, idx) => {
    words.forEach(w => {
      if (l.toLowerCase().includes(w.toLowerCase())) {
        console.log(`  ${(idx+1).toString().padStart(4)}: [${w}] ${l.trim()}`);
      }
    });
  });
}

searchWords('g.java', ['banana', 'sheep', 'grenade', 'bazooka', 'blaster', 'punch', 'mine', 'airstrike', 'cluster', 'jetpack', 'teleport', 'girder', 'shield']);
