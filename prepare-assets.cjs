const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('C:/Users/canta/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = 'https://static.ifood-static.com.br/image/upload/t_low/pratos/e8ee13db-a4eb-45d8-8ee8-8d1f84f85a17/';
const photos = {camarao:'202410022118_H5PU_i.jpg',caipirinha:'202607031717_17IJ_i.jpg',parmegiana:'202603111424_JTCR_i.jpg',alcatra:'202603111419_10IX_i.jpg',panceta:'202410022015_4X33_i.jpg',batata:'202410022010_L6V6_i.jpg',bolinho:'202410022031_N8Y6_i.jpg',pastel:'202410022013_FD50_i.jpg',cheese:'202410022019_3438_i.jpg',croquete:'202410022022_O867_i.jpg'};
(async()=>{
 await Promise.all(Object.entries(photos).map(async([name,file])=>{const r=await fetch(base+file);if(!r.ok)throw Error(name+': '+r.status);await sharp(Buffer.from(await r.arrayBuffer())).resize({width:520,withoutEnlargement:true}).webp({quality:85}).toFile('dist/assets/'+name+'.webp')}));
 const deps={ 'gsap.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js','ScrollTrigger.min.js':'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js','three.module.min.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js','three.core.min.js':'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.min.js'};
 await Promise.all(Object.entries(deps).map(async([file,url])=>{const r=await fetch(url);if(!r.ok)throw Error(file+': '+r.status);await fs.writeFile('dist/assets/'+file,Buffer.from(await r.arrayBuffer()))}));
 console.log('Downloaded 10 menu images and 4 animation modules');
})().catch(e=>{console.error(e.message);process.exitCode=1});

