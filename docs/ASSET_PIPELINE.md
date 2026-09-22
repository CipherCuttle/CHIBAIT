# CHIBAIT — Asset Pipeline v1

**Status:** canonical for the M1 visual-target sprint.

## Goal

Move fast without accumulating opaque asset debt.

Every production-visible asset follows:

`REFERENCE → SOURCE/GENERATION → NORMALIZE → MANIFEST → VALIDATE → MAP/ATLAS → RENDERER → SCREENSHOT REVIEW`

Generated artwork is never promoted directly into runtime merely because it looks pixelated.

## Canonical directories

```text
assets/
  ASSET_MANIFEST.json
  maps/
  pixel/
    environment/
    foliage/
    player/
    boat/
    props/
  fx/
docs/
tools/
```

## Asset classes

### Environment tile
- logical cell: 16×16;
- hard alpha / hard pixels;
- no interpolation;
- palette-compatible with Slopwater;
- terrain transitions authored as reusable tiles, not baked screenshots.

### Overworld actor
- player: 32×32;
- boat: 32×32;
- feet/boat anchor must remain stable across frames.

### Foliage / props
- trees may exceed one cell visually but remain anchored to a 16×16 map cell;
- lower portion controls depth sorting/collision semantics;
- decoration does not imply collision unless the map's Collision layer says so.

### Water FX
- 32×32 logical frame;
- 4-frame strips by default;
- presentation-only;
- cannot encode catch/reward truth.

## Provenance law

Each committed runtime asset must appear in `assets/ASSET_MANIFEST.json` with:
- path;
- SHA-256;
- byte size;
- dimensions for PNGs.

Third-party binary assets may only be vendored when:
1. license is explicitly compatible;
2. exact source URL/version is recorded;
3. the binary is stored separately from CHIBAIT-authored assets;
4. attribution obligations, if any, are satisfied.

M1 v1 currently vendors **no third-party art binaries**. External CC0 packs remain references/optional source material.

## Vibecoding guardrails

A coding/image agent may rapidly propose or generate candidates, but it may not:
- silently change logical dimensions;
- add a new palette family;
- bake whole scenes into a background image;
- add collision from decoration automatically;
- introduce runtime dependencies for an effect Phaser already supports;
- overwrite an approved asset without updating manifest evidence.

## Acceptance command

```bash
npm run assets:check
```

The gate verifies hashes, PNG dimensions, required Tiled layers, one spawn, 16×16 map cells and the 384×256 visual target.
