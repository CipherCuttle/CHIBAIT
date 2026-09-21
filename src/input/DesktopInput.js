export class DesktopInput {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys({
      up: 'W', down: 'S', left: 'A', right: 'D',
      up2: 'UP', down2: 'DOWN', left2: 'LEFT', right2: 'RIGHT', reset: 'R'
    });
    this.aimX = 0; this.aimY = -1;
    scene.input.on('pointermove', (p) => {
      const world = scene.cameras.main.getWorldPoint(p.x, p.y);
      const dx = world.x - scene.sim.x, dy = world.y - scene.sim.y;
      const len = Math.hypot(dx, dy) || 1;
      this.aimX = dx / len; this.aimY = dy / len;
    });
  }

  read() {
    const k = this.keys;
    const throttle = (k.up.isDown || k.up2.isDown ? 1 : 0) - (k.down.isDown || k.down2.isDown ? 1 : 0);
    const steer = (k.right.isDown || k.right2.isDown ? 1 : 0) - (k.left.isDown || k.left2.isDown ? 1 : 0);
    return { throttle, steer, aimX: this.aimX, aimY: this.aimY, action: false, reset: Phaser.Input.Keyboard.JustDown(k.reset) };
  }
}
