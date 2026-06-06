---
name: knowie-update
description: Migrate the knowledge base to the current knowie structure version — detect, propose, confirm
user-invocable: true
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Update

Keep the knowledge base in step with the current knowie structure. When knowie's structure version moves ahead, migrate the user's base up — **detect, propose, confirm** (never auto-apply).

(Pulling the latest skills/templates is the CLI's job — `knowie update`. Checking internal structure quality is `judge`'s job. This skill is only about **version migration**.)

## Steps
1. Read `knowledge/.knowie.json` → `version`; compare with the current knowie structure version.
2. If the base is an older structure, **detect what's old** — e.g. flat principles vs root + derived; old folder layout vs `concepts/` `history/` `draft/`; missing Key Extensions tables.
3. **Propose a migration plan** — what moves where, shown before touching anything.
4. **Migrate step by step; the human confirms each move.** Migration is irreversible semantic judgment (which old content is a concept, which is causal trail, which is a draft) — propose, don't decide.
5. After migrating, bump `version` in `.knowie.json`.

## Invariants
- **Never change what the knowledge means** — only move/reshape structure, on confirmation.
- **No backward-compat burden**: breaking the old structure is fine; **silent** breaking is not — the version check makes the break loud and offers the migration.
