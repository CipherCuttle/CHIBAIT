import test from 'node:test';
import assert from 'node:assert/strict';
import { TileWorld, TILE } from '../src/world/slopwater.js';
import { GridBoatSim } from '../src/sim/GridBoatSim.js';

function emptyWorld(w=8,h=8) {
  return new TileWorld(Array.from({length:h},()=>Array(w).fill(TILE.WATER)));
}
function finishMove(sim) {
  for (let i=0;i<sim.moveTicks;i++) sim.step();
}

test('accepted movement advances exactly one tile',()=>{
  const sim=new GridBoatSim(emptyWorld(),{x:3,y:3});
  assert.equal(sim.requestMove('right'),true);
  finishMove(sim);
  assert.equal(sim.x,4);
  assert.equal(sim.y,3);
  assert.equal(sim.stepCount,1);
});

test('blocked tile changes facing but not position',()=>{
  const map=Array.from({length:8},()=>Array(8).fill(TILE.WATER));
  map[3][4]=TILE.ROCK;
  const sim=new GridBoatSim(new TileWorld(map),{x:3,y:3});
  assert.equal(sim.requestMove('right'),false);
  assert.equal(sim.facing,'right');
  assert.equal(sim.x,3);
  assert.equal(sim.y,3);
});

test('same command stream produces identical state',()=>{
  const stream=['right','right','down','left','up','up','right'];
  const run=()=>{
    const sim=new GridBoatSim(emptyWorld(),{x:3,y:3});
    for(const dir of stream){ if(sim.requestMove(dir)) finishMove(sim); }
    return sim.snapshot();
  };
  assert.deepEqual(run(),run());
});

test('render interpolation stays on integer pixels',()=>{
  const sim=new GridBoatSim(emptyWorld(),{x:3,y:3,moveTicks:8});
  sim.requestMove('right');
  for(let i=0;i<7;i++){
    sim.step();
    const p=sim.renderPosition();
    assert.equal(Number.isInteger(p.x),true);
    assert.equal(Number.isInteger(p.y),true);
  }
});
