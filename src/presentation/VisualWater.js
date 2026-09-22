// Presentation-only. No random calls and no authority over TileWorld/loot.
const TICK_MS = 1000 / 60;

export class VisualWater {
  constructor(scene, tiled, map, { enabled = true } = {}) {
    this.scene = scene;
    this.enabled = enabled;
    this.width = map.width;
    this.height = map.height;
    this.cells = tiled.layers.find(l => l.name === 'Water').data.map((gid, i) => ({
      x: i % map.width, y: Math.floor(i / map.width), base: gid,
      phase: (i % map.width + 2 * Math.floor(i / map.width)) % 4
    }));
    this.water = scene.make.tilemap({ key: 'slopwater' });
    const atlas = this.water.addTilesetImage('chibait-terrain-16-v1', 'terrain', 16, 16, 0, 0);
    if (!atlas) throw Error('Tiled tileset name does not match terrain atlas');
    this.waterLayer = this.water.createLayer('Water', atlas, 0, 0).setDepth(0);
    this.shoreLayer = this.water.createLayer('Shore', atlas, 0, 0).setDepth(4);
    this.foam = scene.add.graphics().setDepth(5);
    this.wind = scene.add.graphics().setScrollFactor(0).setDepth(8);
    this.wake = scene.add.graphics().setDepth(22);
    this.lastWaterFrame = -1;
    this.lastFoamFrame = -1;
  }

  update(tick, state, windSystem, boat) {
    if (this.enabled && state.waterFrame !== this.lastWaterFrame) {
      // Three authored four-frame water variants: GIDs 1–4, 5–8, 9–12.
      for (const cell of this.cells) {
        const frame = (state.waterFrame + cell.phase) % 4;
        const gid = cell.base + frame;
        this.waterLayer.putTileAt(gid, cell.x, cell.y, false);
      }
      this.lastWaterFrame = state.waterFrame;
    }
    if (this.enabled && state.foamFrame !== this.lastFoamFrame) {
      this.drawFoam(state.foamFrame);
      this.lastFoamFrame = state.foamFrame;
    }
    if (this.enabled) this.drawWind(state, windSystem, tick);
    else this.wind.clear();
    this.drawWake(boat);
  }

  drawFoam(frame) {
    const g = this.foam;
    g.clear().fillStyle(0xb2c9bb, 0.67);
    const shore = this.shoreLayer.layer.data;
    const landAt = (x, y) => x >= 0 && y >= 0 && x < this.width && y < this.height &&
      shore[y][x] && shore[y][x].index > 0;
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        if (landAt(x, y)) continue;
        const px = x * 16, py = y * 16, phase = (x + y * 3 + frame) % 5;
        if (landAt(x, y - 1)) g.fillRect(px + phase + 1, py, 7, 1);
        if (landAt(x, y + 1)) g.fillRect(px + 8 - phase, py + 15, 7, 1);
        if (landAt(x - 1, y)) g.fillRect(px, py + phase + 1, 1, 7);
        if (landAt(x + 1, y)) g.fillRect(px + 15, py + 8 - phase, 1, 7);
      }
    }
  }

  drawWind(state, windSystem, tick) {
    const g = this.wind;
    g.clear();
    if (state.strength < 0.42) return;
    g.fillStyle(0xd0e1d5, Math.min(0.35, state.strength * 0.27));
    for (const s of windSystem.streaks) {
      if (state.strength < s.threshold) continue;
      const x = Math.floor((((s.x + s.phase) * 2.4 + tick * (0.5 + state.strength)) % 418 + 418) % 418) - 15;
      const y = Math.floor((s.y + 3) * 1.7);
      g.fillRect(x, y, s.length, 1);
    }
  }

  drawWake(boat) {
    const g = this.wake;
    g.clear();
    if (!boat.moving) return;
    const { x, y } = boat.position;
    g.fillStyle(0xa1c9cf, 0.68);
    const horizontal = boat.facing === 'left' || boat.facing === 'right';
    const sign = (boat.facing === 'up' || boat.facing === 'left') ? 1 : -1;
    if (horizontal) {
      g.fillRect(x + 17 * sign, y - 7, 1, 5);
      g.fillRect(x + 17 * sign, y + 3, 1, 5);
      g.fillRect(x + 20 * sign, y - 10, 1, 4);
      g.fillRect(x + 20 * sign, y + 6, 1, 4);
    } else {
      g.fillRect(x - 8, y + 17 * sign, 5, 1);
      g.fillRect(x + 3, y + 17 * sign, 5, 1);
      g.fillRect(x - 11, y + 20 * sign, 4, 1);
      g.fillRect(x + 7, y + 20 * sign, 4, 1);
    }
  }

  destroy() {
    this.waterLayer?.destroy();
    this.shoreLayer?.destroy();
    this.foam?.destroy();
    this.wind?.destroy();
    this.wake?.destroy();
  }
}
