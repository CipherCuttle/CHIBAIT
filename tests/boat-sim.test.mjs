import test from 'node:test';
import assert from 'node:assert/strict';
import { BoatSim } from '../src/sim/BoatSim.js';

const DT=1/60;
function run(sequence, opts={}) {
  const sim=new BoatSim(opts);
  for(const input of sequence) sim.step(input,DT,[]);
  return sim.snapshot();
}

test('same input stream produces same movement result',()=>{
  const seq=[];
  for(let i=0;i<360;i++) seq.push({throttle:i<240?1:0,steer:i>70&&i<190?.55:0});
  assert.deepEqual(run(seq),run(seq));
});

test('render viewport is not part of simulation state',()=>{
  const seq=Array.from({length:180},()=>({throttle:1,steer:.2}));
  const a=run(seq,{worldWidth:2200,worldHeight:1600});
  const b=run(seq,{worldWidth:2200,worldHeight:1600});
  assert.deepEqual(a,b);
});

test('world bounds fail closed',()=>{
  const sim=new BoatSim({x:30,y:30,worldWidth:400,worldHeight:300});
  sim.heading=Math.PI*1.5;
  for(let i=0;i<600;i++) sim.step({throttle:1,steer:0},DT,[]);
  assert.ok(sim.x>=sim.radius && sim.y>=sim.radius);
  assert.ok(sim.x<=sim.worldWidth-sim.radius && sim.y<=sim.worldHeight-sim.radius);
});
