import { TILE, TILE_SIZE, MAP_W, MAP_H } from '../world/slopwater.js';

const WATERLIKE = new Set([TILE.WATER, TILE.WATER_GLINT, TILE.DEEP, TILE.LILY]);
const SHORELIKE = new Set([TILE.ROCK, TILE.DARK_ROCK, TILE.SHORE]);

function canvasTexture(scene, key, painter) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const texture = scene.textures.createCanvas(key, TILE_SIZE, TILE_SIZE);
  const ctx = texture.getContext();
  ctx.imageSmoothingEnabled = false;
  painter(ctx);
  texture.refresh();
}

function waterPainter(base, accent, frame, glint = false) {
  return (ctx) => {
    ctx.clearRect(0, 0, 16, 16);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 16, 16);

    ctx.fillStyle = accent;
    const a = (frame * 3 + 1) % 12;
    const b = (frame * 5 + 7) % 13;
    ctx.fillRect(a, 4, 4, 1);
    ctx.fillRect(b, 11, 3, 1);

    ctx.fillStyle = '#123a45';
    ctx.fillRect((frame * 4 + 5) % 13, 7, 3, 1);

    if (glint) {
      ctx.fillStyle = '#79b8b5';
      ctx.fillRect((frame * 2 + 2) % 11, 2, 5, 1);
    }
  };
}

export function createSlopwaterTextures(scene) {
  for (let frame = 0; frame < 4; frame++) {
    canvasTexture(scene, `slop-water-${frame}`, waterPainter('#0a2631', '#19505a', frame));
    canvasTexture(scene, `slop-glint-${frame}`, waterPainter('#0b2934', '#23616a', frame, true));
    canvasTexture(scene, `slop-deep-${frame}`, waterPainter('#071b26', '#103844', frame));

    canvasTexture(scene, `slop-lily-${frame}`, (ctx) => {
      waterPainter('#0a2631', '#19505a', frame)(ctx);
      ctx.fillStyle = '#304f3b';
      ctx.fillRect(5, 6, 6, 4);
      ctx.fillStyle = '#5d7450';
      ctx.fillRect(6, 6, 3, 1);
      ctx.fillRect(9, 7, 2, 1);
      ctx.fillStyle = '#0a2631';
      ctx.fillRect(9, 9, 2, 1);
    });
  }

  for (let frame = 0; frame < 2; frame++) {
    canvasTexture(scene, `slop-reeds-${frame}`, (ctx) => {
      waterPainter('#0a2631', '#16424c', frame)(ctx);
      const lean = frame;
      ctx.fillStyle = '#253b2f';
      ctx.fillRect(3, 6, 2, 9);
      ctx.fillRect(8, 4, 2, 11);
      ctx.fillRect(12, 7, 2, 8);
      ctx.fillStyle = '#617252';
      ctx.fillRect(4 + lean, 3, 1, 8);
      ctx.fillRect(9 + lean, 1, 1, 10);
      ctx.fillRect(13 + lean, 4, 1, 9);
      ctx.fillStyle = '#899064';
      ctx.fillRect(5 + lean, 5, 1, 3);
      ctx.fillRect(10 + lean, 3, 1, 3);
    });
  }
}

export class SlopwaterPresentation {
  constructor(scene, map, { enabled = true } = {}) {
    this.scene = scene;
    this.map = map;
    this.enabled = enabled;
    this.waterSprites = [];
    this.reedSprites = [];
    this.lastWaterFrame = -1;
    this.lastReedFrame = -1;
    this.lastFoamFrame = -1;

    createSlopwaterTextures(scene);

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const tile = map[y][x];
        if (!WATERLIKE.has(tile) && tile !== TILE.REEDS) continue;

        let key = 'slop-water-0';
        if (tile === TILE.DEEP) key = 'slop-deep-0';
        if (tile === TILE.WATER_GLINT) key = 'slop-glint-0';
        if (tile === TILE.LILY) key = 'slop-lily-0';
        if (tile === TILE.REEDS) key = 'slop-reeds-0';

        const sprite = scene.add.image(x * TILE_SIZE, y * TILE_SIZE, key).setOrigin(0).setDepth(1);
        if (tile === TILE.REEDS) this.reedSprites.push({ sprite, x, y });
        else this.waterSprites.push({ sprite, tile, phase:(x + y * 2) % 4 });
      }
    }

    this.foam = scene.add.graphics().setDepth(3);
    this.wind = scene.add.graphics().setScrollFactor(0).setDepth(8);
    this.wake = scene.add.graphics().setDepth(9);
  }

  update(state, windSystem, tick, boat) {
    if (!this.enabled) {
      this.wind.clear();
      this.foam.clear();
      this.wake.clear();
      return;
    }

    if (state.waterFrame !== this.lastWaterFrame) {
      for (const cell of this.waterSprites) {
        const frame = (state.waterFrame + cell.phase) % 4;
        let key = `slop-water-${frame}`;
        if (cell.tile === TILE.DEEP) key = `slop-deep-${frame}`;
        if (cell.tile === TILE.WATER_GLINT) key = `slop-glint-${frame}`;
        if (cell.tile === TILE.LILY) key = `slop-lily-${frame}`;
        cell.sprite.setTexture(key);
      }
      this.lastWaterFrame = state.waterFrame;
    }

    if (state.reedFrame !== this.lastReedFrame) {
      for (const cell of this.reedSprites) cell.sprite.setTexture(`slop-reeds-${state.reedFrame}`);
      this.lastReedFrame = state.reedFrame;
    }

    if (state.foamFrame !== this.lastFoamFrame) {
      this.drawFoam(state.foamFrame);
      this.lastFoamFrame = state.foamFrame;
    }

    this.drawWind(state, windSystem, tick);
    this.drawWake(boat);
  }

  drawFoam(frame) {
    const g = this.foam;
    g.clear();
    g.fillStyle(0x9bc2bd, 0.72);

    const waterAt = (x, y) => {
      if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return false;
      const t = this.map[y][x];
      return WATERLIKE.has(t) || t === TILE.REEDS;
    };

    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        if (!SHORELIKE.has(this.map[y][x])) continue;
        const px = x * 16, py = y * 16;
        const stagger = (x + y + frame) % 4;
        if (waterAt(x, y - 1)) {
          g.fillRect(px + 2 + stagger, py, 6, 1);
          if (frame % 2) g.fillRect(px + 10, py + 1, 3, 1);
        }
        if (waterAt(x, y + 1)) {
          g.fillRect(px + 7 - stagger, py + 15, 6, 1);
          if (frame % 2 === 0) g.fillRect(px + 2, py + 14, 3, 1);
        }
        if (waterAt(x - 1, y)) {
          g.fillRect(px, py + 2 + stagger, 1, 6);
          if (frame % 2) g.fillRect(px + 1, py + 10, 1, 3);
        }
        if (waterAt(x + 1, y)) {
          g.fillRect(px + 15, py + 7 - stagger, 1, 6);
          if (frame % 2 === 0) g.fillRect(px + 14, py + 2, 1, 3);
        }
      }
    }
  }

  drawWind(state, windSystem, tick) {
    const g = this.wind;
    g.clear();
    if (state.strength < 0.38) return;
    g.fillStyle(0xb4d0cc, Math.min(0.38, state.strength * 0.32));

    for (const streak of windSystem.streaks) {
      if (state.strength < streak.threshold) continue;
      const x = ((streak.x + tick * (0.35 + state.strength * 0.55) + streak.phase) % 190) - 15;
      const y = streak.y + ((streak.phase + tick) % 37 === 0 ? 1 : 0);
      g.fillRect(Math.floor(x), y, streak.length, 1);
      if (state.strength > 0.76 && streak.length > 5) g.fillRect(Math.floor(x) + 2, y - 1, streak.length - 3, 1);
    }
  }

  drawWake(boat) {
    const g = this.wake;
    g.clear();
    if (!boat.moving) return;

    const p = boat.position;
    const dir = boat.facing;
    g.fillStyle(0x85b8b5, 0.5);

    if (dir === 'up' || dir === 'down') {
      const sign = dir === 'up' ? 1 : -1;
      const y = p.y + sign * 17;
      g.fillRect(p.x - 9, y, 5, 1);
      g.fillRect(p.x + 5, y, 5, 1);
      g.fillRect(p.x - 12, y + sign * 3, 4, 1);
      g.fillRect(p.x + 8, y + sign * 3, 4, 1);
    } else {
      const sign = dir === 'left' ? 1 : -1;
      const x = p.x + sign * 17;
      g.fillRect(x, p.y - 9, 1, 5);
      g.fillRect(x, p.y + 5, 1, 5);
      g.fillRect(x + sign * 3, p.y - 12, 1, 4);
      g.fillRect(x + sign * 3, p.y + 8, 1, 4);
    }
  }
}
