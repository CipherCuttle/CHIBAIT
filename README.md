# CHIBAIT

A tiny Chibi Hood fishing RPG built for Telegram.

**Working concept:** move a tiny boat around a moody lake, discover strange creatures, cast, react to the bite, violently set the hook with the rod, fight the creature through line physics, catch it, gain XP, and fill the Chibidex.

## Current phase

**ART DIRECTION / VERTICAL-SLICE PREPRODUCTION**

The first production gate is deliberately visual:

1. lock the canonical player translation;
2. prove it reads at handheld-game scale;
3. prove the hook/catch motion language;
4. only then expand content or backend work.

Canonical documents:

- [Art Bible](docs/ART_BIBLE.md)
- [Asset Generation Prompt Pack](docs/ASSET_GENERATION_PROMPTS.md)
- [First Sprite Experiment](docs/FIRST_SPRITE_EXPERIMENT.md)
- [Canonical source manifest](assets/source/references/SOURCE_MANIFEST.json)

## Engineering direction

Planned runtime: TypeScript + Phaser with a deterministic fixed-tick simulation, Telegram Mini App shell, and a thin Cloudflare backend once the local vertical slice is fun.

The simulation owns gameplay truth. Rendering owns pixels, audio, shake, particles, and presentation.

No production asset or gameplay system is authorized merely because an AI can generate it quickly.
