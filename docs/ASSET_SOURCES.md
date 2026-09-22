# CHIBAIT — External Asset/Tool Reference Register

These sources are approved **reference/bootstrap candidates**, not automatically approved runtime binaries.

## Tools

- Tiled — https://www.mapeditor.org/ — free/open source map editor; preferred M1 map authoring format.
- Pixelorama — https://github.com/Orama-Interactive/Pixelorama — MIT pixel-art editor.
- Phaser 3 — https://phaser.io/ — runtime; project currently pins the experimental preview to Phaser 3.90 via CDN.
- free-tex-packer-core — https://github.com/odrick/free-tex-packer-core — MIT atlas tooling candidate after assets stabilize.

## CC0 / free art references

- Mini Meadow — https://myobln.itch.io/game-assets — 16×16 terrain/water/shore reference.
- Puny World — https://merchant-shade.itch.io/16x16-puny-world — 16×16 terrain/foliage reference.
- Idylwild Foliage Pack — https://opengameart.org/content/idylwilds-foliage-pack — foliage reference.
- Pixel Art Lake Assets — https://opengameart.org/content/pixel-art-lake-assets — pond/dock/ripple reference.
- Water Pack — https://jeffzzq.itch.io/water-pack — water/ripple reference.
- Tiny Islands — https://majadroid.itch.io/tiny-islands-16x16-tilemap — coastline/harbor reference.
- Kenney Roguelike/RPG — https://kenney.nl/assets/roguelike-rpg-pack — CC0 fallback prop reference.
- Kenney UI Pixel Adventure — https://kenney.nl/assets/ui-pack-pixel-adventure — CC0 UI reference.
- Public-Pixel — https://santiagocrespo.itch.io/public-pixel-for-gbs — CC0 8×8 font candidate.

## M1 v1 vendoring decision

No third-party art binary is vendored in the canonical visual-target branch.

Reason: the approved target depends more on consistent palette, cluster style and shading direction than on asset quantity. Free packs are used as structure/timing references while CHIBAIT-authored normalized assets define the visible style.
