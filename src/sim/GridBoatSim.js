import { TILE_SIZE } from '../world/slopwater.js';

export const DIR = Object.freeze({
  down:  { dx: 0, dy: 1,  frame: 0 },
  up:    { dx: 0, dy:-1,  frame: 1 },
  left:  { dx:-1, dy: 0,  frame: 2 },
  right: { dx: 1, dy: 0,  frame: 3 }
});

export class GridBoatSim {
  constructor(world, { x = 16, y = 12, moveTicks = 8 } = {}) {
    this.world = world;
    this.moveTicks = moveTicks;
    this.x = x;
    this.y = y;
    this.fromX = x;
    this.fromY = y;
    this.toX = x;
    this.toY = y;
    this.facing = 'down';
    this.moving = false;
    this.tick = 0;
    this.stepCount = 0;
  }

  requestMove(direction) {
    if (!DIR[direction]) return false;
    this.facing = direction;
    if (this.moving) return false;

    const { dx, dy } = DIR[direction];
    const tx = this.x + dx;
    const ty = this.y + dy;
    if (!this.world.isPassable(tx, ty)) return false;

    this.fromX = this.x; this.fromY = this.y;
    this.toX = tx; this.toY = ty;
    this.tick = 0;
    this.moving = true;
    return true;
  }

  face(direction) {
    if (DIR[direction] && !this.moving) this.facing = direction;
  }

  step() {
    if (!this.moving) return false;
    this.tick += 1;
    if (this.tick >= this.moveTicks) {
      this.x = this.toX;
      this.y = this.toY;
      this.fromX = this.x;
      this.fromY = this.y;
      this.tick = 0;
      this.moving = false;
      this.stepCount += 1;
      return true;
    }
    return false;
  }

  renderPosition() {
    if (!this.moving) return this.centerOf(this.x, this.y);
    const t = this.tick / this.moveTicks;
    const a = this.centerOf(this.fromX, this.fromY);
    const b = this.centerOf(this.toX, this.toY);
    return {
      x: Math.round(a.x + (b.x - a.x) * t),
      y: Math.round(a.y + (b.y - a.y) * t)
    };
  }

  centerOf(x, y) {
    return { x: x * TILE_SIZE + TILE_SIZE / 2, y: y * TILE_SIZE + TILE_SIZE / 2 };
  }

  snapshot() {
    return {
      x: this.x, y: this.y,
      fromX: this.fromX, fromY: this.fromY,
      toX: this.toX, toY: this.toY,
      facing: this.facing,
      moving: this.moving,
      tick: this.tick,
      stepCount: this.stepCount
    };
  }
}
