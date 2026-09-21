import { GridBoatSim, DIR } from '../sim/GridBoatSim.js';
import { TileWorld, buildSlopwater, TILE_SIZE, MAP_W, MAP_H } from '../world/slopwater.js';

const VIEW_W = 160;
const VIEW_H = 144;
const STEP_SECONDS = 1 / 60;

export class LakeScene extends Phaser.Scene {
  constructor() {
    super('lake');
    this.accumulator = 0;
    this.debug = new URLSearchParams(location.search).get('debug') === '1';
  }

  preload() {
    this.load.spritesheet('tiles', './assets/pixel/environment/world-tiles-16.png', { frameWidth:16, frameHeight:16 });
    this.load.spritesheet('chibi', './assets/pixel/player/player-overworld-gb32.png', { frameWidth:32, frameHeight:32 });
    this.load.spritesheet('boat', './assets/pixel/boat/boat-starter-gb32.png', { frameWidth:32, frameHeight:32 });
  }

  create() {
    const map = buildSlopwater();
    this.worldModel = new TileWorld(map);
    this.sim = new GridBoatSim(this.worldModel);

    for (let y=0; y<MAP_H; y++) for (let x=0; x<MAP_W; x++) {
      this.add.image(x*TILE_SIZE, y*TILE_SIZE, 'tiles', map[y][x]).setOrigin(0).setDepth(0);
    }

    const p = this.sim.renderPosition();
    this.boat = this.add.sprite(p.x, p.y + 5, 'boat', 0).setDepth(10);
    this.player = this.add.sprite(p.x, p.y - 7, 'chibi', 0).setDepth(11);

    this.cameras.main.setBounds(0,0,MAP_W*TILE_SIZE,MAP_H*TILE_SIZE);
    this.cameras.main.setRoundPixels(true);

    if (this.debug) this.debugText = this.add.text(2,2,'', {
      fontFamily:'monospace', fontSize:'6px', color:'#e5d57c',
      backgroundColor:'#00000099', padding:{x:2,y:1}
    }).setScrollFactor(0).setDepth(999);

    this.input.on('pointerdown', (pointer) => {
      if (pointer.event?.pointerType === 'touch') return;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const now = this.sim.renderPosition();
      const dx = worldPoint.x - now.x, dy = worldPoint.y - now.y;
      if (Math.abs(dx) > Math.abs(dy)) this.sim.face(dx < 0 ? 'left' : 'right');
      else this.sim.face(dy < 0 ? 'up' : 'down');
    });

    this.syncPresentation();
  }

  update(_time, deltaMs) {
    this.accumulator += Math.min(deltaMs, 100) / 1000;
    while (this.accumulator >= STEP_SECONDS) {
      if (!this.sim.moving) {
        const direction = window.CHIBAIT_INPUT?.direction?.();
        if (direction) this.sim.requestMove(direction);
      }
      this.sim.step();
      this.accumulator -= STEP_SECONDS;
    }
    this.syncPresentation();
  }

  syncPresentation() {
    const p = this.sim.renderPosition();
    const baseFrame = DIR[this.sim.facing].frame;
    const moveFrame = this.sim.moving && Math.floor(this.sim.tick / 3) % 2 ? baseFrame + 4 : baseFrame;

    this.boat.setPosition(p.x, p.y + 5).setFrame(baseFrame);
    this.player.setPosition(p.x, p.y - 7).setFrame(moveFrame);

    const worldW = MAP_W*TILE_SIZE, worldH = MAP_H*TILE_SIZE;
    const sx = Phaser.Math.Clamp(Math.round(p.x - VIEW_W/2), 0, Math.max(0, worldW - VIEW_W));
    const sy = Phaser.Math.Clamp(Math.round(p.y - VIEW_H/2), 0, Math.max(0, worldH - VIEW_H));
    this.cameras.main.setScroll(sx, sy);

    if (this.debugText) {
      this.debugText.setText([
        `${this.sim.x},${this.sim.y} ${this.sim.facing}`,
        `step ${this.sim.stepCount}`,
        `tile ${this.worldModel.tileAt(this.sim.x,this.sim.y)}`
      ]);
    }
  }
}
