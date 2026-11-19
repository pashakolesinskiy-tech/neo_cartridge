// Find shift between ciphertext and 'Language'
const cipher = '$1*8$*(';
const target = 'Language';
for (let i = 0; i < cipher.length; i++) {
  const c = cipher.charCodeAt(i);
  const t = target.charCodeAt(i);
  console.log(`cipher: '${cipher[i]}' (${c}), target: '${target[i]}' (${t}), diff: ${t - c}, xor: ${c ^ t}`);
}
