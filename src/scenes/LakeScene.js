import { BoatSim } from '../sim/BoatSim.js';
import { DesktopInput } from '../input/DesktopInput.js';
import { TouchControls } from '../input/TouchControls.js';
import { getSafeInsets, initTelegramViewport, requestTelegramFullscreenOnce } from '../telegram/viewport.js';

const WORLD_W = 2200, WORLD_H = 1600, FIXED_DT = 1 / 60;

export class LakeScene extends Phaser.Scene {
  constructor() { super('lake'); this.accumulator = 0; this.animClock = 0; }

  preload() {
    this.load.spritesheet('chibi48', './assets/pixel/player/player-overworld-48.png', { frameWidth:48, frameHeight:48 });
  }

  create() {
    this.sim = new BoatSim({ worldWidth:WORLD_W, worldHeight:WORLD_H });
    this.obstacles = [
      {x:460,y:430,radius:150}, {x:1690,y:480,radius:190}, {x:1600,y:1190,radius:145}, {x:700,y:1170,radius:115}
    ];
    this.drawLake();

    this.hull = this.add.graphics().setDepth(10);
    this.player = this.add.sprite(this.sim.x, this.sim.y - 22, 'chibi48', 1).setScale(2).setDepth(12);
    this.aim = this.add.graphics().setDepth(15);

    this.desktop = new DesktopInput(this);
    this.touch = new TouchControls(this);
    this.cameras.main.setBounds(0,0,WORLD_W,WORLD_H);
    this.cameras.main.startFollow(this.player, true, 0.10, 0.10);
    this.cameras.main.setBackgroundColor('#061018');

    this.scale.on('resize', () => this.onViewport());
    this.cleanupTelegram = initTelegramViewport(() => this.onViewport());
    this.input.once('pointerdown', () => requestTelegramFullscreenOnce());
    this.onViewport();
    this.events.once('shutdown', () => this.cleanupTelegram?.());
  }

  drawLake() {
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x0a2631, 1); g.fillRect(0,0,WORLD_W,WORLD_H);
    g.lineStyle(1,0x17414a,.28);
    for (let y=24;y<WORLD_H;y+=48) for (let x=(y/48)%2?12:34;x<WORLD_W;x+=96) g.lineBetween(x,y,x+22,y);
    for (const [i,o] of this.obstacles.entries()) {
      g.fillStyle(i%2?0x27372f:0x324136,1); g.fillCircle(o.x,o.y,o.radius+18);
      g.fillStyle(0x394837,1); g.fillCircle(o.x,o.y,o.radius);
      g.lineStyle(5,0x5e6b4f,.7); g.strokeCircle(o.x,o.y,o.radius-8);
    }
    g.lineStyle(14,0x26372d,1); g.strokeRect(6,6,WORLD_W-12,WORLD_H-12);
  }

  readInput() {
    const d = this.desktop.read();
    const t = this.touch.read();
    const touchActive = Math.abs(t.throttle) > .03 || Math.abs(t.steer) > .03;
    return {
      throttle: touchActive ? t.throttle : d.throttle,
      steer: touchActive ? t.steer : d.steer,
      aimX:d.aimX, aimY:d.aimY,
      reset:d.reset
    };
  }

  update(_time, deltaMs) {
    const input = this.readInput();
    if (input.reset) this.sim.reset();
    this.accumulator += Math.min(deltaMs, 100) / 1000;
    while (this.accumulator >= FIXED_DT) {
      this.sim.step(input, FIXED_DT, this.obstacles);
      this.accumulator -= FIXED_DT;
      this.animClock += FIXED_DT;
    }
    this.syncPresentation(input);
  }

  syncPresentation(input) {
    const s=this.sim;
    this.player.setPosition(Math.round(s.x), Math.round(s.y - 23));
    const speed=Math.hypot(s.vx,s.vy);
    const frame = this.frameForHeading(s.heading, speed > 14 && Math.floor(this.animClock*5)%2===1);
    this.player.setFrame(frame);

    this.hull.clear();
    this.hull.fillStyle(0x5a4b3c,1); this.hull.lineStyle(4,0x17191a,1);
    this.hull.save(); this.hull.translateCanvas(s.x,s.y+15); this.hull.rotateCanvas(s.heading); this.hull.fillEllipse(0,0,92,38); this.hull.strokeEllipse(0,0,92,38); this.hull.restore();
    const wake = Math.min(1,speed/120); if(wake>.08){this.hull.lineStyle(2,0x82cdd0,.32*wake);this.hull.lineBetween(s.x-25,s.y+35,s.x-45,s.y+55);this.hull.lineBetween(s.x+25,s.y+35,s.x+45,s.y+55)}

    this.aim.clear(); this.aim.lineStyle(2,0xeedd7f,.55); this.aim.lineBetween(s.x,s.y-10,s.x+input.aimX*62,s.y-10+input.aimY*62);
    this.updateDebug(speed);
  }

  frameForHeading(h, alt) {
    const twoPi=Math.PI*2; h=((h%twoPi)+twoPi)%twoPi;
    let dir;
    if (h < Math.PI/4 || h >= 7*Math.PI/4) dir=1;
    else if (h < 3*Math.PI/4) dir=3;
    else if (h < 5*Math.PI/4) dir=0;
    else dir=2;
    return dir + (alt ? 4 : 0);
  }

  onViewport() { this.touch?.layout(); }

  updateDebug(speed) {
    const el=document.getElementById('debug'); if(!el) return;
    const safe=getSafeInsets(); const mode=this.touch?.enabled?'TOUCH READY':'DESKTOP';
    el.textContent=`CHIBAIT / PLAYABLE_0A\n${this.scale.width}×${this.scale.height} · ${mode}\n48×48 SOURCE · ${speed.toFixed(0)} u/s\nsafe ${safe.left}/${safe.top}/${safe.right}/${safe.bottom}`;
  }
}
