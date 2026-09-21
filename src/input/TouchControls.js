import { getSafeInsets } from '../telegram/viewport.js';

export class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.enabled = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    this.pointerId = null;
    this.base = { x: 0, y: 0 };
    this.knob = { x: 0, y: 0 };
    this.vec = { x: 0, y: 0 };
    this.radius = 54;
    this.graphics = scene.add.graphics().setScrollFactor(0).setDepth(1000);
    this.action = scene.add.text(0, 0, 'FISH\nSOON', { fontFamily:'monospace', fontSize:'11px', color:'#d8e5e4', align:'center' }).setOrigin(.5).setScrollFactor(0).setDepth(1001);
    this.layout();
    if (!this.enabled) { this.graphics.setVisible(false); this.action.setVisible(false); return; }
    scene.input.on('pointerdown', p => this.onDown(p));
    scene.input.on('pointermove', p => this.onMove(p));
    scene.input.on('pointerup', p => this.onUp(p));
    scene.scale.on('resize', () => this.layout());
  }

  layout() {
    const { width, height } = this.scene.scale;
    const safe = getSafeInsets();
    this.base.x = safe.left + 72;
    this.base.y = height - safe.bottom - 78;
    this.knob.x = this.base.x; this.knob.y = this.base.y;
    this.action.setPosition(width - safe.right - 72, height - safe.bottom - 78);
    this.draw();
  }

  onDown(p) {
    if (!this.enabled || this.pointerId !== null) return;
    if (p.x > this.scene.scale.width * 0.55) return;
    this.pointerId = p.id;
    this.updateVector(p.x, p.y);
  }
  onMove(p) { if (p.id === this.pointerId) this.updateVector(p.x, p.y); }
  onUp(p) {
    if (p.id !== this.pointerId) return;
    this.pointerId = null; this.vec.x = 0; this.vec.y = 0;
    this.knob.x = this.base.x; this.knob.y = this.base.y; this.draw();
  }
  updateVector(x, y) {
    let dx = x - this.base.x, dy = y - this.base.y;
    const d = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(this.radius, d);
    dx = dx / d * clamped; dy = dy / d * clamped;
    this.knob.x = this.base.x + dx; this.knob.y = this.base.y + dy;
    this.vec.x = dx / this.radius; this.vec.y = dy / this.radius;
    this.draw();
  }
  draw() {
    if (!this.graphics) return;
    const g = this.graphics; g.clear();
    g.lineStyle(2, 0x8ca6ad, 0.45); g.fillStyle(0x07141d, 0.32);
    g.fillCircle(this.base.x, this.base.y, this.radius); g.strokeCircle(this.base.x, this.base.y, this.radius);
    g.fillStyle(0x8c4682, 0.55); g.fillCircle(this.knob.x, this.knob.y, 22);
    const { width, height } = this.scene.scale; const safe = getSafeInsets();
    const ax = width - safe.right - 72, ay = height - safe.bottom - 78;
    g.lineStyle(2, 0xeedd7f, 0.38); g.fillStyle(0x07141d, 0.32); g.fillCircle(ax, ay, 46); g.strokeCircle(ax, ay, 46);
  }
  read() {
    if (!this.enabled) return { throttle:0, steer:0, action:false };
    return { throttle: Math.max(-1, Math.min(1, -this.vec.y)), steer: Math.max(-1, Math.min(1, this.vec.x)), action:false };
  }
}
