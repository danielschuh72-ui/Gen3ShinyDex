// Gen-3 map overlay data. Coordinates are PERCENT (x,y) on each clean map image,
// authored against the labeled reference maps. r = highlight radius (percent of width).
window.GMAPS = (function(){
  const hoenn = { img:'assets/maps/hoenn.png', ar:257/159, r:11, pts:{
    littleroot:[27,60], oldale:[28,49], petalburg:[22,54], rustboro:[20,41], dewford:[20,75],
    slateport:[37,61], mauville:[38,45], verdanturf:[29,44], lavaridge:[31,31], fallarbor:[26,20],
    fortree:[44,21], lilycove:[58,29], mossdeep:[73,32], sootopolis:[69,45], 'ever-grande':[76,52], pacifidlog:[52,57],
    r101:[27,54], r102:[25,49], r103:[32,50], r104:[20,47], r105:[20,61], r106:[21,69], r107:[27,73], r108:[31,73],
    r109:[35,66], r110:[37,53], r111:[35,27], r112:[32,31], r113:[29,20], r114:[21,25], r115:[19,34], r116:[23,41],
    r117:[29,43], r118:[40,44], r119:[43,27], r120:[47,25], r121:[53,30], r122:[54,37], r123:[46,44], r124:[66,32],
    r125:[70,29], r126:[66,42], r127:[72,43], r128:[73,48], r129:[73,54], r130:[66,56], r131:[59,56], r132:[52,57],
    r133:[46,57], r134:[40,57],
    'meteor-falls':[19,21],'petalburg-woods':[21,46],'rusturf-tunnel':[26,42],'granite-cave':[20,75],'mt-chimney':[35,24],
    'jagged-pass':[33,28],'fiery-path':[32,27],'mt-pyre':[55,39],'safari-zone':[54,22],'cave-of-origin':[69,45],
    'seafloor-cavern':[66,50],'shoal-cave':[73,32],'sky-pillar':[49,66],'victory-road':[76,52],'new-mauville':[40,47],
    'sealed-chamber':[46,57],'abandoned-ship':[34,66],'southern-island':[46,73],'island-cave':[35,27],'desert-ruins':[31,73],
    'ancient-tomb':[46,57],'magma-hideout':[35,26],'aqua-hideout':[58,29],'scorched-slab':[43,27],'weather-institute':[43,29],
    'battle-frontier':[63,61],'desert':[35,27],'artisan-cave':[63,61] } };
  const kanto = { img:'assets/maps/kanto.png', ar:1142/857, r:9, pts:{
    pallet:[23,75], viridian:[23,58], pewter:[15,30], cerulean:[64,30], vermilion:[64,64], lavender:[81,48],
    celadon:[52,48], saffron:[64,48], fuchsia:[56,80], cinnabar:[23,92], indigo:[10,20],
    r1:[23,66], r2:[23,44], r3:[30,31], r4:[45,28], r5:[64,38], r6:[64,56], r7:[72,48], r8:[73,42], r9:[85,28],
    r10:[85,38], r11:[74,64], r12:[85,52], r13:[88,60], r14:[80,70], r15:[70,72], r16:[40,42], r17:[40,55],
    r18:[45,72], r19:[60,86], r20:[38,88], r21:[23,84], r22:[10,50], r23:[10,32], r24:[64,16], r25:[70,12],
    'mt-moon':[36,28],'rock-tunnel':[85,40],'power-plant':[90,36],'pokemon-tower':[81,48],'safari-zone':[52,72],
    'seafoam':[40,88],'cerulean-cave':[60,26],'victory-road':[12,24],'diglett':[20,40],'viridian-forest':[20,42],
    'pokemon-mansion':[23,92],'silph':[64,48],'rocket':[52,48] } };
  const sevii = { img:'assets/maps/sevii.webp', ar:192/432, r:14, pts:{
    'one-island':[28,17],'treasure-beach':[26,23],'kindle-road':[31,12],'mt-ember':[24,8],'two-island':[55,20],
    'cape-brink':[52,15],'three-island':[72,26],'three-isle':[74,29],'bond-bridge':[64,26],'berry-forest':[58,25],
    'four-island':[18,52],'navel-rock':[40,58],'five-island':[68,62],'five-isle':[70,66],'memorial-pillar':[74,70],
    'water-labyrinth':[62,60],'lost-cave':[77,58],'resort-gorgeous':[72,57],'six-island':[62,76],'water-path':[66,76],
    'dotted-hole':[60,80],'ruin-valley':[63,81],'green-path':[58,70],'pattern-bush':[64,73],'outcast-island':[56,74],
    'altering-cave':[58,72],'seven-island':[28,86],'trainer-tower':[30,82],'canyon':[30,88],'sevault':[32,90],
    'tanoby':[36,92],'birth-island':[82,92],'icefall-cave':[70,64] } };
  const seviiSlugs = ['one-island','two-island','three-island','four-island','five-island','six-island','seven-island',
    'treasure-beach','kindle-road','mt-ember','cape-brink','bond-bridge','berry-forest','three-isle','four-isle','five-isle',
    'water-path','water-labyrinth','memorial-pillar','resort-gorgeous','lost-cave','icefall-cave','tanoby','dotted-hole',
    'ruin-valley','sevault','trainer-tower','pattern-bush','altering-cave','outcast-island','green-path','navel-rock',
    'birth-island','ruin-of-alph','sevii'];
  function classify(area){ const a=area.toLowerCase(); if(seviiSlugs.some(s=>a.includes(s))) return 'sevii';
    // kanto FRLG places (non-sevii) vs hoenn handled by caller region; default hoenn
    return null; }
  function match(region, area){ const map={hoenn,kanto,sevii}[region]; if(!map) return null; const a=area.toLowerCase();
    const rm=a.match(/route-(\d+)/); if(rm){ const k='r'+Number(rm[1]); if(map.pts[k]) return {x:map.pts[k][0],y:map.pts[k][1],r:map.r}; }
    let best=null,bl=0; for(const k in map.pts){ if(k[0]==='r'&&/^r\d+$/.test(k)) continue; if(a.includes(k)&&k.length>bl){ best=map.pts[k]; bl=k.length; } }
    if(best) return {x:best[0],y:best[1],r:map.r}; return null; }
  return {hoenn,kanto,sevii,seviiSlugs,classify,match};
})();
