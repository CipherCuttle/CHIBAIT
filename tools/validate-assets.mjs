import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync('assets/ASSET_MANIFEST.json','utf8'));
const errors=[];
const read=(p)=>fs.readFileSync(path.join(root,p));
for(const asset of manifest.assets){
  try{
    if(asset.path.startsWith('/')||asset.path.includes('..'))throw Error('unsafe path');
    const b=read(asset.path);
    if(b.length!==asset.bytes)throw Error('byte count mismatch');
    if(crypto.createHash('sha256').update(b).digest('hex')!==asset.sha256)throw Error('SHA-256 mismatch');
    if(asset.path.endsWith('.png')){
      if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('invalid PNG signature');
      const w=b.readUInt32BE(16),h=b.readUInt32BE(20),type=b[25];
      if(w!==asset.width||h!==asset.height||type!==6)throw Error('PNG dimensions / RGBA mismatch');
    }
  }catch(e){errors.push(asset.path+': '+e.message);}
}
const m=JSON.parse(read('assets/maps/slopwater-v1.tmj').toString('utf8'));
const n=m.width*m.height;
if(m.width!==32||m.height!==24||m.tilewidth!==16||m.tileheight!==16)errors.push('unexpected Tiled world geometry');
const layers=Object.fromEntries(m.layers.map(x=>[x.name,x]));
for(const name of ['Water','Shore','Collision','Entities'])if(!layers[name])errors.push('missing '+name+' layer');
for(const name of ['Water','Shore','Collision']){
  const l=layers[name];if(l?.type!=='tilelayer'||l.data.length!==n)errors.push(name+' needs exactly '+n+' cells');
}
if(layers.Entities?.type!=='objectgroup')errors.push('Entities must be an objectgroup');
if(layers.Water?.data.length===n&&layers.Shore?.data.length===n&&layers.Collision?.data.length===n){
  for(let i=0;i<n;i++){
    const w=layers.Water.data[i],s=layers.Shore.data[i],c=layers.Collision.data[i];
    if(![1,5,9].includes(w))errors.push('invalid water tile at index '+i);
    if(s<0||s>64||c!==(s?17:0))errors.push('collision/shore mismatch at index '+i);
  }
}
const allowed=new Set(['tree','bush','rock','reeds','lily','prop','fish_shadow','spawn']);
const objects=layers.Entities?.objects??[];
for(const o of objects){
  if(!allowed.has(o.type))errors.push('unknown object type '+o.type);
  if(!Number.isInteger(o.x)||!Number.isInteger(o.y)||o.x<0||o.y<0||o.x>=m.width*16||o.y>=m.height*16)errors.push('invalid entity position '+o.name);
}
const spawns=objects.filter(o=>o.type==='spawn');
if(spawns.length!==1)errors.push('exactly one spawn required');
else if(layers.Collision?.data.length===n&&layers.Collision.data[Math.floor(spawns[0].y/16)*m.width+Math.floor(spawns[0].x/16)]!==0)errors.push('spawn blocked');
if(manifest.visual_target.internal_width!==384||manifest.visual_target.internal_height!==256)errors.push('render contract mismatch');
if(errors.length){console.error('ASSET GATE FAILED\\n'+errors.map(e=>' - '+e).join('\\n'));process.exit(1);}
console.log('ASSET GATE PASS:',manifest.assets.length,'files;',n,'Tiled cells;',objects.length,'entities; 384x256 contract');
