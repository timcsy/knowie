---
name: knowie-migrate
description: Reconstruct a knowledge base from git as an encoder-decoder — a bidirectional structure pass over the whole history, parallel causal-masked sub-agents that recover each slice's why, a merge, then rumination against git until it converges
user-invocable: true
argument-hint: "[empty = check this base for structure drift]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Migrate

Bring a knowledge base up to the current structure by **reconstructing the project's why from git**. migrate is an **encoder-decoder over the git history**:

- **Encoder (structure)** — a *bidirectional* pass over the whole history that emits **only structure** (how to slice, the transition/tombstone map). It may see everything, because it produces no why.
- **Decoder (why)** — *causal-masked* sub-agents, one per slice, each **blind to its own future**, recovering the author's why-under-uncertainty. Independent → run them in parallel.
- **Merge** — assemble the masked whys into the encoder's structure; fill the *transition* whys (those legitimately span both ends).
- **Ruminate** — re-read the result **against git** (the fixed text) until it converges; HITL is a denoising step here.

**Detect, propose, confirm.** (CLI `knowie update` pulls skills/templates. `judge` does rot. This skill is only **structure migration**.)

## Why this shape
- **why is causal** — the decoder attends only to a slice's past. Seeing the ending makes you *rationalize* the outcome instead of *inferring* the why under uncertainty (inverse-RL on the trajectory).
- **structure is bidirectional** — a transition only exists *across* its two endpoints, so detecting it legitimately needs both. That's the encoder's job, and it's why transitions are invisible to a single masked slice. Global reach is also what catches a **long-range** transition: an early decision reversed many slices later, which a slice-local view loses.
- **git dates + `--first-parent` order = positional encoding** — without them the parallel passes lose the timeline and replay collapses. So a date is *structural*, not cosmetic.

## What migrate is (its nature)
A **one-shot generative reconstruction → human curation → maintain**. It infers unverifiable why (why has no oracle), so:
- **Structure can converge** — the encoder computes it once from the whole, and rumination refines it against fixed evidence.
- **Why stays a sample** — bounded by no-oracle; re-running yields a different-but-valid intent. Expected, not a bug.

So the gate is **good-enough structure + faithful (masked) why + human curation** — not bitwise idempotence.

## Phase A — Structure (encoder: bidirectional, emits structure ONLY)
Read the whole history; produce a **structure map**, never any why (the masking lives in the decoder — if the encoder wrote why, it would rationalize from the ending).

1. **Detect minimally** — `.knowie.json` `structureVersion` + folder names only; **never read content to detect drift** (reading the final content *is* the contamination). Absent/old version or foreign folders (`research/`, `design/`) → migrate. A current-version base is a no-op **unless the human explicitly asks for a rebuild** (then treat as drift; don't silently no-op a requested re-replay).
2. **Slice by git's shape, not by guessing** — walk `--first-parent`; one slice per merge/PR (the mainline *is* the decision timeline; a branch's internal commits are one decision's *how*). Boundaries come from git's structure, so the skeleton is reproducible. Fallback: pure-linear history → group commit-runs by message-arc/windows (coarser). Find the **adoption commit** (first to introduce `knowledge/`): **coarse** slices before it (no contemporaneous knowledge — why is weakest, mostly inferred), **fine** after (contemporaneous `knowledge/` is the strongest signal).
3. **Classify each unit — what kind of thing is this?** (this is where the category rules live, applied once, globally):
   - **Transition** — a decision that *was in force and then changed* → an X→Y `history/` entry (mark the old `superseded`). Only the encoder sees this (it spans two slices).
   - **Tombstone** — an option *considered then declined, never in force* → a tombstone (what/why-declined/thaw), **grouped into a catalog**, not one `NNN` each. **Not** a transition — don't dress a never-adopted candidate as `舊→新`/`superseded` (the tell: if nothing prior is superseded, it's a tombstone).
   - **Projection edit** — a commit touching **only `knowledge/`** is an edit to the *old projection*, **not a domain event** → **no `history/` transition**. Its content is re-judged by current rules at its authoring slice (an archived lesson → `experience`); the *move* is ignored. (replaying it is how archived-lesson regressions return).
   - **Scene vs decision** — `episodes/` = the lived scene; `history/` = why it changed. A slice usually yields both.

## Phase B — Why (decoder: parallel, causal-masked)
First **re-bootstrap via the real scaffold** — `mv knowledge knowledge.old`, then run the CLI bootstrap (`knowie init` / `scaffoldKnowledge`) to lay the fresh `knowledge/` (canon subdirs **+ subdir READMEs + `.templates/` + `.knowie.json`**, all from the package), **carrying the language read from `knowledge.old/.knowie.json`** (not defaulted to English). Scaffolding is the CLI's *bootstrap*, not AI hand-`mkdir` — this puts the format-convention source (the subdir READMEs) in place *before* the decode. `knowledge.old/` is the end-cross-check reference only — don't read it during the reconstruction.

Then, for each slice, a **fresh sub-agent, causal-masked** — independent, so **run them in parallel** (the speedup; sequential gives the same result). Each is given **only its slice's past**: specs + commit/PR messages, and `git show <commit>:knowledge/…` **after the adoption commit** (none before). Instruct it:
- *Do not read the working tree's final code/knowledge* (its future) — the clean unseen-future context **is** the mask.
- **Run the real metabolism** as the developer who'd just finished that slice would — `/knowie-capture` (+ `/knowie-consolidate` for a now-ripe earlier draft). **Don't re-implement them** — running the real skills is what keeps the output standard-format. The decoder produces only the slice's **local** content + **local stated why**; cross-slice transitions are the encoder/merge's job, so a masked slice needs no accumulated base (this is why parallel is now safe — the old "never parallel" was because slices *used* to do transition detection).
- **Two voices** — a why the author recorded (contemporaneous `knowledge/`/spec/PR) is authoritative; a why reconstructed from a diff is **marked inferred**. **No recoverable why → leave the hole** (record the *what* as an `episodes/` scene, no fabricated transition).
- **Lessons open with "how it hit", not a fabricated expectation** — replaying git you can usually recover *what happened* but rarely *what the author expected*, so the template's first segment has two forms and this is what the second is for: use **How it hit** when the expectation isn't in the record. Don't invent a "Theory said" (that's a fabricated why), and don't drop the opening segment either — a lesson that starts at "what happened" reads as an event log. The three required segments (Actually happened / Lesson / Source) are never optional.
- **Dates from git** — `git show -s --format=%cs <commit>`; use it for the filename prefix, `> 日期：` body, and how-leg. **Never today / the run date** (live-capture muscle memory silently corrupts the timeline). A `draft/` is dated by the slice that *raised* it — "still open" is not "undated".

## Phase C — Merge (assemble; fill transition whys; write)
The orchestrator folds the parallel slice-outputs into Phase A's structure:
- **Fill the transition whys** — for each X→Y in the map, write *why it changed* (the orchestrator sees both ends; this is the legitimate bidirectional why). The slices' **local original whys stay as the masked decoders produced them** — don't overwrite them with hindsight.
- **Dispatch & write** by the real skills' rules and the subdir READMEs: `history/` = `NNN-slug` (transitions; tombstones grouped), `episodes/`/`draft/` = `YYYY-MM-DD-slug` (git date), base-language filenames, how-leg = pointer not copy (root axiom 2).
- **Checkpoint** (commit).

## Phase D — Ruminate (the convergence engine)
Re-read the assembled base **against git — the fixed text** — and refine until it stops changing. Like re-reading scripture: it converges because the source is fixed. **Re-ground each pass to git, never polish your own prior draft** (that telephone-drifts). Each pass:
- run `/knowie-judge` (dead refs, orphans, transition coherence, the cascade detector);
- fix **transcription errors** (a transition pointing at a decision the base never recorded) — that is *correcting the record*, not re-deciding the past, so it's allowed; re-checkpoint.
- **HITL is a denoising step** — the human **reads** and **adds** missing why (you write it); **no mid-pass re-deciding/cutting** (that's a retraction → defer to a separate curation pass). Additive = safe; alteration = defer. Replaying jogs the author's memory, so this is the moment to capture the unwritten why.

**Complete the canon, then bump `structureVersion`** — Key Extensions tables on the three files, `[](path)` links, root/derived principles; confirm subdir READMEs/`.templates/` (already laid in Phase B) and the preserved language; set `.knowie.json` `structureVersion` to current (`"2"`). **Cross-check against `knowledge.old/`** — did the new base capture the old content, re-homed by current rules? Drop/keep `knowledge.old/` per the human.

## Degrade gracefully
No git, or too shallow → fall back to current-state-vs-canon (one pass; no masking possible; say so).

## Invariants
- **Structure is bidirectional, why is causal** — the encoder emits structure only; the decoder is masked to its slice's past. Crossing this is the contamination the whole design exists to prevent.
- **Parallel is safe because transitions are the encoder's job** — masked slices do *local* why only, so they need no accumulated base.
- **Dates/order are positional encoding** — every date is the slice's git commit date, never the run date.
- **Transition ≠ tombstone ≠ projection-edit** — only a decision *in force then changed* is a numbered transition (something gets `superseded`).
- **Run the metabolism, don't describe it** — slices run the real `capture`/`consolidate`; a copied dispatch table drifts.
- **Re-bootstrap via the real scaffold, with the old language.**
- **Ruminate against git, not against yourself** — self-polish drifts.
- **Inferred why is marked; absent why is left blank** — never confident conjecture, never a fabricated transition.
- **Never change what the knowledge means; the human confirms irreversible moves.**
- **Not done until** the canon is complete and `knowledge.old/` cross-checked.
