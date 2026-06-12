---
name: knowie-migrate
description: Migrate the knowledge base to the current knowie structure — detect drift, propose, confirm
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Migrate

Keep the knowledge base in step with the current knowie **structure**. When the structure moves ahead, migrate the user's base up — **detect, propose, confirm** (never auto-apply).

(Pulling the latest skills/templates is the CLI's job — `knowie update`. Internal quality/rot is `judge`'s job. This skill is only **structure migration** — hence the name, distinct from the CLI's `update`.)

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
3. **Propose a migration plan** — what moves/renames/gets created, shown before touching anything. Map each old piece to its canon home (which content is a concept, which is causal trail, which is a draft) — that's semantic judgment. **When a piece's home is ambiguous, reach for git (next section) to reconstruct the contemporaneous picture before deciding.**
4. **Migrate step by step; the human confirms each move** (irreversible semantic → propose, don't decide).
5. **After migrating, bump `structureVersion` to current** in `.knowie.json` (this is the only place it's bumped — the CLI never does).

## Git as a time machine — when re-homing is ambiguous
Re-homing is judgment, and judgment is sharper with the *contemporaneous picture*. knowie already sits on git (everything is auditable there), so use it to reconstruct what the project looked like when a piece was written:
- **The knowledge's own evolution** — `git log --follow <file>` + commit messages. The message is often the *why it changed*; for an old base with **no `history/` layer, git log IS its recoverable causal trail**.
- **The code/spec of the time** — `git show <commit>:<path>` (or read the tree at that commit). Seeing the *what* the why was about tells you where the why belongs.
- **Order & supersession** — which decision came first, which replaced which (→ a `history/` transition).

Two payoffs beyond a cleaner sort:
- **Seed `history/` from git.** Migrating an old base isn't just moving folders — distil the commit trail into `history/` entries, recovering the causal dimension the old structure lacked.
- **Leave a pointer, recover the *how* leg.** When you re-home into `episodes/` or `history/`, link the contemporaneous commit (SHA) — that's the "how" leg of a recallable unit (a pointer to the external artifact, not a copy).

**Guardrails:**
- **Git is context for *judgment*, not a source to import the *what*.** Read old code/spec to decide where a why belongs; still write only why + pointers — never copy code in (root axiom 2; code stays the what's truth).
- **Bounded, not archaeology.** Reach for git only when a piece's home is genuinely ambiguous — not a mandatory full-history replay of every file.
- **Degrade gracefully.** No git, or history too shallow → fall back to current-state-vs-canon (the default above). Git is an aid, not a precondition.
- **The human still confirms.** Git makes the *proposal* better-informed; the irreversible semantic move is still the human's call.

## Invariants
- **Never change what the knowledge means** — only move/reshape structure, on confirmation.
- **No backward-compat burden, but no *silent* break** — absence/old `structureVersion` must surface loudly and offer the migration, never pass silently.
- **A minor knowie change must not force a migration** — if canon's structure didn't actually change, detection finds no drift and this is a no-op (that's why `STRUCTURE_VERSION` only bumps on real structural change, decoupled from the release version).
