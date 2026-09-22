# CHIBAIT — Visual Target 384×256 v1

## Reference intent

The approved target is a lush top-down pixel fishing lake with:
- detailed blue animated water;
- sand/foam shoreline transitions;
- dense trees/bushes/rocks/reeds/lilies;
- dock, buoy, sign and lantern props;
- fish shadows and surface rings;
- Chibi + boat as the focal point;
- HUD and minimap drawn inside the game composition.

The reference screenshot is 1536×1024, exactly **4×** a 384×256 logical surface.

## Contract

- internal render surface: **384×256**;
- tile cell: **16×16**;
- visible composition: 24×16 cells;
- simulation remains grid-based and deterministic;
- camera scroll uses integer world pixels;
- integer CSS scaling is preferred;
- narrow devices below 384 CSS px may use a fractional compatibility downscale rather than change simulation/camera rules.

## Important distinction

This is **not** a return to smooth physics.

The game keeps the accepted Pokémon-like movement semantics:
- cardinal direction;
- destination-cell passability;
- committed tile coordinates;
- fixed-step interpolation.

Only presentation density changes.

## Kill criteria

Stop before M2 fishing if:
- the real renderer still reads like programmer art;
- the Chibi is lost against the environment;
- foliage/shoreline styles look like mixed packs;
- HUD obscures navigation;
- narrow Telegram layouts become unusable.
