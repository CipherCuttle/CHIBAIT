import { GridBoatSim, DIR } from '../sim/GridBoatSim.js';
import { TiledWorld } from '../world/TiledWorld.js';
import { WindSystem } from '../weather/WindSystem.js';
import { VisualWater } from '../presentation/VisualWater.js';
import { AmbientFish } from '../presentation/AmbientFish.js';
import { LakeHud } from '../presentation/LakeHud.js';

const VIEW_W = 384;
const VIEW_H = 256;
const TILE = 16;
const STEP_SECONDS = 1 / 60;
const ENTITIES = new Set(['tree', 'bush', 'rock', 'reeds', 'lily', 'prop', 'fish_shadow', 'spawn']);

export class LakeScene extends Phaser.Scene {
  constructor() {
    super('lake');
    this.accumulator = 0;
    this.visualTick = 0;
    const params = new URLSearchParams(location.search);
    this.debug = params.get('debug') === '1';
    this.weatherEnabled = params.get('weather') !== '0';
    this.ambientEnabled = params.get('ambient') !== '0';
    this.failedLoads = [];
    this.lastHudTick = -1;
    this.lastHudSteps = -1;
  }

  preload() {
    this.load.on('loaderror', file => this.failedLoads.push(file?.key ?? 'unknown'));
    this.load.tilemapTiledJSON('slopwater', './assets/maps/slopwater-v1.tmj');
    this.load.spritesheet('terrain', './assets/pixel/environment/chibait-terrain-16-v1.png', { frameWidth:TILE, frameHeight:TILE });
    this.load.spritesheet('trees', './assets/pixel/foliage/trees-32x48-v1.png', { frameWidth:32, frameHeight:48 });
    this.load.spritesheet('bushes', './assets/pixel/foliage/bushes-32x24-v1.png', { frameWidth:32, frameHeight:24 });
    this.load.spritesheet('props', './assets/pixel/props/props-32-v1.png', { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('fish', './assets/fx/fish-shadows-32x16-v1.png', { frameWidth:32, frameHeight:16 });
    this.load.spritesheet('water-fx', './assets/fx/water-fx-32-v1.png', { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('chibi', './assets/pixel/player/player-overworld-gb32.png', { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('boat', './assets/pixel/boat/boat-starter-32-v2.png', { frameWidth:32, frameHeight:32 });
  }

  fail(message) {
    console.error('CHIBAIT visual runtime:', message);
    this.add.rectangle(VIEW_W / 2, VIEW_H / 2, VIEW_W, VIEW_H, 0x07131c);
    this.add.text(12, 14, 'CHIBAIT / ASSET GATE', {
      fontFamily:'monospace', fontSize:'12px', color:'#f0daca'
    });
    this.add.text(12, 40, String(message).slice(0, 260), {
      fontFamily:'monospace', fontSize:'8px', color:'#ffad9c',
      wordWrap:{width:VIEW_W - 24}
    });
  }

  create() {
    if (this.failedLoads.length) { this.fail('Load failed: ' + this.failedLoads.join(', ')); return; }
    try { this.buildLake(); }
    catch (error) { this.fail(error?.message ?? error); }
  }

  buildLake() {
    const entry = this.cache.tilemap.get('slopwater');
    const tiled = entry?.data ?? entry;
    if (!tiled?.layers) throw Error('Tiled JSON missing or unreadable');

    this.worldModel = new TiledWorld(tiled);
    this.sim = new GridBoatSim(this.worldModel, {
      x:this.worldModel.spawnX,
      y:this.worldModel.spawnY
    });
    this.windSystem = new WindSystem({seed:0xC11BA17});
    this.weatherState = this.windSystem.sample(0);
    this.visual = new VisualWater(this, tiled, {
      enabled:this.weatherEnabled
    });
    const entities = tiled.layers.find(layer => layer.name === 'Entities')?.objects ?? [];
    if (entities.some(object => !ENTITIES.has(object.type))) throw Error('Unknown map entity');

    this.staticSprites = [];
    this.createEntities(entities);
    this.fish = new AmbientFish(this, entities, this.ambientEnabled);

    const p = this.sim.renderPosition();
    this.boat = this.add.sprite(p.x, p.y + 5, 'boat', 0).setDepth(280 + p.y);
    this.player = this.add.sprite(p.x, p.y - 7, 'chibi', 0).setDepth(300 + p.y);
    this.cameras.main.setBounds(0, 0, tiled.width * TILE, tiled.height * TILE);
    this.cameras.main.setRoundPixels(true);

    this.hud = new LakeHud(this, this.worldModel);
    if (this.debug) {
      this.debugText = this.add.text(139, 6, '', {
        fontFamily:'monospace', fontSize:'7px', color:'#e5d57c',
        backgroundColor:'#081015dd', padding:{x:2, y:1}
      }).setScrollFactor(0).setDepth(10000);
    }

    this.input.on('pointerdown', pointer => {
      if (pointer.event?.pointerType === 'touch' || this.sim.moving) return;
      // UI occupies the upper-left, lower-left and lower-right corners.
      if ((pointer.x < 130 && pointer.y < 62) ||
          (pointer.x < 167 && pointer.y > VIEW_H - 49) ||
          (pointer.x > VIEW_W - 94 && pointer.y > VIEW_H - 82)) return;
      const clicked = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const now = this.sim.renderPosition();
      const dx = clicked.x - now.x, dy = clicked.y - now.y;
      if (Math.abs(dx) > Math.abs(dy)) this.sim.face(dx < 0 ? 'left' : 'right');
      else this.sim.face(dy < 0 ? 'up' : 'down');
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.visual?.destroy();
      this.fish?.destroy();
      this.hud?.destroy();
    });
    this.syncPresentation();
    window.CHIBAIT_READY = true;
    window.CHIBAIT_SNAPSHOT = () => this.sim.snapshot();
  }

  createEntities(entities) {
    for (const object of entities) {
      if (object.type === 'spawn' || object.type === 'fish_shadow') continue;
      const variant = object.properties?.find(p => p.name === 'variant')?.value ?? 0;
      const frame = object.properties?.find(p => p.name === 'frame')?.value ?? 0;
      let texture, size, chosen;
      switch (object.type) {
        case 'tree': texture = 'trees'; size = 32; chosen = variant % 2; break;
        case 'bush': texture = 'bushes'; size = 32; chosen = variant % 4; break;
        case 'rock': texture = 'terrain'; size = 16; chosen = 30 + variant % 3; break;
        case 'lily': texture = 'terrain'; size = 16; chosen = 27 + variant % 3; break;
        case 'reeds': texture = 'terrain'; size = 16; chosen = 25 + variant % 2; break;
        case 'prop': texture = 'props'; size = 32; chosen = Math.max(0, Math.min(7, frame)); break;
        default: throw Error('Unsupported map entity: ' + object.type);
      }
      const isSurface = object.type === 'lily';
      const sprite = this.add.sprite(
        object.x + 8,
        object.y + (isSurface ? 8 : TILE),
        texture, chosen
      ).setOrigin(0.5, isSurface ? 0.5 : 1)
       .setDepth(isSurface ? 10 : 300 + object.y + TILE)
       .setName(object.name);
      if (object.type === 'reeds') this.reedSprites ??= [];
      if (object.type === 'reeds') this.reedSprites.push({sprite,frame:chosen,phase:variant % 2});
      this.staticSprites.push(sprite);
    }
  }

  update(_time, deltaMs) {
    if (!this.sim) return;
    this.accumulator += Math.min(deltaMs, 100) / 1000;
    while (this.accumulator >= STEP_SECONDS) {
      if (!this.sim.moving) {
        const direction = window.CHIBAIT_INPUT?.direction?.();
        if (direction) this.sim.requestMove(direction);
      }
      this.sim.step();
      this.visualTick++;
      this.weatherState = this.windSystem.sample(this.visualTick);
      this.accumulator -= STEP_SECONDS;
    }
    this.syncPresentation();
  }

  syncPresentation() {
    const p = this.sim.renderPosition();
    const frame = DIR[this.sim.facing].frame;
    const walkFrame = this.sim.moving && Math.floor(this.sim.tick / 3) % 2 ? frame + 4 : frame;
    this.boat.setPosition(p.x, p.y + 5).setFrame(frame).setDepth(280 + p.y);
    this.player.setPosition(p.x, p.y - 7).setFrame(walkFrame).setDepth(300 + p.y);

    this.visual.update(this.visualTick, this.weatherState, this.windSystem, {
      position:p, facing:this.sim.facing, moving:this.sim.moving
    });
    this.fish.update(this.visualTick);
    if (this.reedSprites && this.weatherEnabled) {
      const lean = this.weatherState.reedFrame;
      for (const {sprite,frame,phase} of this.reedSprites) {
        sprite.setFrame(25 + (frame - 25 + lean + phase) % 2);
      }
    }

    const worldW = this.worldModel.width * TILE;
    const worldH = this.worldModel.height * TILE;
    const sx = Phaser.Math.Clamp(Math.round(p.x - VIEW_W / 2), 0, Math.max(0, worldW - VIEW_W));
    const sy = Phaser.Math.Clamp(Math.round(p.y - VIEW_H / 2), 0, Math.max(0, worldH - VIEW_H));
    this.cameras.main.setScroll(sx, sy);

    if (this.sim.stepCount !== this.lastHudSteps || this.visualTick - this.lastHudTick >= 30) {
      this.hud.render(this.sim, this.weatherState, this.visualTick);
      this.lastHudSteps = this.sim.stepCount;
      this.lastHudTick = this.visualTick;
    }
    if (this.debugText) {
      this.debugText.setText([
        'grid ' + this.sim.x + ',' + this.sim.y + ' ' + this.sim.facing,
        'steps ' + this.sim.stepCount,
        'wind ' + this.weatherState.strength.toFixed(2)
      ]);
    }
  }
}
