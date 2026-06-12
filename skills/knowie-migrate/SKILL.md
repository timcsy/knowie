---
name: knowie-migrate
description: Migrate a knowledge base by replaying git forward, sequential masked sub-agents that run capture per slice (carrying the accumulated base), then complete and confirm
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
3. **Replay each slice in a fresh sub-agent — sequential, carrying the accumulated base forward.** *Fresh* means *hasn't seen the future*, **not empty**: give it the **knowledge base built so far** (the accumulated result of earlier slices — masked-built, so safe) **plus** this slice's masked past (`git show <commit>:knowledge/…` + specs + commit messages). The clean context that never saw the ending **is the mask**; the accumulated base is what it builds on and detects transitions against. Instruct it: *do not read the working tree's final code/knowledge* (the future); **process this slice by running `/knowie-capture` — as the developer who just finished it would** (don't re-implement the dispatch; the standard format and the "only a decision-transition → history" rule come from the real skill). Parent writes the output, then moves on.
   - **Sequential, never parallel** — replay is a fold; a parallel agent has no accumulated base → can't detect transitions → `history/` degrades to per-slice summaries.
   - If a sub-agent still leaks (peeks at final code), escalate: a **worktree at the commit** (`git worktree add`) so the future physically isn't there. An external harness is the last resort.

## Steps
1. **Detect minimally** (above) → drift or no-op.
2. **`mv knowledge knowledge.old`** + scaffold a fresh empty `knowledge/` (the canon subdirs).
3. **Slice** `git log` into an ordered list of windows — milestone tags / spec dirs appearing / commit-message arcs. Deterministic skeleton; the cost knob is granularity (coarse = milestones, faster).
4. **Replay forward, sequentially** — one masked sub-agent per slice (above), each carrying the accumulated base. Each **runs `/knowie-capture`** on the slice's increment (the doing that just finished + any open thinking); capture does the dispatch (scene → `episodes`, lesson → `experience`, **only a decision-transition → `history/`**, recurring root → `concepts/`). The migrate-only addition: a decision that **changes an earlier one** (seen by comparing to the accumulated `history/`) → an X→Y transition (mark old `superseded`) + how-leg. Parent **checkpoints** (commit) after each slice.
5. **Propose, human confirms** the irreversible-semantic moves (per slice if they want — see HITL note). Reversible writes are yours.
6. **Complete the canon, then bump `structureVersion`** — all subdirs incl. `skills/` with READMEs; **Key Extensions** tables on the three files; `[](path)` links; root/derived principles; **filenames in the base's language** (see core). Set `.knowie.json` `structureVersion` to current (`"2"`) and **verify it's present**. Then **cross-check against `knowledge.old/`**: did the new base capture the old base's content, re-homed by current rules? Finally drop/keep `knowledge.old/` per the human.

## Dispatch — capture does it; don't re-implement it here
The per-slice dispatch is **`/knowie-capture`'s job** (+ core's "Consolidating is dispatch"). **Running the real skill is what keeps the output in standard format** — a migrate that copies a dispatch table drifts (that's how `history/` became per-slice summaries). migrate adds only what capture-in-live-use can't do:
- **A scene is not a decision** — `episodes/` = the lived scene ("that time"); `history/` = the decision ("why it changed"). A slice yields both.
- **Transitions** — only migrate watches the *timeline*: a decision that reverses/replaces an earlier one → an X→Y entry in `history/` (live capture sees only the current decision; you see the change across slices).
- **how-leg** — each entry links the contemporaneous commit / spec (pointer, not copy; root axiom 2).

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
- **Run the metabolism, don't describe it** — per slice, `/knowie-capture` produces the dispatch; a migrate that re-implements capture's logic drifts from standard (`history/` → per-slice summaries instead of transitions).
- **Sequential, carrying the accumulated base** — *fresh* sub-agent = unseen-future, **not empty**; without the prior state a slice can't detect transitions. Never parallel (replay is a fold).
- **Not done until** canon complete (Key Extensions / `skills/` / base-language filenames / `structureVersion` = current) and the old base cross-checked.
