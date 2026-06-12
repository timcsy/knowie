---
name: knowie-migrate
description: Migrate a knowledge base to the current structure — reconstruct the past from git + specs, dispatch to the right layers, confirm
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Migrate

Bring a knowledge base up to the current knowie **structure**. For an old base **this is memory archaeology, not folder-renaming**: reconstruct the project's past from git + specs as fully as the material allows, then **dispatch** what you recover into the right memory layers — **detect, propose, confirm** (never auto-apply).

(Pulling the latest skills/templates is the CLI's job — `knowie update`. Internal quality/rot is `judge`'s job. This skill is only **structure migration** — hence the name, distinct from the CLI's `update`.)

## The core mindset: a migration is the one-shot chance to crystallize the past correctly
Renaming folders + reshaping the three files is the *shallow* migration — it leaves `episodes/` empty, `concepts/` sparse, no Key Extensions, and calls it done. **That is not done.** The project's past is already sitting in **git history + specs** (the raw causal substrate); migration's real job is to **distil that substrate into the curated layers** (`history` = the distilled why-trail; same metabolism, see core). A base with recoverable git/spec history but empty `episodes/` means the past was never reconstructed — only the folders were renamed.

## How detection stays robust to minor changes
Don't hardcode a version-pair table — it rots. **Detect drift against the *current canon*, derived live**: canon = what `_core` ("Structure") describes + the refreshed `.templates/`. `structureVersion` in `.knowie.json` is a cheap hint, not the truth (absent/behind → likely old; confirm by *signals*). Tool `version` is irrelevant (it bumps every release; structure doesn't).

## Steps
1. **Detect drift** — read `.knowie.json` `structureVersion`, then compare the base to canon by *signals*: folders not in canon (`research/`, `design/`) → content to re-home; canon folders missing (`episodes/`, `skills/`, a subdir `README.md`); old conventions (`[[ ]]` not `[](path)`; flat `principles` with no root/derived split; missing Key Extensions tables).
2. **Quarantine the existing curated files first — their folder is *not* the truth.** Set aside what's already in `history/` / `concepts/` / etc. before reconstructing. Under *past* rules a file may have been homed differently than current rules demand: an episode-scene filed in `history/`, experience detail compressed into `history/`, etc. Treat every existing curated file as **raw material to re-judge by current rules** — exactly like git/specs. **Don't build new entries *around* an old one, and don't trust its old home.** (Real case: a `history/NNN-early-lessons.md` that is actually four-part *experience* lessons archived there under old rules → it belongs in `experience`, not `history`.)
3. **Reconstruct the past (run git/specs hard — the core)** — walk `git log` + diffs + `specs/` / `.specify/` to recover the project's arc: milestones, decisions + rejected options, the **scenes** of building each thing, recurring concepts, lessons. The git trail itself carries *old-rule* compressions (e.g. a commit "experience trimmed → archived to history") — re-distribute by **current** rules, don't replay old homings. Proportional to recoverable signal.
4. **Dispatch every piece — reconstructed *and* quarantined — to its right layer by current rules; don't conflate** (table below). One milestone yields several pieces (scene + decision + maybe concept) — split them. **Renumber each layer as one clean sequence** — don't leave old + new interleaved.
5. **Propose the plan, human confirms each move** (irreversible semantic → propose, don't decide). Reversible file moves are yours.
6. **Complete the canon, then bump `structureVersion` — a hard final gate.** Create all canon subdirs (incl. `skills/`) with READMEs; add **Key Extensions** tables to the three files (the routing interface); convert links to `[](path)`, principles to root/derived. Filenames in the base's language (see core). **Then set `.knowie.json` `structureVersion` to the current value (`"2"` as of this skill) — and *verify* the field is present and correct afterward.** The CLI never sets it; if you rewrite `.knowie.json`, don't drop the field.

## Dispatch — which layer (the crux: a scene is not a decision)
| What you reconstructed | Home | NOT |
|---|---|---|
| A recurring concept / pattern (with three-perspective projections) | `concepts/` | |
| A **recall-worthy scene** — what building *that* thing was actually like (why + how + which concepts), with the **how-leg** linking the contemporaneous commit/spec | **`episodes/`** | ❌ not `history/` |
| A **decision transition** + rejected options ("chose X over Y because Z; considered W, rejected") | `history/` | ❌ not `episodes/` |
| A distilled lesson (four-part) | `experience` | ❌ not `history/` |
- **`episodes/` = the lived scene** (full, recall-worthy, "that time"); **`history/` = the decision** (compressed, causal, "why it changed"). A milestone produces both — emit both, never just one.
- **Leave the *how* leg as a pointer**: episodes/history link the contemporaneous commit SHA / spec path — a pointer to the external artifact, never a copy (root axiom 2; code/spec stays the what's truth).

## Mining git + specs
- `git log --follow <file>` + commit messages → the *why it changed*; for a base with no `history/`, **git log IS its recoverable causal trail** → distil into `history/` entries.
- `git show <commit>:<path>` / the tree at a commit → the contemporaneous *what* the why was about → tells you where the why belongs.
- `specs/` / `.specify/` → the contemporaneous design intent → rich source for `concepts/` and `history/`; link out to them (don't copy).

## Guardrails
- **Depth is proportional to recoverable signal, not unbounded.** Mine git/specs as deeply as they carry real signal; a thin base yields a thin (but correctly-shaped + correctly-homed) result — that's fine. The cost is real and **worth it**: migration is the *one* chance to crystallize an existing past correctly.
- **Reconstruct context for *judgment*, don't import the *what*.** Read old code/spec to decide where a why belongs and to seed scenes/decisions; still write only why + pointers.
- **Degrade gracefully.** No git, or history too shallow → fall back to current-state-vs-canon. Git is the engine when present, not a precondition.
- **The human confirms.** Reconstruction makes the *proposal* rich; the irreversible semantic moves are still the human's call.

## Invariants
- **Never change what the knowledge means** — only move/reshape/recover, on confirmation.
- **No backward-compat burden, but no *silent* break** — absence/old `structureVersion` must surface loudly and offer the migration, never pass silently.
- **A minor knowie change must not force a migration** — if canon's structure didn't actually change, detection finds no drift and this is a no-op.
- **Old curated files are material, not truth** — an existing file's folder reflects whatever rules existed when it was written; re-judge it by current rules, don't preserve a stale home.
- **Not done until the past is dispatched and canon is complete** — any of these means unfinished: recoverable git/spec scenes left out of `episodes/`; old-rule files left in the wrong layer; missing Key Extensions / `skills/`; filenames not in the base's language; `.knowie.json` `structureVersion` not present and equal to current.
