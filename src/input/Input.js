const KEY_TO_DIR = new Map([
  ['KeyW','up'],['ArrowUp','up'],
  ['KeyS','down'],['ArrowDown','down'],
  ['KeyA','left'],['ArrowLeft','left'],
  ['KeyD','right'],['ArrowRight','right']
]);

export class UnifiedInput {
  constructor() {
    this.held = [];
    this.touchDir = null;

    addEventListener('keydown', (event) => {
      const dir = KEY_TO_DIR.get(event.code);
      if (!dir) return;
      event.preventDefault();
      this.held = this.held.filter(d => d !== dir);
      this.held.push(dir);
    }, { passive:false });

    addEventListener('keyup', (event) => {
      const dir = KEY_TO_DIR.get(event.code);
      if (!dir) return;
      event.preventDefault();
      this.held = this.held.filter(d => d !== dir);
    }, { passive:false });

    for (const button of document.querySelectorAll('[data-dir]')) {
      const dir = button.dataset.dir;
      const down = (event) => {
        event.preventDefault();
        this.touchDir = dir;
        button.classList.add('pressed');
        button.setPointerCapture?.(event.pointerId);
      };
      const up = (event) => {
        event.preventDefault();
        if (this.touchDir === dir) this.touchDir = null;
        button.classList.remove('pressed');
      };
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('pointerleave', (event) => {
        if (event.buttons === 0) up(event);
      });
    }
  }

  direction() {
    return this.touchDir ?? this.held[this.held.length - 1] ?? null;
  }
}
