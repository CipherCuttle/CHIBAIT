# CHIBAIT — ART BIBLE v0.2

**Status:** canonical visual contract for the first sprite experiment  
**Canonical protagonist:** the owner's personal Chibi Hood character  
**Target:** Chibi Hood visual identity re-authored as pixel-native handheld-game art  
**Runtime viewport:** **responsive Telegram Mini App viewport — no single fixed application resolution**

**Art grid:** 16 px environment grid, 32×32 overworld protagonist source sprite, 64×64 encounter/catch source sprite.

See `TELEGRAM_VIEWPORT_CONTRACT.md` for the runtime sizing contract.

## 0. Objective

Do **not** pixelate or automatically shrink the source artwork and call it finished.

The target is:

> If this exact Chibi had originally been designed as the protagonist of a lost handheld fishing RPG, what would the artist have drawn?

The output must look native to a small-pixel game while remaining unmistakably the same Chibi.

## 1. Identity hierarchy

When pixels are scarce, preserve features in this order:

1. cat-ear + round hood silhouette;
2. large dark face aperture;
3. half-lidded deadpan eyes;
4. heavy black contour;
5. tiny neutral mouth;
6. silver liquid/chrome hood;
7. purple ear interior;
8. Earth chest emblem;
9. secondary rain/chrome detail.

If a lower-priority feature harms a higher-priority feature, remove the lower-priority feature.

## 2. Personality

Visual personality:

**deadpan · sleepy · cute · detached · slightly gloomy · quietly weird**

Avoid:

- manic kawaii;
- Disney-like facial acting;
- generic anime eyes;
- hyperactive mascot animation;
- gacha gloss;
- generic “crypto mascot” styling.

The character can perform an absurdly violent hook-set and immediately return to an unimpressed expression.

## 3. Canonical palette v0

These are game colors derived from the supplied reference and intentionally simplified.

| Role | Hex |
| --- | --- |
| Absolute ink | `#040204` |
| Soft outline | `#181519` |
| Face | `#252523` |
| Face shadow | `#332C2B` |
| Chrome dark | `#4E5556` |
| Chrome mid-dark | `#787474` |
| Chrome mid | `#8F8D8C` |
| Chrome light | `#B4B6B6` |
| Chrome highlight | `#CFCDC5` |
| Ear purple dark | `#6C3C68` |
| Ear purple | `#8C4682` |
| Eye white | `#FAFAED` |
| Earth deep blue | `#054368` |
| Earth blue | `#0F5F90` |
| Earth green | `#77C14F` |
| Earth sand | `#EEDD7F` |

### Sprite palette budgets

- 32×32 overworld Chibi: target **10–12 colors**
- 64×64 portrait/encounter Chibi: target **14–16 colors**

Do not preserve source micro-shading if it creates noisy near-duplicate colors.

## 4. Pixel grammar

### Allowed

- hard-edged pixel clusters;
- stepped curves;
- deliberate asymmetry;
- one-pixel highlights;
- chunky shapes;
- selective texture;
- controlled one-pixel motion;
- smear frames for fast actions;
- palette/cluster cycling for surreal materials.

### Forbidden

- antialiased sprite edges;
- blurred resampling;
- smooth gradients inside production sprites;
- arbitrary semi-transparent body pixels;
- inconsistent pseudo-pixel sizes;
- large clouds of single-pixel noise;
- texture crossing and obscuring the eyes;
- anatomy drifting between animation frames;
- variable outline thickness without an intentional pose reason.

Runtime rule: nearest-neighbor filtering, integer positioning, integer scaling.

## 5. Canonical 64×64 portrait

Canvas: **64×64 transparent**.

Approximate occupied bounds:

- x: 5–58
- y: 2–62

The hood/head is intentionally huge relative to the torso.

### Face aperture

Approximate target:

- width: 29–32 px
- height: 21–24 px

It must read as a **dark face opening framed by the hood**, not a normal exposed skin-colored head.

### Eyes

The eyes are silhouette-level identity.

They must remain:

- half-lidded;
- horizontal;
- bright against the face;
- unimpressed.

Never “improve” them into large round anime eyes.

### Mouth

Normal mouth is only **1–3 pixels**. Expression comes mostly from eyes, pose, ears and body motion.

### Cat ears

At 64×64:

- approximately 9–11 px tall;
- approximately 8–10 px wide;
- dark outer contour;
- purple interior;
- slightly irregular/furry inner edge.

The ears may be slightly exaggerated relative to the source to survive low resolution.

## 6. Silver liquid hood

Do not shrink the original marble texture.

Re-author it as a small number of deliberate chrome islands.

### 32×32

- roughly 8–12 visible texture clusters maximum;
- each cluster should generally contain 2–6 pixels;
- no one-pixel confetti field.

### 64×64

More complex clusters are allowed but still obey one coherent material system.

### Lighting law

Primary apparent light comes from **upper-left/front**.

The material can behave surreally, but every frame should still feel lit by the same world.

## 7. Earth emblem

The Earth is a strong accent but not the character's center of mass.

- 64×64: roughly 9×9 to 11×11 px
- 32×32: roughly 5×5 px

Geographic accuracy is not required. It must immediately read as a tiny Earth.

## 8. Canonical 32×32 overworld sprite

This is separately authored. It is **not** a resized 64×64 sprite.

Canvas: **32×32 transparent**.

Preserve:

- cat ears;
- rounded silver hood;
- black/dark face opening;
- deadpan eyes;
- tiny mouth when readable;
- Earth emblem;
- tiny feet/body.

Remove or simplify:

- secondary chrome swirls;
- subtle face shading;
- clothing folds;
- detailed continents;
- any texture that competes with face readability.

## 9. Runtime viewport contract

The **application is not 240×160**. Telegram controls the available viewport and can change it at runtime.

The game canvas fills the actual available Mini App viewport. World composition and camera framing adapt to the current aspect ratio.

The 32×32 and 64×64 values in this document are **source-asset grids**, not CSS/display sizes.

Reference validation profiles:

- 360×640 CSS px — narrow portrait phone;
- 390×844 CSS px — tall portrait phone;
- 640×360 CSS px — compact landscape phone;
- 844×390 CSS px — wide landscape phone;
- 960×600 CSS px — desktop/web compact;
- 1280×720 CSS px — desktop/web large.

The game must remain playable down to approximately:

- **320×480 CSS px** portrait safe content;
- **480×320 CSS px** landscape safe content.

Never position critical HUD or touch controls against raw screen edges. Respect Telegram's system and content safe-area insets.

The world background may bleed edge-to-edge. Controls, text and gameplay-critical UI stay inside the safe content rectangle.

## 10. Boat + camera

Starter boat target: **48×32** or **64×32**, chosen by playtest readability.

The Chibi should remain visible from approximately chest/waist upward.

Exploration camera: **top-down 3/4**, not pure top-down. The player must still recognize ears, face and Earth emblem while navigating.

The boat needs:

- an obvious bow;
- asymmetric stern;
- wake;
- directional water disturbance.

Boat direction should be legible almost instantly.

## 11. Animation language

Engine simulation can run at 60 Hz. Character artwork should use low frame counts and strong key poses.

### Idle

Target: **4 frames**.

Subtle body settle, ear lag, chrome shift. Do not make the character constantly bounce.

### Cast

Target: **6 frames**:

1. neutral;
2. rod raise;
3. backswing;
4. cast smear;
5. extension;
6. settle.

### Hook-smack

Target: **7 frames**:

1. neutral;
2. anticipation;
3. stronger anticipation;
4. huge rod smear;
5. impact;
6. recoil;
7. immediate deadpan recovery.

The hook-set is a signature beat: sleepy tiny creature → ridiculous violent rod strike → sleepy tiny creature again.

### Squash/stretch

Normal maximum:

- 32×32: ±1 px
- 64×64: ±2 px

One deliberate impact/smear frame may break the normal limit.

### Secondary motion

Cat ears lag the main body by about one animation beat during strong actions.

## 12. Animation invariants

Across ordinary frames:

- face center stable ±1 px;
- eye spacing stable;
- ear roots stable ±1 px;
- hood width stable ±1 px;
- Earth emblem center stable ±1 px;
- feet baseline stable unless jumping/recoiling intentionally.

If one frame suddenly has a different face, ear length, shoulder width or emblem geometry, reject it.

## 13. Rain and atmosphere

Rain belongs to world/presentation layers, not the character spritesheet.

Use background, midground and foreground streak classes with distinct lengths and speeds.

This allows weather variation and prevents animation sheets from baking in unnecessary effects.

## 14. World palette direction

The player's silver must separate from the lake.

Lake:

- deep navy;
- blue-black;
- desaturated teal;
- dark violet;
- sparse cyan highlights.

Shore:

- muted olive;
- brown;
- purple-gray.

Atmosphere:

**midnight · rain · still water · moonlight · chrome · tiny boat · weird creatures · cozy melancholy · absurdity**

Not horror. Not neon cyberpunk soup. Not bright Pokémon imitation.

## 15. Monster relationship

Creatures share the world grammar without all becoming Chibis.

Shared principles:

- chunky readable silhouette;
- heavy dark contour;
- expressive/high-priority eyes;
- tiny limbs/fins where useful;
- limited palette;
- one memorable visual gimmick.

A creature should first work as a silhouette, then receive detail.

Recommended sizes:

- exploration shadow: 8×8 → 24×24
- encounter sprite: 32×32 / 48×48
- catch reveal: 64×64

## 16. Effects budget

Exploration stays restrained: rain, wake, tiny water sparkle, subtle chrome shift.

Bite adds: `!`, bobber splash, small camera emphasis.

Hook adds: rod smear, larger splash, short impact flash, small camera bump.

Rare/legendary catches earn increasingly loud effects.

Do not spend legendary presentation budget on ordinary movement.

## 17. UI

UI may look pixel-native while retaining modern usability.

Use:

- stepped/hard-edged frames;
- 1–2 px logical borders;
- small bitmap icons;
- limited palette.

Do not use tiny physical tap targets. Pixel styling is not an excuse for inaccessible controls.

## 18. Asset naming

Examples:

```text
player/chibi-player-idle-32.png
player/chibi-player-idle-64.png
player/chibi-player-cast-32.png
player/chibi-player-hook-32.png
player/chibi-player-victory-32.png

boat/boat-starter-idle.png
boat/boat-starter-move.png

fx/rain-near.png
fx/rain-mid.png
fx/water-splash-small.png
fx/water-splash-hook.png
```

Never use `final2.png`, `good-one.png`, or similar untraceable names.

## 19. AI source hierarchy

When generating or revising protagonist assets:

1. canonical owner-provided Chibi source;
2. approved 64×64 pixel master;
3. approved 32×32 overworld master;
4. this art bible.

Once a pixel master is approved, a new generation may not redesign it merely because the source artwork allows another interpretation.

## 20. AI rejection conditions

Reject if:

- ears disappear or radically change;
- face becomes normal skin rather than a dark aperture;
- eyes become generic round/kawaii eyes;
- default mouth becomes highly expressive;
- silver becomes ordinary white cloth;
- liquid texture becomes random noise;
- Earth disappears without a documented low-resolution reason;
- antialiasing becomes part of the sprite;
- logical pixel sizes are inconsistent;
- anatomy drifts frame-to-frame;
- the result reads as generic Pokémon fan art;
- it only looks good when enlarged.

## 21. First art gate

No production monster set, boat catalogue, biome set or progression art is authorized until these agree visually:

A. 64×64 canonical portrait  
B. 32×32 overworld protagonist  
C. 4-frame idle  
D. 7-frame hook-smack  
E. starter boat  
F. the approved assets assembled in the real responsive game shell at portrait, landscape and desktop viewport profiles

Final recognition test:

> Remove the logo and game name. At native game scale, the owner/HoneySlop should immediately recognize the player as this exact Chibi rather than merely “a cute pixel character.”
