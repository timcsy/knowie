---
name: knowie-update
description: Migrate the knowledge base to the current knowie structure — detect drift, propose, confirm
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Update

Keep the knowledge base in step with the current knowie **structure**. When the structure moves ahead, migrate the user's base up — **detect, propose, confirm** (never auto-apply).

(Pulling the latest skills/templates is the CLI's job — `knowie update`. Internal quality/rot is `judge`'s job. This skill is only **structure migration**.)

## How detection stays robust to minor changes
Don't hardcode a version-pair migration table — it rots on every tweak. Instead **detect drift against the *current canon*, derived live**:
- **Canon = what `_core` (above, "Structure") describes + the refreshed `.templates/` dir.** Both reflect the current version, so comparing to them auto-covers future structural changes without editing this skill.
- **`structureVersion` in `.knowie.json` is a cheap hint, not the truth.** Absent or behind → likely old; but confirm by *signals*. (Tool `version` is irrelevant here — it bumps every release; structure doesn't.)

## Steps
1. **Read `.knowie.json`** → `structureVersion`. Absent or `< current` → suspect drift (but don't trust the number alone).
2. **Detect drift by signals — compare the base to current canon (`_core` Structure + `.templates/`).** What's there that canon doesn't have? What does canon expect that's missing? Illustrative signals (derive the rest from canon, don't treat this as the whole list):
   - folders not in canon (e.g. `research/`, `design/`) → their content needs re-homing;
   - canon folders/files missing (e.g. no `episodes/`, missing a subdirectory `README.md`);
   - old conventions (e.g. `[[ ]]` wiki-links instead of `[](path)`; flat `principles` with no root/derived split; missing "Key Extensions" tables).
3. **Propose a migration plan** — what moves/renames/gets created, shown before touching anything. Map each old piece to its canon home (which content is a concept, which is causal trail, which is a draft) — that's semantic judgment.
4. **Migrate step by step; the human confirms each move** (irreversible semantic → propose, don't decide).
5. **After migrating, bump `structureVersion` to current** in `.knowie.json` (this is the only place it's bumped — the CLI never does).

## Invariants
- **Never change what the knowledge means** — only move/reshape structure, on confirmation.
- **No backward-compat burden, but no *silent* break** — absence/old `structureVersion` must surface loudly and offer the migration, never pass silently.
- **A minor knowie change must not force a migration** — if canon's structure didn't actually change, detection finds no drift and this is a no-op (that's why `STRUCTURE_VERSION` only bumps on real structural change, decoupled from the release version).
