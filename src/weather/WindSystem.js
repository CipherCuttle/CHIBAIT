export class WindSystem {
  constructor({ seed = 0xC11BA17 } = {}) {
    this.seed = seed >>> 0;
    this.streaks = this.buildStreaks(14);
  }

  sample(tick) {
    const slow = (Math.sin(tick / 83) + 1) * 0.5;
    const gust = Math.max(0, Math.sin((tick + 17) / 19));
    const strength = Math.min(1, 0.12 + slow * 0.22 + gust * gust * 0.58);
    return {
      direction: 'east',
      strength,
      reedFrame: strength > 0.55 ? 1 : 0,
      waterFrame: Math.floor(tick / 10) % 4,
      foamFrame: Math.floor(tick / 12) % 4
    };
  }

  buildStreaks(count) {
    let s = this.seed;
    const next = () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 0x100000000;
    };
    return Array.from({ length: count }, () => ({
      x: Math.floor(next() * 180) - 10,
      y: Math.floor(next() * 150) - 3,
      length: 2 + Math.floor(next() * 6),
      phase: Math.floor(next() * 120),
      threshold: 0.42 + next() * 0.38
    }));
  }
}
