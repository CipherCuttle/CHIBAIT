# CHIBAIT — TELEGRAM VIEWPORT CONTRACT v0.2

## Principle

Telegram Mini Apps do **not** have one fixed pixel dimension.

The game must treat the Telegram-provided viewport as runtime input. A fixed 240×160, 640×360 or 16:9 canvas is not the application contract.

Source-art dimensions (16 px tiles, 32×32 player, 64×64 encounter art) are independent from the CSS/display viewport.

## Telegram integration

At startup:

1. call `Telegram.WebApp.ready()`;
2. call `Telegram.WebApp.expand()`;
3. request fullscreen after the user's explicit Play action when supported;
4. listen for `viewportChanged`, `safeAreaChanged`, `contentSafeAreaChanged`, `fullscreenChanged`;
5. derive layout from the latest stable viewport and safe-area state.

Use `viewportStableHeight` for layout decisions rather than pinning controls to the fast-changing `viewportHeight`.

In fullscreen, account for both device safe areas and Telegram content-safe areas.

## Canvas

The **Telegram shell** fills the available viewport. The core Game Boy-style playfield is a fixed **160×144 internal render surface** displayed at the largest integer scale that fits inside the safe layout.

Recommended presentation architecture:

```text
Telegram viewport
└── responsive shell
    ├── HUD / touch controls
    └── 160×144 game surface
        ├── integer CSS scale (1×, 2×, 3×...)
        ├── integer-pixel camera
        └── fixed handheld composition
```

Do not stretch the world to fit a target aspect ratio.

The simulation stays in tile/world units. The 160×144 camera composition stays stable across desktop and mobile; extra browser space belongs to the shell/HUD rather than revealing substantially more world.

## Phaser

Use a fixed internal render surface:

```ts
new Phaser.Game({
  width: 160,
  height: 144,
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.NONE,
    width: 160,
    height: 144
  }
})
```

The surrounding DOM measures the Telegram/browser safe area and applies the **largest integer CSS scale** that fits.

On viewport/orientation changes:

- recalculate only the shell layout and integer display scale;
- keep Phaser's internal canvas at 160×144;
- keep camera scroll on integer pixels;
- do not reveal extra world merely because the desktop window is larger;
- never change simulation state or timing because the CSS viewport changed.

CHIBAIT does not use a stretched 16:9 game surface.

## Supported layout profiles

These are validation profiles, not Telegram guarantees:

| Profile | CSS viewport |
| --- | ---: |
| narrow portrait | 360×640 |
| tall portrait | 390×844 |
| compact landscape | 640×360 |
| wide landscape | 844×390 |
| desktop compact | 960×600 |
| desktop large | 1280×720 |

Minimum target safe content area:

- portrait: approximately 320×480 CSS px;
- landscape: approximately 480×320 CSS px.

If less space is available, show a compact compatibility state rather than allowing controls to overlap.

## Input modes

### Desktop / Telegram Desktop / Web

- WASD / arrows: cardinal tile movement;
- holding a direction chains discrete cell steps;
- mouse click changes facing in M1 and becomes casting aim/action later;
- touch HUD hidden.

### Touch

- four-direction D-pad: cardinal tile movement;
- separate action control reserved for cast / hook / reel;
- action hit areas target at least ~48 CSS px;
- controls remain inside content-safe insets.

Desktop keys and touch controls feed the same logical **direction/action intent**; neither input mode is allowed to bypass tile collision or movement timing.

## Orientation

Support **both portrait and landscape**.

Do not depend on forcing landscape. Telegram can request fullscreen and can lock the **current** orientation, but the game should remain playable before or without that lock.

Portrait and landscape may arrange shell/HUD/touch controls differently, but the core 160×144 game composition remains stable. Neither orientation changes simulation rules.

## Fullscreen

Fullscreen is preferred for active gameplay.

If fullscreen is unsupported or denied, remain playable in the normal expanded Mini App viewport.

The launch flow should therefore be:

```text
open Mini App
→ ready + expand
→ title / Play
→ user presses Play
→ request fullscreen when available
→ game begins
```

## Safe-area layout

World graphics can extend edge-to-edge.

Critical UI cannot.

Conceptually:

```ts
safeTop    = max(safeArea.top,    contentSafeArea.top)
safeRight  = max(safeArea.right,  contentSafeArea.right)
safeBottom = max(safeArea.bottom, contentSafeArea.bottom)
safeLeft   = max(safeArea.left,   contentSafeArea.left)
```

Use those values for HUD and touch-control placement.

## Vertical swipes

During active touch gameplay, Telegram's vertical swipe-to-minimize gesture may conflict with the virtual stick or reel gestures.

Disable vertical swipes only while the gameplay gesture requires it, and re-enable them in menus/pause screens.

## Screenshot acceptance matrix

Every frontend PR that touches camera/HUD/input should eventually capture at least:

- 360×640 touch;
- 640×360 touch;
- 960×600 keyboard/mouse.

Before public release, extend to the full six-profile matrix above.

No screenshot generated by an image model counts as evidence for viewport correctness.
