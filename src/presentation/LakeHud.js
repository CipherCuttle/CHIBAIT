// Fixed-pixel in-canvas HUD. The responsive Telegram D-pad remains a separate DOM control.
const W = 384, H = 256;
export class LakeHud {
  constructor(scene, world) {
    this.world = world;
    this.g = scene.add.graphics().setScrollFactor(0).setDepth(9990);
    const txt = (x, y, str, size = 7, color = '#e7e7df') =>
      scene.add.text(x, y, str, {
        fontFamily: 'monospace', fontSize: size + 'px', color,
        resolution: 1, lineSpacing: 2
      }).setScrollFactor(0).setDepth(9992);
    this.name = txt(35, 8, 'CHIBAIT', 12, '#f3f1ea');
    this.subtitle = txt(35, 23, 'SLOPWATER  V1', 6, '#bdc8cd');
    this.weather = txt(35, 35, '', 7);
    this.time = txt(35, 47, '', 7, '#becdd0');
    this.controls = txt(8, H - 38, 'WASD / ARROWS     CLICK: FACE', 7);
    this.next = txt(8, H - 25, 'MOVE              FISH: SOON', 7, '#bacbc4');
    this.miniTitle = txt(W - 81, H - 71, 'LAKE MAP', 7);
    this.posText = txt(W - 81, H - 15, '', 6);
    this.portrait = scene.add.image(19, 29, 'chibi', 0)
      .setScrollFactor(0).setDepth(9991).setScale(0.75);
    this.render({ x:world.spawnX, y:world.spawnY, stepCount:0 }, { strength:0 }, 0);
  }

  panel(x, y, w, h) {
    this.g.fillStyle(0x070b10, 0.92).fillRect(x, y, w, h);
    this.g.lineStyle(1, 0xc4d0cd).strokeRect(x + 1, y + 1, w - 2, h - 2);
    this.g.lineStyle(1, 0x28383f).strokeRect(x + 3, y + 3, w - 6, h - 6);
  }

  render(player, weather, tick) {
    const g = this.g;
    g.clear();
    this.panel(4, 4, 123, 55);
    this.panel(4, H - 44, 158, 40);
    this.panel(W - 89, H - 78, 85, 74);
    this.weather.setText('SUN  WIND > ' + weather.strength.toFixed(1));
    this.time.setText('DAY 1   ' + String(12 + Math.floor(tick / 3600) % 12).padStart(2,'0') +
      ':' + String(Math.floor(tick / 60) % 60).padStart(2,'0'));
    this.posText.setText('X:' + String(player.x).padStart(2,'0') + ' Y:' + String(player.y).padStart(2,'0'));
    const mapX = W - 79, mapY = H - 59, cellW = 2, cellH = 1.7;
    for (let y = 0; y < this.world.height; y++) {
      for (let x = 0; x < this.world.width; x++) {
        g.fillStyle(this.world.isPassable(x,y) ? 0x32617a : 0x648c64, 1);
        g.fillRect(mapX + x*cellW, Math.round(mapY + y*cellH), cellW, 2);
      }
    }
    g.fillStyle(0xf7f2e9).fillRect(mapX + player.x*cellW-1, Math.round(mapY + player.y*cellH)-1, 4, 4);
  }

  destroy() { [this.g,this.name,this.subtitle,this.weather,this.time,this.controls,this.next,this.miniTitle,this.posText,this.portrait].forEach(x=>x.destroy()); }
}
