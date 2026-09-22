// Map-authored fish shadows and cyclic ambient ripples. Purely cosmetic.
export class AmbientFish {
  constructor(scene, objects, enabled = true) {
    this.enabled = enabled;
    this.fish = objects.filter(o => o.type === 'fish_shadow').map((o, i) => {
      const phase = o.properties?.find(p => p.name === 'phase')?.value ?? i * 17;
      const x = o.x + 8, y = o.y + 8;
      const shadow = scene.add.sprite(x, y, 'fish', i % 2).setAlpha(0.32).setDepth(9);
      const ripple = scene.add.sprite(x, y - 2, 'water-fx', 0).setDepth(11).setVisible(false);
      return { x, y, phase, shadow, ripple };
    });
    if (!enabled) for (const f of this.fish) { f.shadow.setVisible(false); f.ripple.setVisible(false); }
  }

  update(tick) {
    if (!this.enabled) return;
    for (const f of this.fish) {
      const drift = Math.round(Math.sin((tick + f.phase) / 52) * 2);
      f.shadow.setPosition(f.x + drift, f.y).setFrame(Math.floor((tick + f.phase) / 20) % 2);
      // Different spawn periods prevent synchronized rings; at most two can appear onscreen.
      const time = (tick + f.phase * 3) % 240;
      if (time < 24) {
        f.ripple.setVisible(true).setPosition(f.x + drift, f.y - 2).setFrame(Math.min(3, Math.floor(time / 6)));
      } else f.ripple.setVisible(false);
    }
  }
  destroy() { for (const f of this.fish) { f.shadow.destroy(); f.ripple.destroy(); } }
}
