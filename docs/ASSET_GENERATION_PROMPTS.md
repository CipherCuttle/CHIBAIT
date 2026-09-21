# CHIBAIT — ASSET GENERATION PROMPT PACK v0.1

This file defines the first controlled image-generation sequence.

## 0. Rules

The canonical source is the owner's personal Chibi Hood character described by `assets/source/references/SOURCE_MANIFEST.json`.

Do not ask an image model to invent the character from prose when the canonical reference image is available.

**Generation order is gated:**

1. generate candidate 64×64 logical master;
2. review and approve;
3. derive 32×32 overworld sprite from the approved master;
4. review and approve;
5. derive animation strips from the approved sprite;
6. only then make the boat/lake scene.

Never independently generate every animation frame. Use the approved sprite as the visual anchor and request the complete strip together.

Image models may output a larger raster. The requested resolution below refers to the **logical pixel grid**. The final asset must be normalized to that grid with hard edges and nearest-neighbor scaling.

## 1. Shared character description

Use this block in every protagonist generation.

> Preserve the supplied Chibi Hood character's identity exactly: a large round silver liquid-metal/marbled hood, two pointed cat ears with purple inner ears, a very large dark charcoal circular face opening framed by a thick near-black contour, sleepy half-lidded horizontal white eyes, a tiny neutral mouth, tiny rounded hands and feet, and a small Earth/globe emblem centered on the chest. Personality is deadpan, sleepy, cute, detached and slightly gloomy. Do not make the eyes round or anime-like. Do not add a smile. Do not turn the chrome hood into normal cloth.

## 2. Prompt A — canonical 64×64 logical portrait

### Goal

Create the single master pixel interpretation from which later game assets are derived.

### Prompt

> Use the attached canonical Chibi reference as the identity source.
>
> Re-author this exact character as authentic pixel-native handheld RPG art on a **64×64 logical pixel transparent canvas**. This is not a filter and not a simple downscale.
>
> Preserve the exact identity hierarchy: pointed cat-ear silhouette, oversized round silver hood, dark circular face aperture, sleepy half-lidded white eyes, tiny neutral mouth, purple ear interiors, and centered Earth emblem.
>
> Use deliberate hard-edged pixel clusters and a restrained 14–16 color sprite palette. Translate the silver marbled/liquid hood into a small number of large chrome clusters with upper-left/front lighting; do not reproduce source microtexture as noise. Use a strong dark contour around the face and outer silhouette. The Earth emblem may be slightly enlarged for readability.
>
> Front-facing neutral canonical pose. Tiny body, oversized hood/head. No environment. No rain baked into the sprite. Transparent background.
>
> The visual result should feel like a professionally hand-authored late-Game-Boy-Color / early-GBA character, while remaining unmistakably the supplied Chibi Hood character.
>
> Every visible mark must align to one uniform logical pixel grid. No antialiasing, no smooth gradients, no soft brushwork, no vector curves, no subpixel texture, no text, no UI, no border around the canvas.

### Reject if

- the eyes become round;
- the silver hood becomes plain white;
- the Earth emblem dominates the body;
- the model adds a grin;
- the face aperture becomes skin;
- the ears shrink away;
- pixel sizes vary.

## 3. Prompt B — 32×32 overworld player

**Only use after Prompt A has an approved result. Supply the approved 64×64 master as the primary visual reference.**

### Prompt

> Using the approved CHIBAIT 64×64 canonical pixel master as the authoritative character reference, create a separately authored **32×32 logical pixel overworld sprite** for a top-down 3/4 handheld RPG.
>
> Do not merely resize the 64×64 sprite. Preserve recognition using fewer shapes.
>
> The cat ears, silver rounded hood, dark face opening, sleepy horizontal eyes, purple ear interiors and tiny Earth chest emblem must remain readable at native size. Simplify the liquid-metal texture to roughly 8–12 intentional chrome clusters. Keep the body tiny and the hood/head dominant.
>
> Pose the character so it can sit/stand visibly in a small fishing boat viewed from a 3/4 top-down camera. Transparent background. Hard pixel clusters only, roughly 10–12 sprite colors, one coherent outline system, upper-left/front lighting.
>
> No environment, no rod, no boat, no rain, no UI, no text, no antialiasing, no blur, no gradients, no inconsistent pseudo-pixels.

## 4. Prompt C — 4-frame idle strip

**Primary reference: approved 32×32 overworld sprite.**

### Prompt

> Create one horizontal **4-frame pixel-art idle animation strip** for the supplied approved 32×32 CHIBAIT protagonist.
>
> Every frame is exactly one 32×32 logical cell with the same anchor and silhouette proportions.
>
> Motion is subtle and deadpan:
> 1. neutral;
> 2. body settles downward by about one logical pixel;
> 3. return toward neutral with tiny chrome-cluster shift;
> 4. ears/body recover with slight secondary lag.
>
> The face center, eye spacing, ear roots and Earth emblem must remain stable within one pixel. The character must not become bouncy or excited. The liquid-metal pattern may shift minimally but cannot redesign the hood.
>
> Transparent background. Uniform pixel grid. No interpolation, no antialiasing, no added environment, no text, no per-frame anatomy drift.

## 5. Prompt D — 7-frame hook-smack strip

**Primary reference: approved 32×32 overworld sprite.**

### Prompt

> Create one horizontal **7-frame pixel-art hook-set animation strip** for the supplied approved 32×32 CHIBAIT protagonist using a fishing rod.
>
> Character identity must remain exact and deadpan. The body and rod perform the acting; the face stays nearly unimpressed.
>
> Pose sequence:
> 1. neutral rod-ready;
> 2. anticipation lean backward;
> 3. stronger anticipation, ears lagging;
> 4. exaggerated fast rod smear beginning forward;
> 5. violent hook-set impact pose with the strongest silhouette;
> 6. recoil with ears catching up;
> 7. immediate deadpan recovery.
>
> The rod may create a deliberately exaggerated one-frame curved smear. The body may squash/stretch beyond normal limits only on the impact/smear beat. Outside that beat, preserve the approved proportions and anchors.
>
> Each frame is exactly 32×32 logical pixels on a shared grid. Transparent background. No water splash or camera effect baked into the character strip; those are separate presentation effects.
>
> No antialiasing, no smooth motion blur, no gradient rod, no text, no extra props, no redesigned face, no frame-to-frame ear/eye/emblem mutation.

## 6. Prompt E — starter boat

### Prompt

> Design a tiny pixel-art starter fishing boat for CHIBAIT in the same late-handheld visual grammar as the approved protagonist.
>
> Logical sprite target: approximately 48×32 or 64×32 pixels. 3/4 top-down camera. The pointed bow and flatter stern must be immediately distinguishable. Leave a visually clear central seating/standing area so the 32×32 Chibi remains recognizable from chest upward.
>
> Cute, slightly battered, functional, not luxury. Chunky silhouette, restrained palette, hard pixel clusters, dark outline, upper-left/front lighting. No Chibi drawn into the boat. Transparent background. No wake, rain, water, UI or text.

## 7. Prompt F — 240×160 lake art-direction mockup

**References: approved player + approved boat.**

### Prompt

> Create a **240×160 logical pixel** handheld-game art-direction mockup for CHIBAIT.
>
> Show the approved silver cat-ear Chibi in the approved tiny boat on a small mysterious lake at night, viewed from a top-down 3/4 RPG camera.
>
> Mood: cozy melancholy, midnight rain, dark still water, quiet weirdness. Palette: deep navy, blue-black, desaturated teal, dark violet, muted shoreline olive/brown/purple-gray, sparse cyan water highlights. The silver protagonist must remain one of the brightest readable forms.
>
> Include a few reeds/rocks/islets and subtle fish shadows beneath the water, but preserve navigable open water. Use restrained layered rain and a small boat wake. Do not make the scene cyberpunk, neon-card UI, horror, or a direct Pokémon map imitation.
>
> Authentic pixel-native clusters, uniform grid, hard edges, no antialiasing or gradients. No title logo, no dialogue UI, no text.

## 8. Normalization pass

Every candidate must be normalized before approval:

- enforce exact logical dimensions;
- nearest-neighbor only;
- lock palette count;
- remove stray one-pixel noise;
- verify transparent background where required;
- normalize anchor;
- compare silhouette against canonical source/master;
- inspect at native 1× size and enlarged 4×/8×;
- reject inconsistent pixel grids.

## 9. Approval gallery

Every protagonist candidate must be shown:

- native 1×;
- 2×;
- 4×;
- 8×;
- on transparent checker;
- over intended lake water;
- against a dark shoreline;
- inside a 240×160 full-scene mockup.

An asset is not approved because it looks good enlarged.
