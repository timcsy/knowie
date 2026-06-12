---
name: knowie-migrate
description: Migrate a knowledge base to the current structure by replaying git history forward, slice by slice — accumulate, confirm
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Migrate

Bring a knowledge base up to the current knowie **structure**. For an old base this is **replaying the project's metabolism forward over git** — not a one-shot snapshot judgment, and not folder-renaming. Slice the history into time windows, walk them **in chronological order**, and **accumulate** each slice's increment into the growing base. **Detect, propose, confirm** (never auto-apply).

(Pulling the latest skills/templates is the CLI's job — `knowie update`. Internal quality/rot is `judge`'s job. This skill is only **structure migration** — distinct from the CLI's `update`.)

## Why replay forward, not judge the final state in one pass
Looking at the *final* state and reconstructing everything in one giant judgment is **non-reproducible** (run it twice, get a different base) and **structurally blind to transitions**. Replaying forward fixes both:
- **It's monotonic → it converges.** Walking forward you only *add* and mark *superseded* — never re-judge the whole. Re-running tidies to near no-op (knowie's core convergence invariant). The one-pass snapshot re-rolls the dice each time.
- **Transitions (the heart of `history/`) are only visible forward.** `history/` records how X *became* Y. The final state shows only Y; you must watch the timeline to catch the moment X→Y. A snapshot pass misses this; replay grows `history/` naturally.
- **It's anchored, so it's stable.** Each slice's episode/decision is pinned to a real commit window — not "whichever scenes the model felt were recall-worthy today." The skeleton (which slices, in what order) is deterministic from git; only per-slice wording varies.
- **It's how knowie was meant to grow.** Normal use feeds knowie incrementally as you build. git is the record of that building. Replaying it = feeding knowie the history it never got — the right reconstruction, not archaeology by hindsight.

## Detection stays robust to minor changes
Don't hardcode a version-pair table — it rots. **Detect drift against the *current canon*, derived live**: canon = what `_core` ("Structure") describes + the refreshed `.templates/`. `structureVersion` in `.knowie.json` is a cheap hint, not the truth. Tool `version` is irrelevant.

## Steps
1. **Detect drift** — `.knowie.json` `structureVersion` + signals vs canon: foreign folders (`research/`, `design/`) → content to re-home; missing canon folders (`episodes/`, `skills/`); old conventions (`[[ ]]`, flat principles, no Key Extensions).
2. **Set the existing curated files aside — rebuild from the replay, not on top of them.** Don't re-judge them in the abstract here: you'll meet each piece *again during the replay* — in its contemporaneous form, at the slice where it was authored — and re-home it there by current rules (an episode-scene old-filed in `history/`, experience detail compressed into `history/`, …). Their old folder is not the truth.
3. **Slice the history** — cut `git log` into an ordered list of time windows. Default granularity: **one slice per milestone / spec / meaningful commit cluster** (coarse = fewer passes, faster; finer = slower, more detail — the knob). The slice list is the deterministic skeleton; derive it from real boundaries (milestone tags, spec dirs whatever the tool, commit-message arcs), not feel.
4. **Replay forward — for each slice, in order, accumulate into the growing base:**
   - **read the contemporaneous `knowledge/` + design intent at this slice — the author's *own* why, captured then (the richest source)**: `git show <commit>:knowledge/…` + whatever spec/plan the project kept (tool-detected; may be none — see Mining). Commits/diffs supply the what/how. The contemporaneous `knowledge/` is also where *old-rule* curation surfaces (e.g. a commit that archived experience into `history/`) — re-home it by current rules right here;
   - dispatch it (table below): concepts that emerged → `concepts/`; **the scene of this slice → `episodes/`** (how-leg → a commit/spec in this window); decisions made → `history/`; lessons → `experience`;
   - **supersession**: if this slice *changes* an earlier decision, record the X→Y transition in `history/` (mark the old `superseded`, link forward) — this is what only forward replay catches;
   - **checkpoint** (commit) after the slice if confirmed, so work accumulates and is never re-rolled.
5. **Propose each slice's plan; the human confirms** (irreversible semantic → propose, don't decide). Reversible file moves are yours.
6. **Complete the canon, then bump `structureVersion` — a hard final gate.** All canon subdirs (incl. `skills/`) with READMEs; **Key Extensions** tables on the three files; `[](path)` links; root/derived principles. Filenames in the base's language (see core). **Then set `.knowie.json` `structureVersion` to the current value (`"2"` as of this skill) and *verify* the field is present and correct.** The CLI never sets it; if you rewrite `.knowie.json`, don't drop the field.

## Dispatch — which layer (the crux: a scene is not a decision)
| Recovered in a slice | Home | NOT |
|---|---|---|
| A recurring concept / pattern (projects onto all three perspectives) | `concepts/` | |
| The **recall-worthy scene** — what building *that* slice was like (why + how + which concepts), how-leg → the slice's commit/spec | **`episodes/`** | ❌ `history/` |
| A **decision transition** + rejected options ("chose X over Y because Z") | `history/` | ❌ `episodes/` |
| A distilled lesson (four-part) | `experience` | ❌ `history/` |
- **`episodes/` = the lived scene** ("that time"); **`history/` = the decision** ("why it changed"). A slice produces both — emit both.
- **The *how* leg is a pointer** — link the commit SHA / spec path; never copy code/spec in (root axiom 2; code stays the what's truth).

## Mining each slice (the contemporaneous *why* first, code second)
- **`git show <commit>:knowledge/*` — the project's *own* `knowledge/` as it stood in this window.** The richest source: the author's curated why *at that time*, under that time's rules. Watching it evolve slice to slice *is* the why growing — read this, don't reverse-engineer why from code alone. It's also where old-rule homings surface → re-distribute by current rules.
- **The contemporaneous design intent, *wherever the project kept it*** → detect the spec tool by its marker (`.specify/` = SpecKit · `openspec/` = OpenSpec · `.kiro/specs/` = Kiro · or another) and read its specs in the window; else check `docs/` / commit messages / PR descriptions. **If there's none — e.g. the work was planned in an ephemeral plan-mode, nothing committed — that's fine:** the intent then lives in commit messages + the contemporaneous `knowledge/` (above). Never assume a specific tool, or that a spec file exists at all. Link out, don't copy.
- `git log <range>` + messages + diffs → the what/how and *why it changed* — supporting evidence under the contemporaneous why above.

## Guardrails
- **Reproducible skeleton, bounded cost.** The slice list comes from git's real structure (stable across runs); granularity is the cost knob (milestone-coarse for speed, finer for fidelity). A thin base yields a thin (but correctly-shaped) result.
- **Migrate once, then maintain — don't re-run from scratch.** Replay accumulates + checkpoints; improving the base afterward is `judge`'s/the human's job, not another full re-roll.
- **Reconstruct for judgment, don't import the what** — write why + pointers only.
- **Degrade gracefully.** No git, or history too shallow → fall back to current-state-vs-canon (one pass). Replay is the engine when git is present, not a precondition.
- **The human confirms.** Replay makes each slice's proposal rich; irreversible moves are the human's call.

## Invariants
- **Never change what the knowledge means** — only move/reshape/recover, on confirmation.
- **No backward-compat burden, but no *silent* break** — old/absent `structureVersion` surfaces loudly and offers migration, never passes silently.
- **A minor knowie change must not force a migration** — no real structural drift → no-op.
- **Old curated files are material, not truth** — re-judge by current rules at the right slice; don't preserve a stale home.
- **Episodes anchor to slices, not whim** — one scene per meaningful slice, pinned to its commits; re-running should yield roughly the same set.
- **Not done until canon is complete** — missing Key Extensions / `skills/`; filenames not in the base's language; `structureVersion` absent or ≠ current → unfinished.
