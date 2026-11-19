const fs = require('fs');
const path = 'neo_cartridge/games/worms_2008_extracted/';

function getPngDimensions(buf) {
  if (buf.length < 24) return null;
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buf.readUInt32BE(0) !== 0x89504E47) return null;
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

const files = fs.readdirSync(path).filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} PNG sprites`);
files.forEach(f => {
  const buf = fs.readFileSync(path + f);
  const dims = getPngDimensions(buf);
  if (dims) {
    console.log(`${f.padEnd(36)} : ${dims.width} x ${dims.height}`);
  }
});
