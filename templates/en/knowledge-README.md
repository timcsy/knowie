# Project Knowledge (knowledge/)

This folder records the **why** behind this project — its principles, direction, and lessons — the things code itself can't hold. It lets an AI (and new teammates) understand the project's intent and constraints before touching anything.

> Maintained by [knowie](https://github.com/timcsy/knowie): a tool for AI to maintain project knowledge in a structured way. Not familiar with knowie? You can still read everything below.

## Start with these three files
- **`principles.md`** — the project's non-negotiable beliefs and rules (split into *root principles* and the *derived principles* that follow from them).
- **`vision.md`** — what problem it solves, where it is now, and the roadmap.
- **`experience.md`** — lessons distilled from development (pitfalls hit, patterns learned).

## For detail, go into the subdirectories
- **`concepts/`** — recurring core concepts; the three files keep only pointers, the detail lives here.
- **`episodes/`** — episodic memory: recall-worthy full scenes (the story behind a lesson or decision).
- **`history/`** — the causal trail: why things became what they are (decision transitions, rejected options).
- **`draft/`** — short-term memory: undecided ideas still forming.

## How to read
Start with the three core files; each ends with a "Key Extensions" table telling you which sub-file to open for a given topic.

## Skills that maintain it
If you use an AI tool that supports knowie (e.g. Claude Code), these commands help maintain this knowledge base:
- `/knowie-init` — create the knowledge base from scratch
- `/knowie-capture` — dispatch a discussion / idea into the right place
- `/knowie-crystallize` — human-initiated: consolidate a ripe draft out (capture's symmetric OUT)
- `/knowie-next` — plan the next step from the knowledge base
- `/knowie-judge` — check consistency, align with code, tidy
- `/knowie-update` — migrate the base when the structure version moves on

(Just here to understand the project? Feel free to ignore this section.)
