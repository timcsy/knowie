---
name: knowie-migrate
description: Migrate a knowledge base by replaying git forward, sequential masked sub-agents that run the real metabolism (capture/consolidate) per slice carrying the accumulated base, then complete and confirm
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
3. **Replay each slice in a fresh sub-agent — sequential, carrying the accumulated base forward.** *Fresh* means *hasn't seen the future*, **not empty**: give it the **knowledge base built so far** (the accumulated result of earlier slices — masked-built, so safe) **plus** this slice's masked past — specs + commit/PR messages, and `git show <commit>:knowledge/…` **only after the adoption commit** (before it there's none; see the adoption-phase section). The clean context that never saw the ending **is the mask**; the accumulated base is what it builds on and detects transitions against. Instruct it: *do not read the working tree's final code/knowledge* (the future); **process this slice by running the real metabolism, as the developer who just finished it would** — mainly `/knowie-capture` (reflow the doing, draft open thinking), plus `/knowie-consolidate` for any earlier-slice draft that's ripened by now, and whatever else the moment calls for. **Don't re-implement any of them** — the standard format and the "only a decision-transition → history" rule come from the real skills. **Treat a `knowledge/`-only commit as an old projection edit, not work to re-enact** (see that section) — read the state it left as reference, but don't reproduce the knowledge-housekeeping as a `history/` entry. Parent writes the output, then moves on.
   - **Sequential, never parallel** — replay is a fold; a parallel agent has no accumulated base → can't detect transitions → `history/` degrades to per-slice summaries.
   - If a sub-agent still leaks (peeks at final code), escalate: a **worktree at the commit** (`git worktree add`) so the future physically isn't there. An external harness is the last resort.

## Slice along git structure, not by guesswork
Real history is a DAG with messy commits — no clean milestone tags. **Don't ask an LLM to read commit messages and guess boundaries** — that smuggles non-determinism back in through the slicer. Let git's own shape give the slices:
- **Walk `--first-parent` mainline.** Each merge collapses its feature branch into one step. The mainline **is** the decision timeline (DDD *domain events*); a branch's internal commits are the *how* of one decision (*technical events*) — exactly what `history/` records vs. omits. So `--first-parent` isn't a shortcut, it's the correct projection of "history is decision-transitions, not every commit."
- **One slice per merge / PR.** A PR is already a unit of intended change — title, description, the why of that chunk. Boundaries are git-structural, so re-running yields the same skeleton (the determinism the masking depends on).
- **Fallbacks:** pure-linear history with no merges → group commit-runs by message-arc / fixed windows, and accept coarser granularity. Rebased history is *more* linear, not less — replay is fine; you only lose true temporal order (an acceptable proxy).

## The adoption commit is a phase boundary
migrate quietly serves **two** operations with very different evidence: *structure migration* (knowie present from day 1, just restructure) and *archaeological backfill* (knowie adopted midway, reconstruct the earlier why). The seam between them is the **adoption commit** — the first commit that introduces `knowledge/`. Find it; let granularity follow the evidence:
- **Before adoption** — no contemporaneous `knowledge/` to read. **Coarse** slices; reconstruct a rough "where the project had got to by adoption" baseline from code / spec / PR only. The why here is weakest — most of it is *inferred*, so mark it as such (see Guardrails) and lean on HITL.
- **After adoption** — `knowledge/` exists at each commit. **Fine** slices; the author's contemporaneous why is the strongest signal — read `git show <commit>:knowledge/…` and run the real metabolism per slice.
- So "read the contemporaneous knowledge" is an **enrichment when present, not a precondition** — degrade per-slice (read it after adoption; fall back to code/spec/PR before), never all-or-nothing. Most real adoptions are midway, so the pre-adoption stretch is the common case, not the edge.

## A `knowledge/`-only commit is an old *projection edit*, not an event to replay ⭐
In the event-sourcing frame migrate runs on: **git = the event log, `knowledge/` = a projection.** Replay rebuilds the projection *fresh* from the **domain events** — the commits that change code / spec / the product's actual why. A commit whose diff touches **only `knowledge/`** is **not a domain event** — it's an edit to the *old* projection, the old knowledge metabolism performed under the *old* rules. Replaying it is a category error: like re-applying a stale materialized-view update on top of the view you just rebuilt.

So when walking the slices:
- **A `knowledge/`-only commit produces no `history/` transition.** Don't faithfully reproduce what it did. Read the contemporaneous `knowledge/` *state* it left as reference (the adoption-phase enrichment), but the *act* of editing the knowledge base is not an event to re-enact.
- **Old-rule curation is re-judged, not replayed.** If the author once moved content under old rules (e.g. archived M1 lessons `experience → history/` because the old structure put lessons there), the **content** is re-homed by **current** rules at its *original authoring slice* (a lesson → `experience`, where it was first learned), and the **move itself is ignored**. Faithfully replaying that move is exactly how `history/001-early-lessons`-type regressions come back — a knowledge-housekeeping commit gets mistaken for a domain decision.
- **The tell:** before writing a `history/` transition, ask *"did the project's why change here (code/spec/product), or did someone just reorganize the knowledge base?"* Only the former is a transition.

## Steps
1. **Detect minimally** (above) → drift or no-op.
2. **`mv knowledge knowledge.old`** + scaffold a fresh empty `knowledge/` (the canon subdirs).
3. **Slice along git structure, not by guesswork** (see the section below) — find the **adoption commit**, then walk `--first-parent` mainline, one slice per merge/PR. Coarse before adoption, fine after. Deterministic skeleton — the boundaries come from git's shape, not an LLM's reading.
4. **Replay forward, sequentially** — one masked sub-agent per slice (above), each carrying the accumulated base. Each **runs the real metabolism** on the slice's increment — `/knowie-capture` (doing just finished + open thinking) and `/knowie-consolidate` (a now-ripe earlier draft); the skills do the dispatch (scene → `episodes`, lesson → `experience`, **only a decision-transition → `history/`**, recurring root → `concepts/`). The migrate-only addition: a decision that **changes an earlier one** (seen by comparing to the accumulated `history/`) → an X→Y transition (mark old `superseded`) + how-leg. Parent **checkpoints** (commit) after each slice; optionally `/knowie-judge` every few checkpoints to keep the growing base coherent.
5. **Propose, human confirms** the irreversible-semantic moves (per slice if they want — see HITL note). Reversible writes are yours.
6. **Complete the canon, then bump `structureVersion`** — all subdirs incl. `skills/` with READMEs; **Key Extensions** tables on the three files; `[](path)` links; root/derived principles; **filenames in the base's language** (see core). Set `.knowie.json` `structureVersion` to current (`"2"`) and **verify it's present**. Then **cross-check against `knowledge.old/`**: did the new base capture the old base's content, re-homed by current rules? Finally drop/keep `knowledge.old/` per the human.

## Dispatch — the real skills do it; don't re-implement it here
The per-slice dispatch is the **real skills' job** (`/knowie-capture`, `/knowie-consolidate`, + core's "Consolidating is dispatch"). **Running the real skills is what keeps the output in standard format** — a migrate that copies a dispatch table drifts (that's how `history/` became per-slice summaries). migrate adds only what they can't do in live use:
- **A scene is not a decision** — `episodes/` = the lived scene ("that time"); `history/` = the decision ("why it changed"). A slice yields both.
- **Transitions** — only migrate watches the *timeline*: a *domain* decision that reverses/replaces an earlier one → an X→Y entry in `history/` (live capture sees only the current decision; you see the change across slices). A *knowledge-base* reorganization is not a transition (see the projection-edit rule above).
- **how-leg** — each entry links the contemporaneous commit / spec (pointer, not copy; root axiom 2).

## HITL during replay (read + additive only — don't break monotonicity)
Replaying forward jogs the author's memory — the richest why (real intent, dead-ends) is in their head, unwritten. So the human may **read** the replay and **add** missing why (you write it as annotation). But **no re-deciding / cutting / reshaping mid-replay** — that's a retraction, it breaks the monotonic accumulation and cascades (butterfly). Curation (cut/merge/reshape) is a *separate later pass* on the finished faithful base. Additive = safe; alteration = defer.

**Correcting the record ≠ re-deciding the past.** The monotonicity ban is only on *re-litigating what the project actually decided* (hindsight overruling history). Fixing a **transcription error** — a slice mis-recorded what genuinely happened (e.g. a `history/` transition points at a decision the accumulated base never recorded — a dead reference `judge` catches) — is not a retraction; **fix it and re-checkpoint.** Conflating the two would let early mistakes compound untouched (the cascade). The firebreaks are already here: **checkpoint after each slice**, and **`/knowie-judge` every few checkpoints** is the cascade detector — it greps for the incoherence a mis-slice introduces before it propagates further.

## Guardrails
- **Don't read the final state during replay** — that's the contamination. Old knowledge is moved aside; final code is masked per slice (sub-agent / worktree).
- **Reconstruct for judgment, don't import the what** — write why + pointers only.
- **Two voices: stated-why vs inferred-why.** A why the author actually recorded (contemporaneous `knowledge/`, a spec, a PR description of intent) is authoritative; a why you reconstructed from a diff is **conjecture — mark it as inferred**, don't write it in the same confident voice. HITL then targets the conjectures first (confirm/correct my guess is the highest-value jog). Why has no oracle and git can't verify it — so make the uncertainty visible, don't launder it into false confidence.
- **No recoverable why → leave the hole, don't fabricate.** A commit with no inferrable intent is recorded as *what changed* (an `episodes/` scene), with **no `history/` transition** — an honest gap beats a confident fiction. (Most relevant in the pre-adoption stretch, where why is weakest.)
- **Degrade gracefully** — no git, or too shallow → fall back to current-state-vs-canon (one pass, no masking possible).
- **The human confirms** irreversible moves.

## Invariants
- **Never change what the knowledge means** — move/reshape/recover on confirmation.
- **No silent break** — old/absent `structureVersion` surfaces loudly.
- **A minor knowie change must not force a migration** — no real drift → no-op.
- **Old curated files are material, not truth** — re-judge by current rules at the right slice; never preserve a stale home in place.
- **`knowledge/`-only commits are old projection edits, not events** — they yield no `history/` transition; read the state they left as reference, re-home their content by current rules at its authoring slice, ignore the move itself. Replaying a knowledge-housekeeping commit as a domain decision is how `history/001-early-lessons`-type regressions return.
- **Episodes anchor to slices, not whim** — re-running should yield roughly the same set; if it doesn't, the future wasn't masked.
- **Run the metabolism, don't describe it** — per slice, the real skills (`capture` / `consolidate` / whatever the moment calls for) produce the dispatch; a migrate that re-implements their logic drifts from standard (`history/` → per-slice summaries instead of transitions).
- **Sequential, carrying the accumulated base** — *fresh* sub-agent = unseen-future, **not empty**; without the prior state a slice can't detect transitions. Never parallel (replay is a fold).
- **Inferred why is marked, absent why is left blank** — never write conjecture in the authoritative voice, never fabricate a transition for a why you can't recover.
- **Correcting the record is allowed; re-deciding the past is not** — fixing a mis-transcribed slice isn't a retraction; checkpoints + periodic `judge` are the cascade firebreak.
- **Slices come from git's shape, not an LLM's reading** — `--first-parent` mainline, one per merge/PR. A semantic slicer reintroduces the non-determinism the masking exists to remove.
- **The adoption commit splits evidence regimes** — coarse archaeology (inferred why) before it, fine replay (contemporaneous knowledge) after. Reading the old `knowledge/` is enrichment-when-present, never a precondition; most real adoptions are midway.
- **Not done until** canon complete (Key Extensions / `skills/` / base-language filenames / `structureVersion` = current) and the old base cross-checked.
