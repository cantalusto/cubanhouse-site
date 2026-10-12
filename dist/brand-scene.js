import * as THREE from './assets/three.module.min.js';
export async function initBrand({reduced=false}={}){
 const host=document.querySelector('#brand-3d');let renderer;
 try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'})}catch{return fallback()}
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<761?1.25:1.5));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,30);camera.position.set(0,.15,6);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xdaedff,0x090817,1.6));
 const pink=0xf778aa,mint=0x7de7d7,yellow=0xf3d677;
 const key=new THREE.PointLight(pink,28,12);key.position.set(-3,2,4);scene.add(key);const fill=new THREE.PointLight(mint,24,10);fill.position.set(3,-1,3);scene.add(fill);
 const sign=new THREE.Group();scene.add(sign);sign.rotation.set(-.025,-.09,0);
 const backing=new THREE.Mesh(new THREE.CylinderGeometry(1.38,1.38,.16,72),new THREE.MeshStandardMaterial({color:0x090a0e,metalness:.75,roughness:.3}));backing.rotation.x=Math.PI/2;sign.add(backing);
 const pinkMat=new THREE.MeshStandardMaterial({color:pink,emissive:pink,emissiveIntensity:2.5,roughness:.18,metalness:.15});
 const mintMat=new THREE.MeshStandardMaterial({color:mint,emissive:mint,emissiveIntensity:2,roughness:.2});
 const goldMat=new THREE.MeshStandardMaterial({color:yellow,emissive:yellow,emissiveIntensity:1.2,roughness:.3});
 function ring(radius,material,z=.12,tube=.017){const m=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,96),material);m.position.z=z;sign.add(m);return m}
 ring(1.32,pinkMat);ring(.81,pinkMat,.16,.012);
 function tube(points,material= mintMat,r=.014){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(p[0],p[1],p[2]??.22)),false,'centripetal');const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*8),r,8,false),material);sign.add(mesh);return mesh}
 // Two raised coupe glasses clink at the centre, matching the logo's linework.
 tube([[-.51,.55],[-.44,.36],[-.29,.27],[-.13,.3],[-.04,.49],[-.27,.54],[-.51,.55]]);
 tube([[.08,.52],[.18,.28],[.35,.26],[.5,.38],[.53,.59],[.31,.55],[.08,.52]]);
 tube([[-.28,.27],[-.31,.05],[-.42,0],[-.21,-.02],[-.31,.05]]);
 tube([[.33,.27],[.36,.03],[.23,-.01],[.47,-.04],[.36,.03]]);
 tube([[-.44,.47],[-.31,.42],[-.12,.44]],goldMat,.009);tube([[.16,.43],[.34,.4],[.5,.46]],goldMat,.009);
 // Caneca and warm foam below the toast.
 tube([[-.32,-.36],[-.31,-.67],[-.27,-.82],[.19,-.82],[.25,-.72],[.25,-.36]],pinkMat,.016);
 tube([[.25,-.44],[.47,-.46],[.49,-.62],[.38,-.67],[.26,-.65]],pinkMat,.015);
 tube([[-.32,-.35],[-.39,-.27],[-.29,-.18],[-.2,-.21],[-.14,-.13],[-.04,-.14],[.04,-.22],[.15,-.15],[.27,-.18],[.32,-.27],[.23,-.35],[-.32,-.35]],goldMat,.018);
 [-.19,-.04,.12].forEach(x=>tube([[x,-.42],[x,-.69]],goldMat,.008));
 // Palm silhouettes are deliberately raised off the rim like bent neon tubes.
 [-1,1].forEach(side=>{const x=side*1.17,y=.9;tube([[x,y],[side*1.24,.61],[side*1.35,.26],[side*1.38,-.02]],pinkMat,.015);for(const [dx,dy] of [[-.32,.15],[-.35,-.04],[-.29,-.23],[.25,.17],[.31,-.04],[.22,-.25]])tube([[x,y],[x+dx*.6,y+dy*.7],[x+dx,y+dy]],pinkMat,.012)});
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d');await document.fonts.ready;
 function arcText(text,radius,start,end,color,size,brush=ctx){brush.save();brush.translate(512,512);brush.fillStyle=color;brush.shadowColor=color;brush.shadowBlur=12;brush.textAlign='center';brush.textBaseline='middle';brush.font=`800 ${size}px Outfit, Arial, sans-serif`;[...text].forEach((letter,i)=>{const angle=start+(end-start)*i/(text.length-1);brush.save();brush.translate(Math.cos(angle)*radius,Math.sin(angle)*radius);brush.rotate(angle+(end>start?Math.PI/2:-Math.PI/2));brush.fillText(letter,0,0);brush.restore()});brush.restore()}
 arcText('CUBAN HOUSE',405,-2.66,-.48,'#f778aa',62);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;const nameLight=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});const letters=new THREE.Mesh(new THREE.PlaneGeometry(2.72,2.72),nameLight);letters.position.z=.18;sign.add(letters);
 const bottomCanvas=document.createElement('canvas');bottomCanvas.width=bottomCanvas.height=1024;arcText('GASTROBAR',405,2.55,.59,'#7de7d7',67,bottomCanvas.getContext('2d'));const bottomTex=new THREE.CanvasTexture(bottomCanvas);bottomTex.colorSpace=THREE.SRGBColorSpace;const bottomLetters=new THREE.Mesh(new THREE.PlaneGeometry(2.72,2.72),new THREE.MeshBasicMaterial({map:bottomTex,transparent:true,depthWrite:false}));bottomLetters.position.z=.18;sign.add(bottomLetters);
 function halo(color){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gradient=g.createRadialGradient(32,32,1,32,32,32);gradient.addColorStop(0,color+'88');gradient.addColorStop(.25,color+'28');gradient.addColorStop(1,color+'00');g.fillStyle=gradient;g.fillRect(0,0,64,64);return new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})}
 const glowP=halo('#ff589c'),glowM=halo('#6cebdd');[[1.26,0,glowP],[-1.17,.57,glowP],[.9,-.92,glowM],[-.93,-.86,glowM]].forEach(([x,y,m])=>{const sprite=new THREE.Sprite(m);sprite.position.set(x,y,.23);sprite.scale.set(1.3,1.3,1);sign.add(sprite)});
 host.replaceChildren(renderer.domElement);
 let visible=false,paused=reduced,frame=0,last=0,scrollAngle=0;
 function render(){renderer.render(scene,camera)}
 function resize(){const r=host.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render()}
 function animate(now){frame=0;if(!visible||document.hidden)return;if(now-last>1000/(innerWidth<761?24:30)){last=now;if(!paused){sign.rotation.y=-.06+Math.sin(now*.0008)*.22+scrollAngle;sign.rotation.z=Math.sin(now*.00065)*.038;sign.position.x=Math.sin(now*.0007)*.065;sign.position.y=Math.sin(now*.0009)*.07;const phase=now%9000;let light=1;if(phase>6300&&phase<7100){if(phase<6500)light=1-(phase-6300)/200*.9;else if(phase<6780)light=.1;else light=.1+(phase-6780)/320*.9}nameLight.opacity=light;}render()}if(!paused)frame=requestAnimationFrame(animate)}
 function wake(){if(visible&&!frame)frame=requestAnimationFrame(animate)}
 new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){render();wake()}else if(frame){cancelAnimationFrame(frame);frame=0}},{threshold:.1}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();else if(frame){cancelAnimationFrame(frame);frame=0}});
 let scrollTrigger;function motion(value){paused=value;scrollTrigger?.kill();scrollAngle=0;if(!paused&&window.ScrollTrigger)scrollTrigger=ScrollTrigger.create({trigger:'.experience',start:'top bottom',end:'bottom top',onUpdate:s=>{scrollAngle=(s.progress-.5)*.035;wake()}});if(paused){sign.position.set(0,0,0);sign.rotation.set(-.025,-.09,0);nameLight.opacity=1;render()}wake()}
 window.addEventListener('cuban:motion',e=>motion(e.detail.reduced));motion(reduced);resize();
 function fallback(){/* Keep the original logo visible without WebGL. */}
}
