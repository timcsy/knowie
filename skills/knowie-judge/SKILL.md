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

Run these with grep/ls — by eye, both humans and AIs miss them.

## 4. Reflow what was learned — dispatch, don't collapse
New lessons default to `experience`, but sieve first:
- challenges a principle? → flag as a **proposal to amend root/derived principles** — don't bury it in experience.
- changes the roadmap? → vision. · a recurring new thing? → a concept.

## 5. Tidy — batch, keep it converging
- Core file overflowing → sink detail into `concepts/` **by concept**; update that layer's summary incrementally (don't re-read the whole subtree).
- Too many concepts → find the parent-concept and converge (pruning-power test); watch the concept count flatten.
- Visit `draft/`: by git recency, find the longest-untouched topics → for each, **rescue (consolidate) or let go (decay)**. Recency + frequency, not age.

## 6. Stay within the line
Moving files (reversible) is yours. But **commit, amend root principles, anoint parent-concepts → propose only; wait for the human.**

## Output — evidence, not theater
To the user: a health report (🟢🟡🔴 with quotes) + a prioritized action list + "want me to fix any of these?". Show what you actually read (quotes) and what rot you found (orphans / dead links) — not verbose internal logs.
