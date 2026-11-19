const fs = require('fs');
const path = 'neo_cartridge/games/worms_2008_extracted/';
const wavs = fs.readdirSync(path).filter(f => f.endsWith('.wav'));
let total = 0;
wavs.forEach(w => {
  const sz = fs.statSync(path + w).size;
  total += sz;
  console.log(`${w.padEnd(16)}: ${sz} bytes`);
});
console.log(`Total WAV size: ${total} bytes (~${Math.round(total/1024)} KB)`);
