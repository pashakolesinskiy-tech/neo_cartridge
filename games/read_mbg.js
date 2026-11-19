const fs = require('fs');
const buf = fs.readFileSync('neo_cartridge/games/worms_2008_extracted/english.mbg');
console.log('Size of english.mbg:', buf.length);

// Extract all ASCII/UTF8 strings from english.mbg
let cur = '';
const strings = [];
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  if (b >= 32 && b <= 126) {
    cur += String.fromCharCode(b);
  } else {
    if (cur.length >= 3) strings.push(cur);
    cur = '';
  }
}
if (cur.length >= 3) strings.push(cur);

console.log('Found strings count:', strings.length);
strings.forEach((s, idx) => {
  if (s.length > 3) console.log(`${idx}: ${s}`);
});
