export const TILE_SIZE = 16;
export const MAP_W = 32;
export const MAP_H = 24;

export const TILE = Object.freeze({
  WATER: 0,
  WATER_GLINT: 1,
  DEEP: 2,
  ROCK: 3,
  REEDS: 4,
  SHORE: 5,
  LILY: 6,
  DARK_ROCK: 7
});

const BLOCKED = new Set([TILE.ROCK, TILE.REEDS, TILE.SHORE, TILE.DARK_ROCK]);

function stamp(map, x0, y0, rows, tile) {
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] !== '#') continue;
      const gx = x0 + x, gy = y0 + y;
      if (gx >= 0 && gy >= 0 && gx < MAP_W && gy < MAP_H) map[gy][gx] = tile;
    }
  }
}

export function buildSlopwater() {
  const map = Array.from({ length: MAP_H }, (_, y) =>
    Array.from({ length: MAP_W }, (_, x) => {
      if ((x * 7 + y * 11) % 29 === 0) return TILE.WATER_GLINT;
      if ((x * 13 + y * 5) % 47 === 0) return TILE.LILY;
      return (x < 3 || x > MAP_W - 4 || y < 2 || y > MAP_H - 3) ? TILE.DEEP : TILE.WATER;
    })
  );

  stamp(map, 4, 3, [
    '..####..',
    '.######.',
    '########',
    '########',
    '.######.',
    '..####..'
  ], TILE.ROCK);

  stamp(map, 20, 4, [
    '..#####',
    '.######',
    '#######',
    '#######',
    '.######',
    '..####.'
  ], TILE.DARK_ROCK);

  stamp(map, 7, 16, [
    '.#####.',
    '#######',
    '#######',
    '.#####.'
  ], TILE.ROCK);

  stamp(map, 22, 15, [
    '..####..',
    '.######.',
    '########',
    '.######.',
    '..####..'
  ], TILE.ROCK);

  // reed banks
  for (const [x,y] of [[2,10],[3,10],[4,10],[27,9],[28,9],[29,9],[15,2],[16,2],[17,2],[18,20],[19,20]]) {
    map[y][x] = TILE.REEDS;
  }

  // Spawn clearing.
  for (let y = 10; y <= 14; y++) for (let x = 13; x <= 18; x++) {
    if (BLOCKED.has(map[y][x])) map[y][x] = TILE.WATER;
  }

  return map;
}

export class TileWorld {
  constructor(map = buildSlopwater()) {
    this.map = map;
    this.width = MAP_W;
    this.height = MAP_H;
  }

  tileAt(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return TILE.SHORE;
    return this.map[y][x];
  }

  isPassable(x, y) {
    return !BLOCKED.has(this.tileAt(x, y));
  }
}
