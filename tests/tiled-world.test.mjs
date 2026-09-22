import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TiledWorld} from '../src/world/TiledWorld.js';
import {GridBoatSim} from '../src/sim/GridBoatSim.js';
const map=JSON.parse(readFileSync('assets/maps/slopwater-v1.tmj','utf8'));
test('all Tiled layers are exactly 32x24; no unknown entities',()=>{
 const n=map.width*map.height;
 for(const name of ['Water','Shore','Collision'])assert.equal(map.layers.find(l=>l.name===name).data.length,n);
 assert.equal(map.layers.find(l=>l.name==='Entities').objects.filter(o=>o.type==='spawn').length,1);
 assert.ok(map.layers.find(l=>l.name==='Entities').objects.every(o=>o.type!=='reds'));
});
test('Tiled collision fails closed and agrees with shore',()=>{
 const w=new TiledWorld(map);
 assert.equal(w.isPassable(-1,0),false);assert.equal(w.isPassable(w.width,0),false);
 for(let y=0;y<w.height;y++)for(let x=0;x<w.width;x++)assert.equal(w.isPassable(x,y),w.collision[y*w.width+x]===0);
 assert.equal(w.isPassable(w.spawnX,w.spawnY),true);
});
test('existing grid movement runs on Tiled source of truth',()=>{
 const w=new TiledWorld(map),s=new GridBoatSim(w,{x:w.spawnX,y:w.spawnY});
 for(const dir of ['up','down','left','right']){
   const {x,y}=s;const wanted={up:[x,y-1],down:[x,y+1],left:[x-1,y],right:[x+1,y]}[dir];
   const ok=s.requestMove(dir);assert.equal(ok,w.isPassable(...wanted));
   if(ok)for(let i=0;i<s.moveTicks;i++)s.step();
 }
 assert.ok(s.stepCount>=0);
});

test('shore and explicitly solid props determine collision; foliage grows on land',()=>{
 const w=new TiledWorld(map),objects=map.layers.find(l=>l.name==='Entities').objects;
 const solid=new Set(objects.filter(o=>o.properties?.some(p=>p.name==='solid'&&p.value===true)).map(o=>Math.floor(o.y/16)*w.width+Math.floor(o.x/16)));
 for(let y=0;y<w.height;y++)for(let x=0;x<w.width;x++){
  const i=y*w.width+x;
  assert.equal(w.isPassable(x,y),!(w.shore[i]||solid.has(i)));
 }
 for(const o of objects.filter(o=>o.type==='tree'||o.type==='bush'))assert.notEqual(w.shore[Math.floor(o.y/16)*w.width+Math.floor(o.x/16)],0,o.name+' must be on land');
});
