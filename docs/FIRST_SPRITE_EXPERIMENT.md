# CHIBAIT — FIRST SPRITE EXPERIMENT v0

## Objective

Prove that the owner's canonical Chibi Hood character survives the translation into a small handheld-game sprite **before** we create a large content library or wire production backend systems.

## Frozen hypothesis

A dual-resolution character system should preserve identity:

- **64×64** master/encounter representation;
- **32×32** overworld representation.

This is a hypothesis, not a permanent law. The experiment may falsify it.

## Source

Canonical source provenance is recorded in:

`assets/source/references/SOURCE_MANIFEST.json`

The reference is a 1000×1000 RGBA PNG payload supplied by the owner in the design conversation.

## Experiment sequence

### Gate A — 64×64 master

Generate 2–4 candidates using Prompt A.

Select at most one survivor.

Acceptance:

- immediate same-character recognition;
- ears unmistakable;
- dark face aperture remains dominant;
- half-lidded eyes read at native size;
- chrome reads as liquid/silver rather than white cloth;
- Earth reads without dominating;
- no AI pseudo-pixel grid;
- no antialiasing required to look good.

If no candidate passes, revise the art bible/prompt and repeat Gate A only.

### Gate B — 32×32 overworld

Derive from the approved 64×64 master.

Acceptance:

- same-character recognition at 1×;
- ears + face + eyes survive;
- Earth remains a readable accent;
- chrome texture simplifies cleanly;
- silhouette is readable against target water and shore colors.

If it fails, do not “fix” it by adding more detail. Reconsider shape and contrast first.

### Gate C — idle

Create the 4-frame idle.

Acceptance:

- no anatomy drift;
- face center stable ±1 px;
- ear roots stable ±1 px;
- animation personality remains restrained/deadpan;
- chrome shifts do not read as boiling noise.

### Gate D — hook-smack

Create the 7-frame hook-set.

Acceptance:

- anticipation is readable;
- impact is much stronger than idle;
- rod path is readable;
- face remains characteristically deadpan;
- one-frame exaggeration is allowed without breaking identity;
- recovery returns cleanly to the canonical anchor.

### Gate E — game-scale composition

Place the approved player and starter boat into a 240×160 lake mockup.

Acceptance:

- the player reads immediately at actual game scale;
- silver separates from water;
- boat heading is obvious;
- rain does not destroy sprite readability;
- scene looks like one authored game rather than composited asset packs.

## Recognition test

Hide all labels and branding.

Ask the owner/HoneySlop to identify the sprite.

**Pass:** immediate recognition as the supplied Chibi.  
**Fail:** “cute pixel chibi”, “Pokémon-looking guy”, or recognition only after being told.

## Scope exclusions

Do not produce yet:

- full monster roster;
- multiple boats;
- multiple biomes;
- NFT trait combinatorics;
- progression UI suite;
- production Telegram backend;
- economy;
- token/wallet mechanics.

Those systems do not solve a failed character translation.

## Evidence to save

For each gate preserve:

- prompt version;
- model/tool version when available;
- raw candidate;
- normalized candidate;
- palette;
- logical dimensions;
- source/master reference version;
- approval/rejection note.

This makes later asset generation reproducible instead of vibe-history.
