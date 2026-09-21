# CHIBAIT — ROADMAP v1.0

**Status:** LOCKED FOR VERTICAL-SLICE DEVELOPMENT  
**Product:** cute Chibi Hood fishing RPG for Telegram Mini Apps  
**Current milestone:** **M0 — FOUNDATION / ART LOCK**

This roadmap is intentionally narrow. New ideas do not enter the active milestone unless they are required to pass its acceptance gate.

---

## 0. Product thesis

CHIBAIT should feel like a lost handheld fishing RPG:

- move a tiny boat around a lake;
- discover fishing spots and strange creatures;
- cast;
- react to the bite;
- violently set the hook with the rod;
- fight through readable line/tension physics;
- catch or lose the creature;
- gain XP;
- add new species to the Chibidex;
- unlock more of the game through progression.

The game must be intrinsically fun without wallet, token or NFT ownership.

Chibi Hood supplies the visual identity. Telegram supplies launch/social context. Neither should replace the core game loop.

---

# Operating contract

Development uses:

`PLAN → CHANGESET → VERIFY → VERDICT`

Bounded completion:

`IMPLEMENT → TEST → ONE hostile review → fix Critical/High → ONE targeted rereview iff needed → CLOSE/MERGE WHEN AUTHORIZED`

Rules:

- smallest safe diff;
- no review loops;
- simulation owns gameplay truth;
- rendering owns pixels/audio/juice;
- content should be data where practical;
- desktop and touch feed the same logical input contract;
- backend is earned only after local gameplay is fun;
- image-generation output is reference material until normalized and validated as a production asset.

---

# M0 — FOUNDATION / ART LOCK

**Status:** IN PROGRESS

## Goal

Freeze the protagonist identity, pixel-art grammar, Telegram viewport rules and first playable constraints before production gameplay work.

## Deliverables

- `docs/ART_BIBLE.md`
- `docs/ASSET_GENERATION_PROMPTS.md`
- `docs/FIRST_SPRITE_EXPERIMENT.md`
- `docs/TELEGRAM_VIEWPORT_CONTRACT.md`
- canonical source/reference manifest
- approved protagonist master reference
- selected 32×32 overworld design candidate

## Acceptance gate — `FOUNDATION_LOCKED`

Must be true:

- protagonist is immediately recognizable as the owner's canonical Chibi;
- cat ears, dark face aperture, sleepy eyes, chrome hood and Earth remain readable;
- 32×32 overworld direction is approved;
- runtime viewport is explicitly responsive, not fixed to 240×160;
- portrait, landscape and desktop layout targets are defined;
- source assets and generated candidates have traceable provenance;
- no production backend dependency exists.

## Explicitly not in M0

- fishing physics implementation;
- full monster roster;
- backend;
- Telegram auth;
- progression economy;
- multiple lakes;
- NFT trait mapping.

---

# M1 — PLAYABLE_0A / BOAT MOVEMENT

## Goal

Open a real CHIBAIT game page and move the approved Chibi around a responsive lake on desktop and mobile.

## Build

Minimal repo/runtime skeleton:

```text
apps/game/
  src/
    main.ts
    game/
      Game.ts
      scenes/LakeScene.ts
      input/
      sim/
    telegram/
      viewport.ts

packages/
  sim/
  protocol/

assets/
  pixel/player/
  pixel/environment/

tests/
  e2e/
```

Reuse proven engineering patterns from Apple Inu where appropriate:

- fixed timestep;
- seeded/testable RNG helpers;
- logical input intent;
- simulation/presentation separation;
- deterministic movement tests.

Do not import combat/zombie-specific design.

## Gameplay

Desktop:

- WASD/arrows = throttle/steer;
- mouse = aim direction;
- pointer action abstraction exists but fishing is not implemented yet.

Mobile:

- left virtual stick = throttle/steer;
- right-side action area placeholder;
- controls respect Telegram safe/content-safe insets.

Boat movement should have:

- acceleration;
- water drag;
- angular acceleration/drag;
- shoreline collision;
- readable heading;
- deterministic stepping.

## Viewport acceptance

Required captures:

- 360×640 touch;
- 390×844 touch;
- 640×360 touch;
- 844×390 touch;
- 960×600 desktop;
- 1280×720 desktop.

## Acceptance gate — `PLAYABLE_0A`

- real Phaser canvas, not HTML mock art;
- approved Chibi sprite displayed with nearest-neighbor rendering;
- no sprite blur at supported scales;
- desktop movement works;
- touch movement works;
- portrait works;
- landscape works;
- desktop reveals more world rather than stretching the game;
- resizing cannot alter simulation outcome for the same input timeline;
- shoreline collision works;
- test suite proves deterministic movement.

### Kill criterion

If the protagonist does not read clearly at actual game scale, fix sprite/camera/contrast before proceeding.

---

# M2 — PLAYABLE_0B / THE 20-SECOND FISHING LOOP

## Goal

Prove one complete fishing interaction is fun using local/fake data.

No backend.

## Loop

```text
SAIL
→ choose water
→ aim
→ cast
→ bobber lands
→ wait
→ !
→ hook-set / rod smack
→ line fight
→ catch or escape
→ reveal
→ cast again
```

## Systems

### Cast

- aim has range and direction;
- bobber follows deterministic arc/travel;
- invalid cast areas are rejected;
- landing point determines fishing zone.

### Bite

- seeded bite timing;
- clear audiovisual cue;
- readable hook window;
- early/late/missed outcomes.

### Hook-set

Signature animation:

- anticipation;
- violent rod smear;
- impact;
- recoil;
- immediate deadpan recovery.

### Line fight

Minimum real model:

- line length;
- fish position/velocity;
- spring-like tension;
- damping;
- reel-in rate;
- break strength;
- fish burst force/stamina.

Different creature configs must produce noticeably different fight behavior without bespoke code.

## Content

Only **3 creatures**:

1. common/easy;
2. agile/uncommon;
3. heavy/rare.

Temporary names/art are acceptable if needed.

## Acceptance gate — `PLAYABLE_0B`

- full loop can be completed repeatedly;
- hook timing affects outcome;
- poor tension management can lose a fish;
- creature configs create distinguishable fights;
- same seed + same input replay = same result;
- no reward can be granted twice within local state;
- average full loop is roughly 15–30 seconds;
- user wants to cast again without progression systems propping it up.

### Kill criterion

If the loop is not fun with 3 creatures and no meta-game, do not build backend/progression to compensate.

---

# M3 — VERTICAL_SLICE_1 / LOOKS AND FEELS LIKE CHIBAIT

## Goal

Turn the mechanically proven loop into one small section that looks like a real game.

## Content budget

Exactly:

- 1 lake;
- 1 player Chibi;
- 1 starter boat;
- 1 rod;
- 5–8 creatures;
- 1 rare/legendary encounter;
- 1 weather state;
- minimal sound set;
- minimal Chibidex;
- XP + level-up presentation.

## Art

Production pipeline:

```text
approved master
→ separately authored source sprite
→ palette/grid cleanup
→ animation strip
→ asset validation
→ atlas
→ Phaser scene
→ screenshot regression
```

Required protagonist animations:

- idle;
- boat movement;
- cast;
- hook-set;
- catch/victory.

Environment remains modular. Do not generate one giant baked lake screenshot.

## Audio

Small bespoke/CC0-safe set:

- UI click;
- cast;
- bobber splash;
- bite cue;
- hook impact;
- line strain;
- catch;
- rare catch stinger.

## Progression

Local only:

- XP;
- levels;
- Chibidex entries;
- one simple unlock tied to level.

No persistent economy yet.

## Acceptance gate — `VERTICAL_SLICE_1`

- looks coherent at phone and desktop sizes;
- source art remains crisp;
- catch reveal feels rewarding;
- hook-set feels like a signature moment;
- 5–8 species feel visually/mechanically distinct;
- XP/Chibidex create motivation without slowing the loop;
- cold-start to first cast is under ~10 seconds locally;
- no major interaction requires explanatory text.

---

# M4 — TELEGRAM + PERSISTENCE

## Goal

Move the proven vertical slice into the real Telegram flow.

Only now is backend work authorized.

## Stack target

- Telegram Mini App;
- TypeScript;
- Phaser;
- Cloudflare Worker;
- Hono or equivalent thin HTTP router;
- Cloudflare D1;
- Zod/schema validation;
- no Redis;
- no queue;
- no WebSockets unless later proven necessary.

## Telegram launch

```text
Telegram chat
→ /fish or PLAY CHIBAIT button
→ Mini App
→ ready + expand
→ user presses PLAY
→ fullscreen when supported
→ session bootstrap
→ game
```

Validate Telegram `initData` server-side.

Do not trust client-supplied Telegram user/chat identity.

## Persistence

Minimum schema:

- players;
- catches;
- dex_entries;
- fishing_attempts;
- launch_sessions.

## Server-authoritative catch contract

Server creates an encounter ticket containing:

- attempt ID;
- user ID;
- secure seed;
- sim version;
- content version;
- expiry.

Client submits logical input replay/result.

Server replays/validates before atomically awarding:

- catch;
- XP;
- dex entry.

Attempt is single-use.

## Acceptance gate — `TELEGRAM_PERSISTENT`

- opens from Telegram;
- identity validated server-side;
- progress persists across sessions;
- duplicate finish/retry cannot duplicate a catch;
- expired/reused attempts fail closed;
- local simulation and server replay agree;
- game remains usable when fullscreen is unavailable;
- production secrets never enter client bundle.

---

# M5 — PROGRESSION_V1

## Goal

Make the first hour of play interesting without adding grind systems.

## Progression surfaces

Allowed:

- player level;
- Chibidex completion;
- rod upgrades;
- boat handling upgrades;
- access to lake zones;
- bait as a simple encounter modifier;
- rare encounter conditions.

Progression must primarily unlock **new situations**, not just larger numbers.

## First progression shape

Example only until balanced:

```text
Lv 1–3   starter shore / common species
Lv 4–6   reeds / agile species
Lv 7–10  deeper water / stronger line demands
Lv 11+   weather/rare encounter conditions
```

## Balance tooling

Build simulations for:

- expected XP/hour;
- species discovery curve;
- catch success by player/rod level;
- rare encounter frequency;
- upgrade affordability.

## Acceptance gate — `PROGRESSION_V1`

- first session teaches itself;
- first new species arrives quickly;
- level-up regularly changes available play;
- no mandatory grind wall in first hour;
- no dominant rod/bait strategy trivializes content;
- balance can be simulated from data rather than hardcoded branches.

---

# M6 — SOCIAL TELEGRAM V1

## Goal

Use Telegram as the social layer without turning the game into chat spam.

## Features

Allowed:

- `FLEX IN CHAT` catch share;
- group record;
- biggest/rarest catch;
- daily/weekly group lake stats;
- occasional group-wide rare-event announcement.

Default behavior should edit/update in-game UI rather than spam messages.

Rare/record events can intentionally create fresh chat messages.

## Acceptance gate — `SOCIAL_V1`

- sharing is opt-in except explicitly designed group events;
- group records cannot be forged client-side;
- one player cannot trigger another player's controls/session;
- chat volume remains tolerable under repeated fishing;
- shared messages link back into the game cleanly.

---

# M7 — CONTENT_V1 / CLOSED BETA

## Goal

Enough content to evaluate retention, progression and performance with real players.

## Target content budget

Only after earlier milestones pass:

- 2–3 connected lake regions or one lake with strong sub-biomes;
- ~20–30 creatures;
- several rods;
- several boat upgrades;
- weather/time encounter modifiers;
- rare/legendary pool;
- complete first progression arc.

Content comes from schemas/data.

Do not add a unique engine code path for every creature.

## Beta evidence

Track:

- time to first cast;
- casts/session;
- catches/session;
- failed-hook rate;
- line-break rate;
- unique species/session;
- return sessions;
- progression bottlenecks;
- device/layout failures.

Do not collect more personal data than necessary.

## Acceptance gate — `CLOSED_BETA_READY`

- no Critical/High gameplay integrity issues;
- mobile + desktop coverage stable;
- persistence/replay path stable;
- progression has no obvious dead ends;
- content pipeline can add a species without engine changes;
- telemetry is sufficient to diagnose loop/progression failures.

---

# M8 — PUBLIC V1

## Goal

Ship the smallest public game that has proven its loop, presentation, progression and Telegram flow.

Public V1 is not the point where every idea is included.

Required:

- polished onboarding;
- stable Telegram launch;
- responsive mobile/desktop gameplay;
- persistent profile;
- Chibidex;
- progression V1;
- social share/records;
- first complete content arc;
- recovery/error states;
- release/rollback process.

---

# NOT NOW

These are explicitly **outside the active roadmap** until product evidence creates a reason:

- real-money rewards;
- token rewards;
- wallet requirement;
- NFT ownership requirement;
- holder gating;
- marketplace;
- gacha;
- battle pass;
- crafting tree;
- PvP;
- synchronous multiplayer;
- WebSocket world server;
- guild/clan system;
- 80 currencies;
- procedural world generation;
- dozens of lakes;
- user-generated content.

NFT/Chibi Hood ownership may later unlock cosmetics, avatar mapping or optional identity features, but must not be required for the base game.

---

# CI/CD roadmap

## From M1 onward every PR should run

- install with frozen lockfile;
- lint;
- typecheck;
- unit tests;
- deterministic simulation tests;
- content/schema tests where relevant;
- production build.

## From M1 viewport work onward

Playwright captures representative layouts:

- 360×640;
- 640×360;
- 960×600.

Before release expand to the full six-profile matrix.

## From M2 onward

Replay fixtures become first-class test evidence.

```text
seed
+ sim version
+ content version
+ input stream
=
result hash
```

## From M3 onward

Asset gate verifies:

- logical dimensions;
- alpha;
- palette budget where applicable;
- frame dimensions;
- anchors;
- manifest/provenance;
- atlas build.

## Deployment law

```text
PR
→ CI
→ preview
→ review
→ merge when authorized
→ releasable main
→ explicit release
→ production
```

No automatic production deployment merely because a branch was merged.

---

# Active priority

Only the next three milestones are considered active planning scope:

1. **M0 — FOUNDATION_LOCKED**
2. **M1 — PLAYABLE_0A**
3. **M2 — PLAYABLE_0B**

Everything after M2 is a directional roadmap, not permission to prebuild it.

The next implementation after M0 closes is:

> **Responsive Phaser lake + approved 32×32 Chibi + deterministic boat movement + desktop/touch input.**
