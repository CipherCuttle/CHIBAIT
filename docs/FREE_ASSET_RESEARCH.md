# CHIBAIT — Free Asset / Technique Research

This experiment deliberately avoids copying a random asset pack wholesale. The shipped Slopwater V2 textures are re-authored in CHIBAIT's own palette and generated locally at runtime.

## CC0 technique references

### 16×16 Shoreline Wave Animation Tiles — Eldiran

- Source: https://opengameart.org/content/16x16-shoreline-wave-animation-tiles
- License: CC0
- Useful idea adopted: small shoreline overlay animation, with phase offsets between neighboring shoreline tiles.
- Binary vendored: **no**
- CHIBAIT use: independently re-authored foam-edge cadence in `SlopwaterPresentation.drawFoam()`.

### Animated tree and water — abetusk / Matthew Weekes artwork

- Source: https://opengameart.org/content/animated-tree-and-water
- License: CC0
- Useful idea adopted: very small authored wind animation for vegetation instead of continuous deformation.
- Binary vendored: **no**
- CHIBAIT use: two-state reeds driven by deterministic gust strength.

### Animated Ocean Water Tile — POKOMOKO

- Source: https://opengameart.org/content/animated-ocean-water-tile
- License: CC0
- Useful idea adopted: sparse moving highlight clusters rather than a modern shader.
- Binary vendored: **no**
- CHIBAIT use: four-frame re-authored water/deep-water/glint cycles.

## Rule

Open-source/CC0 material may provide techniques, temporary assets, or infrastructure. Character, boat, monsters and final high-salience environment art stay CHIBAIT-authored so the game does not become an asset-pack collage.
