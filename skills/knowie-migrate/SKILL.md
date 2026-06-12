---
name: knowie-migrate
description: Migrate a knowledge base by replaying git forward under a self-imposed mask — fresh per-slice sub-agents that never see the ending — then complete and confirm
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Migrate

Bring a knowledge base up to the current structure by **replaying git forward, slice by slice** — reconstructing the project's why as it actually grew. The catch: with full repo access you'll read the *final* knowledge/code and rationalize backward (hindsight), and one session can't un-see the ending. So **mask the future with your own tools** (below) — no external runtime; the AI is present, so the AI masks itself. **Detect, propose, confirm.**

(CLI `knowie update` pulls skills/templates. `judge` does rot. This skill is only **structure migration**.)

## Why forward + masked (the whole point)
Judging the final state in one pass is non-reproducible and blind to *transitions*. Replaying forward is monotonic → it converges; and **transitions (the heart of `history/`) are only visible forward** — the end state shows only Y, never the X→Y. But forward only works if you genuinely **don't see the future**: seeing the ending makes you rationalize the outcome instead of *inferring* the why the author had under uncertainty. This is inverse-RL on the git trajectory — infer the reward/why behind the behavior — and inference needs the future masked.

## Mask the future yourself (in-session, no harness)
1. **Move the old knowledge aside first** — `mv knowledge knowledge.old` (it's in git; safe). The working `knowledge/` is now empty, so you can't accidentally read the old final state. `knowledge.old/` is a final-state reference for the **end cross-check only** — do not read it during the replay.
2. **Detect minimally** — only `.knowie.json` `structureVersion` + folder names. **Do NOT read content to detect drift** — reading the final content *is* the contamination (the old skill's bug). Absent/old `structureVersion` or foreign folders (`research/`, `design/`) → migrate.
3. **Replay each slice in a fresh sub-agent that only sees that slice's past.** A clean per-slice context that has never seen the ending **is the mask.** Give the sub-agent only: `git show <commit>:knowledge/…` + the slice's specs + its commit messages/diff. Instruct it: *do not read the working tree's final code/knowledge*; infer this slice's why; emit the dispatch. You (parent) write its output into `knowledge/`, then move to the next slice.
   - If a sub-agent still leaks (peeks at final code), escalate: hand it a **worktree checked out at the commit** (`git worktree add`) so the future physically isn't there. An external masking harness is the last resort, not the first.

## Steps
1. **Detect minimally** (above) → drift or no-op.
2. **`mv knowledge knowledge.old`** + scaffold a fresh empty `knowledge/` (the canon subdirs).
3. **Slice** `git log` into an ordered list of windows — milestone tags / spec dirs appearing / commit-message arcs. Deterministic skeleton; the cost knob is granularity (coarse = milestones, faster).
4. **Replay forward**, one masked sub-agent per slice (above). Each: infer the why; dispatch (table below) — concepts that emerged → `concepts/`; the scene → `episodes/` (how-leg → a commit in the window); decisions → `history/`; **a decision that changes an earlier one → an X→Y transition in `history/`** (mark old `superseded`); lessons → `experience`. Parent writes + **checkpoints** (commit) after each slice.
5. **Propose, human confirms** the irreversible-semantic moves (per slice if they want — see HITL note). Reversible writes are yours.
6. **Complete the canon, then bump `structureVersion`** — all subdirs incl. `skills/` with READMEs; **Key Extensions** tables on the three files; `[](path)` links; root/derived principles; **filenames in the base's language** (see core). Set `.knowie.json` `structureVersion` to current (`"2"`) and **verify it's present**. Then **cross-check against `knowledge.old/`**: did the new base capture the old base's content, re-homed by current rules? Finally drop/keep `knowledge.old/` per the human.

## Dispatch — which layer (a scene is not a decision)
| Recovered in a slice | Home | NOT |
|---|---|---|
| A recurring concept / pattern (projects onto all three perspectives) | `concepts/` | |
| The **recall-worthy scene** — what building *that* slice was like (why + how + which concepts), how-leg → the commit | **`episodes/`** | ❌ `history/` |
| A **decision transition** + rejected options ("chose X over Y because Z") | `history/` | ❌ `episodes/` |
| A distilled lesson (four-part) | `experience` | ❌ `history/` |
- `episodes/` = the lived scene ("that time"); `history/` = the decision ("why it changed"). A slice produces both.
- The *how* leg is a **pointer** — commit SHA / spec path; never copy code/spec in (root axiom 2).

## HITL during replay (read + additive only — don't break monotonicity)
Replaying forward jogs the author's memory — the richest why (real intent, dead-ends) is in their head, unwritten. So the human may **read** the replay and **add** missing why (you write it as annotation). But **no re-deciding / cutting / reshaping mid-replay** — that's a retraction, it breaks the monotonic accumulation and cascades (butterfly). Curation (cut/merge/reshape) is a *separate later pass* on the finished faithful base. Additive = safe; alteration = defer.

## Guardrails
- **Don't read the final state during replay** — that's the contamination. Old knowledge is moved aside; final code is masked per slice (sub-agent / worktree).
- **Reconstruct for judgment, don't import the what** — write why + pointers only.
- **Degrade gracefully** — no git, or too shallow → fall back to current-state-vs-canon (one pass, no masking possible).
- **The human confirms** irreversible moves.

## Invariants
- **Never change what the knowledge means** — move/reshape/recover on confirmation.
- **No silent break** — old/absent `structureVersion` surfaces loudly.
- **A minor knowie change must not force a migration** — no real drift → no-op.
- **Old curated files are material, not truth** — re-judge by current rules at the right slice; never preserve a stale home in place.
- **Episodes anchor to slices, not whim** — re-running should yield roughly the same set; if it doesn't, the future wasn't masked.
- **Not done until** canon complete (Key Extensions / `skills/` / base-language filenames / `structureVersion` = current) and the old base cross-checked.
