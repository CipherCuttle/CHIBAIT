import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const map = JSON.parse(read('assets/maps/slopwater-v1.tmj'));
const manifest = JSON.parse(read('assets/ASSET_MANIFEST.json'));
const scene = read('src/scenes/LakeScene.js');
const shell = read('index.html');
const main = read('src/main.js');
const visual = read('src/presentation/VisualWater.js');

test('384x256 viewport is independent of 16x16 grid geometry', () => {
  assert.equal(manifest.visual_target.internal_width,384);
  assert.equal(manifest.visual_target.internal_height,256);
  assert.equal(map.tilewidth,16);
  assert.equal(map.tileheight,16);
  assert.match(main,/INTERNAL_W = 384/);
  assert.match(main,/INTERNAL_H = 256/);
  assert.match(main,/Phaser\.Scale\.NONE/);
  assert.match(shell,/image-rendering:pixelated/);
  assert.doesNotMatch(shell, /class="side"/);
});
test('Tiled map is runtime source of truth; old procedural map is absent', () => {
  assert.match(scene,/new TiledWorld\(tiled\)/);
  assert.match(scene,/new GridBoatSim\(this\.worldModel/);
  assert.match(scene,/load\.tilemapTiledJSON/);
  assert.doesNotMatch(scene,/buildSlopwater/);
  assert.match(visual,/createLayer\('Water'/);
  assert.match(visual,/createLayer\('Shore'/);
});
test('canonical spritesheet geometry supports all required frames', () => {
  const byPath = name => manifest.assets.find(a => a.path.endsWith(name));
  assert.equal(byPath('trees-32x48-v1.png').width/32,2);
  assert.equal(byPath('bushes-32x24-v1.png').width/32,4);
  assert.equal(byPath('props-32-v1.png').width/32,8);
  assert.equal(byPath('fish-shadows-32x16-v1.png').width/32,2);
  assert.equal(byPath('water-fx-32-v1.png').width/32,4);
  assert.equal(byPath('water-fx-32-v1.png').height/32,6);
  assert.equal(byPath('boat-starter-32-v2.png').width/32,4);
  assert.ok(read('src/presentation/AmbientFish.js').includes('phase'));
  assert.ok(read('src/presentation/LakeHud.js').includes('setScrollFactor(0)'));
});
test('display controls remain separate from game state and FX have A/B switches',()=>{
  assert.match(scene,/this\.ambientEnabled = params\.get\('ambient'\) !== '0'/);
  assert.match(scene,/this\.weatherEnabled = params\.get\('weather'\) !== '0'/);
  assert.match(scene,/this\.sim\.requestMove\(direction\)/);
  assert.match(shell, /data-dir="up"/);
});
