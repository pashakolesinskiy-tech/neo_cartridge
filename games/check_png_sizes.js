const fs = require('fs');
const path = 'neo_cartridge/games/worms_2008_extracted/';
const keyFiles = [
  'wormsASO_splash.png',
  'worms2008_team17logo.png',
  'worms_wiiiconstrip24px.png',
  'worms2008_norm_move_X17Y19.png',
  'worms2008_norm_rocketaim_X18Y20.png',
  'worms_normworm_jump_X10Y25.png',
  'worms_norm_backflip_XY25.png',
  'worms_normworm_death_X19Y24.png',
  'worms_norm_win_X17Y32.png',
  'worms_norm_laserrifle_X22Y19.png',
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
  'worms_girderH_X32Y08.png',
  'sf_rip.png',
  'worms_waterFG02_X64Y16.png',
  'worms_waterBG02_X64Y16.png',
  'landscape1_backdrop.png',
  'landscape1_tile.png',
  'worms_landscape1cap.png'
];

let total = 0;
keyFiles.forEach(f => {
  if (fs.existsSync(path + f)) {
    const sz = fs.statSync(path + f).size;
    total += sz;
    console.log(`${f.padEnd(36)}: ${sz} bytes`);
  }
});
console.log(`Total key PNG size: ${total} bytes (~${Math.round(total/1024)} KB)`);
