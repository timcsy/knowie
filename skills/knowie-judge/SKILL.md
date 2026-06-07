---
name: knowie-judge
description: Cross-check the knowledge base for coherence and alignment, detect rot, and tidy — proposing, never committing on its own
user-invocable: true
argument-hint: "[scope: a file, a pair, or an event; empty = full check]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Judge

Check the knowledge base is coherent, aligned with the code, and free of rot — then tidy. Diagnose and operate in one pass, but **propose; never commit on your own** (see core: division of labor).

## 1. Read with evidence
Scan each core file's Key Extensions table for topics the scope hits (or, if empty, derive from recent commits). For every sub-file the table points to: either **read it and attach a verbatim quote + line**, or **say why you skip it**. Never silently skip — the quote is the proof, not your word.

## 2. Reconcile
- **Within each file (structure)**: principles — root present, each derived cites its chain? · vision — milestones have verifiable criteria? · experience — lessons distilled (four-part), not raw events? · any file — a bullet crammed with several claims → propose splitting (readability is per-bullet structure, not line count).
- **Across perspectives**: does the same concept's projection in principles / vision / experience agree, or contradict?
- **Against ground truth (code)**: are the principles actually followed? milestones actually done? the lessons' pitfalls still real? Attach evidence; don't guess.
- Mark 🟢 aligned / 🟡 tension (quote it) / 🔴 conflict (quote + proposed fix).

## 3. Detect rot — mechanically, not from memory
- **Orphans**: any sub-file no Key Extensions table points to.
- **Dead links**: any pointer to a file that's gone or renamed.
- **Stale**: entries referencing deleted code, finished milestones, resolved problems.
- **Backlinks (derive, don't require `[[ ]]`)**: the same scan inverted — `grep '](path'` gives a node's inbound links. Surface them on request, and flag a *materialized* back-edge that's asymmetric (A links B, but an intended B→A is missing). Links are plain `[](path)`; the graph is derived, not stored (see principle 8).
- **Derivation blast-radius**: every derived principle cites its parent. When a principle is challenged or revised, grep those citations to list every dependent (and theirs, transitively) — surface the **full impact set** so a wrong root's downstream (derived principles / vision / experience) gets updated together, not silently left stale. Trace it; don't recall it from memory.
- **Draft↔vision sync (both directions)**: every vision item that links a draft as its design-context → that draft must carry a promotion marker (promoted / in-flight-rationale) — a promoted draft with no marker reads as still-open when it's already committed. Reverse: a draft claiming it's in vision → vision must actually have it. grep both directions; mismatches are stale.
- **Subdir READMEs present**: every knowledge subdirectory (concepts / episodes / history / draft) must have a `README.md` (it orients a third party who's never heard of knowie). `ls */README.md`; a missing one is a gap.

Run these with grep/ls — by eye, both humans and AIs miss them.

## 4. Reflow what was learned — dispatch, don't collapse
A finished roadmap item reflows into several places (don't dump all into one):
- lesson (distilled) → `experience`; its full scene, if recall-worthy → `episodes` (link the lesson to it, and link the episode out to its *how*-artifacts — spec / PR / commit — don't copy them; pin a commit for a regenerable spec).
- decision-transition → `history`; then **retire the roadmap item** (redeem-and-retire) **and its source design draft** — the draft's brainstorming scene, if recall-worthy, also reflows to `episodes`. Only now is the draft let go (it was the in-flight rationale until done).
- challenges a principle? → flag a **proposal to amend root/derived principles**, don't bury it in experience.
- a recurring new thing? → a concept.

## 5. Tidy — batch, each layer its own way
- `concepts/`: converge upward — find the parent-concept (pruning-power test); watch the count flatten.
- `experience/`: two-way — merge similar lessons up; split full scenes down to `episodes`; clear stale.
- `vision/`: redeem-and-retire (done roadmap items reflow out, then leave); wishes not committed → back to `draft/`.
- `draft/`: by review-signal, push each topic **one step along its chain** — experience→consolidate, design→roadmap, problem→find-answer; long-untouched → let go (decay). Recency + frequency, not age. **Exception: a draft linked from an active roadmap item is in-flight design rationale — never reap it; it retires only when its roadmap item completes (§4).**
- `episodes/`: keep only the recall-worthy; let the rest fade.

## 6. Stay within the line
Moving files (reversible) is yours. But **commit, amend root principles, anoint parent-concepts → propose only; wait for the human.**

## Output — evidence, not theater
To the user: a health report (🟢🟡🔴 with quotes) + a prioritized action list + "want me to fix any of these?". Show what you actually read (quotes) and what rot you found (orphans / dead links) — not verbose internal logs.
