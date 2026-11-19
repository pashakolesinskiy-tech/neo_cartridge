const fs = require('fs');
const path = 'neo_cartridge/games/worms_2008_extracted/';

const wavs = [
  'jump.wav',
  'explosion.wav',
  'bip.wav',
  'sheep.wav',
  'drown.wav',
  'crate.wav',
  'missile.wav',
  'teleport.wav',
  'punch.wav',
  'ow.wav',
  'shield.wav',
  'atompack.wav'
];

const pngs = [
  'wormsASO_splash.png',
  'worms2008_team17logo.png',
  'worms_wiiiconstrip24px.png',
  'worms2008_norm_move_X17Y19.png',
  'worms2008_norm_rocketaim_X18Y20.png',
  'worms_normworm_jump_X10Y25.png',
  'worms_norm_backflip_XY25.png',
  'worms_normworm_death_X19Y24.png',
  'worms_normworm_bighit_XY25.png',
  'worms_norm_win_X17Y32.png',
  'worms_norm_laserrifle_X22Y19.png',
  'worms_astropunch_norm.png',
  'worms_norm_jetpack_X16Y25.png',
  'worms_excavator_norm.png',
  'worms_surrenderflag_X54Y27.png',
  'worms_health_X26Y22.png',
  'worms_atompack_frames.png',
  'worm_largeexplosion_X57Y63.png',
  'worm_rocketflame_XY09.png',
  'worms_airstrike_missile.png',
  'worms_bananasmall_XY13.png',
  'worms_clusterfrag_frames.png',
  'worms_timefrag_frames.png',
  'worms_robosheep_frames.png',
  'worms_proxmineon_XY11.png',
  'worms_crate_X26Y22.png',
  'worms_dropcrate_frames.png',
  'worms_crosshair.png',
  'worms_arrow.png',
  'worms_girderH_X32Y08.png',
  'sf_rip.png',
  'worms_waterFG02_X64Y16.png',
  'worms_waterBG02_X64Y16.png',
  'landscape1_backdrop.png',
  'landscape1_tile.png',
  'worms_landscape1cap.png',
  'icon.png'
];

const bundle = { audio: {}, images: {} };

wavs.forEach(w => {
  const buf = fs.readFileSync(path + w);
  bundle.audio[w.replace('.wav', '')] = 'data:audio/wav;base64,' + buf.toString('base64');
});

pngs.forEach(p => {
  const buf = fs.readFileSync(path + p);
  const key = p.replace('.png', '');
  bundle.images[key] = 'data:image/png;base64,' + buf.toString('base64');
});

const out = 'var W2008_ASSETS = ' + JSON.stringify(bundle) + ';\nif (typeof window !== "undefined") window.W2008_ASSETS = W2008_ASSETS;\nif (typeof module !== "undefined") module.exports = W2008_ASSETS;\n';
fs.writeFileSync('neo_cartridge/games/worms_assets_bundle.js', out);
console.log('Bundle updated! File size:', fs.statSync('neo_cartridge/games/worms_assets_bundle.js').size, 'bytes');
