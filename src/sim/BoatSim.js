export class BoatSim {
  constructor({ x = 1100, y = 800, worldWidth = 2200, worldHeight = 1600 } = {}) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.radius = 24;
    this.reset(x, y);
  }

  reset(x = this.worldWidth / 2, y = this.worldHeight / 2) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.heading = 0;
    this.angularVelocity = 0;
  }

  step(input, dt, obstacles = []) {
    const throttle = Math.max(-1, Math.min(1, input.throttle || 0));
    const steer = Math.max(-1, Math.min(1, input.steer || 0));
    const fx = Math.sin(this.heading);
    const fy = -Math.cos(this.heading);
    const thrust = throttle >= 0 ? 250 : 155;

    this.vx += fx * throttle * thrust * dt;
    this.vy += fy * throttle * thrust * dt;

    const speed = Math.hypot(this.vx, this.vy);
    const steerAuthority = 0.35 + Math.min(1, speed / 95) * 0.65;
    this.angularVelocity += steer * 5.3 * steerAuthority * dt;

    const waterDrag = Math.exp(-1.55 * dt);
    const angularDrag = Math.exp(-3.6 * dt);
    this.vx *= waterDrag;
    this.vy *= waterDrag;
    this.angularVelocity *= angularDrag;

    const maxSpeed = 175;
    const afterDragSpeed = Math.hypot(this.vx, this.vy);
    if (afterDragSpeed > maxSpeed) {
      const k = maxSpeed / afterDragSpeed;
      this.vx *= k; this.vy *= k;
    }

    this.heading += this.angularVelocity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.resolveBounds();
    for (const obstacle of obstacles) this.resolveCircle(obstacle);
  }

  resolveBounds() {
    const r = this.radius;
    if (this.x < r) { this.x = r; this.vx = Math.abs(this.vx) * 0.25; }
    if (this.x > this.worldWidth - r) { this.x = this.worldWidth - r; this.vx = -Math.abs(this.vx) * 0.25; }
    if (this.y < r) { this.y = r; this.vy = Math.abs(this.vy) * 0.25; }
    if (this.y > this.worldHeight - r) { this.y = this.worldHeight - r; this.vy = -Math.abs(this.vy) * 0.25; }
  }

  resolveCircle(obstacle) {
    const dx = this.x - obstacle.x;
    const dy = this.y - obstacle.y;
    const minDistance = this.radius + obstacle.radius;
    const d2 = dx * dx + dy * dy;
    if (d2 >= minDistance * minDistance || d2 === 0) return;
    const d = Math.sqrt(d2);
    const nx = dx / d, ny = dy / d;
    this.x = obstacle.x + nx * minDistance;
    this.y = obstacle.y + ny * minDistance;
    const inward = this.vx * nx + this.vy * ny;
    if (inward < 0) {
      this.vx -= inward * nx * 1.35;
      this.vy -= inward * ny * 1.35;
    }
    this.vx *= 0.6; this.vy *= 0.6;
  }

  snapshot() {
    return {
      x: Number(this.x.toFixed(6)), y: Number(this.y.toFixed(6)),
      vx: Number(this.vx.toFixed(6)), vy: Number(this.vy.toFixed(6)),
      heading: Number(this.heading.toFixed(6)),
      angularVelocity: Number(this.angularVelocity.toFixed(6))
    };
  }
}
