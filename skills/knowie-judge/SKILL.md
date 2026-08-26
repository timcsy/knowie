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
- **Within each file (structure)** — check each separately:
  - `principles` — root present? each derived principle cites its chain?
  - `vision` — milestones have verifiable criteria? **and does the body stay forward-looking** (stable positioning + a live roadmap only — no completed-stage sediment: delivery logs, obsolete "current state" snapshots, lifted caveats accreting inline)?
  - `experience` — lessons distilled (four-part), not raw events?
  - any file — a bullet crammed with several claims → propose splitting (readability is per-bullet structure, not line count).
- **Across perspectives**: does the same concept's projection in principles / vision / experience agree, or contradict?
- **Against ground truth (code)**: are the principles actually followed? milestones actually done? the lessons' pitfalls still real? Attach evidence; don't guess.
- Mark 🟢 aligned / 🟡 tension (quote it) / 🔴 conflict (quote + proposed fix).

## 3. Detect rot — mechanically, not from memory
- **Orphans**: any sub-file no Key Extensions table points to.
- **Dead links**: any pointer to a file that's gone or renamed. Skip link syntax inside inline code or fenced blocks — those are *illustrations*, not pointers. **Dead links a *pending* retirement would create are not rot** — they're the re-point worklist: quote that count as the size of step 2 (§4), never as a reason to keep the file.
- **Conceptual dead references**: dead links, one level up — a *named* criterion / lesson / concept cited as established ("see X", "echoes X", "the X principle") with no file or heading defining it. grep the citations against the actual concept/lesson titles. A name relied on but never captured means a vivid discussion was mistaken for a stored one (backstops capture's reliance trigger) → flag it to be captured.
- **Stale**: entries referencing deleted code, finished milestones, resolved problems.
- **Backlinks (derive, don't require `[[ ]]`)**: the same scan inverted — `grep '](path'` gives a node's inbound links. Surface them on request, and flag a *materialized* back-edge that's asymmetric (A links B, but an intended B→A is missing).
- **Derivation blast-radius**: every derived principle cites its parent. When a principle is challenged or revised, grep those citations to list every dependent (and theirs, transitively) — surface the **full impact set**, so a wrong root's downstream (derived principles / vision / experience) gets updated together instead of silently left stale.
- **Draft↔vision sync (both directions)**: every vision item that links a draft as design-context → that draft must carry a promotion marker (promoted / in-flight-rationale), or it reads as still-open when it's already committed. Reverse: a draft claiming it's in vision → vision must actually have it. grep both directions; mismatches are stale.
- **Retirement debt — the completed side of that sync**: grep vision for `[x]` items that still link a `draft/` file. Each is **overdue**, not in-flight — §5's exception protects *active* items only, so an in-flight marker on a done item's draft is the debt's disguise, not its clearance. Absolutes, not ratios (unlike done:open below): retirement is event-triggered, so the healthy number is **0**. Report as one 🔴 with `grep -c '](draft/'` beside it — that inbound count is the re-point worklist, not a second finding.
- **Subdir READMEs present**: every knowledge subdirectory (concepts / episodes / history / draft) must have a `README.md` (it orients a third party who's never heard of knowie). `ls */README.md`; a missing one is a gap.
- **`history/` shape — transition or completion?**: grep the **old side** of each entry's transition block. If it reads "not yet / only X / just a draft / none", nothing was in force, so nothing was superseded — that's a **progress bar** → 🔴, it belongs in the commit/CHANGELOG plus an `episodes` scene.
- **Vision's done:open ratio**: `grep -c '\[x\]'` vs `grep -c '\[ \]'` in vision. Past roughly **3:1** the redeem-and-retire loop (§5) isn't running — vision is accumulating completions instead of pointing forward.
- **Link notation first — an orphan rate is meaningless until the pointers are greppable**: before any graph number, measure non-compliant pointers. Non-compliant = a `[[wikilink]]` **with content** (an empty `[[ ]]` is prose *about* the notation), or a backtick `` `path.md` `` **that resolves to a real file in this base** and isn't generic (`SKILL.md`, `README.md`, the three core files). Both are edges an AI can follow by name but **grep cannot see**, so every downstream number comes out wrong — and wrong in the direction that reads as catastrophic. Past **~10%**, that *is* the finding ("N pointers aren't `[]()` — converting them is find-and-replace"); label the orphan rate "pending notation fix".
- **Whole-tier orphan rate** (only once notation is clean): if **>80%** of a subdirectory's files have no inbound link, that isn't N orphans — it's a tier that was never wired into any Key Extensions table. Report it as **one 🔴** ("nothing in here can ever be recalled"), not N 🟡 that scroll past as noise.
- **Lessons missing a source**: for each `###` lesson in experience, is there a source pointer (a link into `history/` / `episodes/`, a commit, or a source line)? Missing → the *how*-leg is gone and root axiom 2 (roughly reconstructable) is broken: the conclusion survives, the occasion that produced it doesn't.
- **Filenames with spaces**: a space makes `%20`-encoded and literal links disagree, so half the pointers to that file break silently. Rename to `-`.
- **Undocumented decisions**: a notable change (a skill or subdir added/removed, a feature killed, a principle revised, a convention set) should leave a `history/` transition — its durable idea may also belong in a `concept`, its scene in an `episode`. Scan recent commits / the current structure against `history/`; a decision with **no causal record** is a hole. §4's reflow only fires on *finished roadmap items*, so decisions made outside that flow reach you only here.

Run these with grep/ls — by eye, both humans and AIs miss them.

## 4. Reflow what was learned — dispatch, don't collapse
A finished roadmap item reflows into several places (don't dump all into one):
- lesson (distilled) → `experience`; its full scene, if recall-worthy → `episodes` (link the lesson to it, and link the episode out to its *how*-artifacts — spec / PR / commit — don't copy them; pin a commit for a regenerable spec).
- decision-transition → `history`; then **retire the roadmap item** (redeem-and-retire) **and its source design draft** — the draft's brainstorming scene, if recall-worthy, also reflows to `episodes`. Only now is the draft let go (it was the in-flight rationale until done). **Extract → re-point → delete, in that order** — delete-first loses the only irreproducible part (options weighed, numbers actually measured). **A batch delete that skips extraction is silent data loss that leaves every check green.**
- challenges a principle? → flag a **proposal to amend root/derived principles**, don't bury it in experience.
- a recurring new thing? → a concept.

## 5. Tidy — batch, each layer its own way
- `concepts/`: converge upward — find the parent-concept (pruning-power test); watch the count flatten.
- `experience/`: two-way — merge similar lessons up; split full scenes down to `episodes`; clear stale.
- `vision/`: **redeem-and-retire, then converge** — a done roadmap item reflows out (§4), then collapses to a **one-line result + a pointer** to its `history/` transition; its delivery detail, obsolete "current state" snapshot, and lifted caveats **retire** to `episodes` (scene) / `history` (transition) rather than sediment in the body (see core: *marking in place is not dispatch*). Keep the body's two modes apart: stable positioning (slow) + a live roadmap of future/in-flight only; completed → a thin milestone index. Wishes not committed → back to `draft/`. **Test:** does this line say *where next*? If it says *what we finished*, converge it to a pointer.
- `draft/`: by review-signal, push each topic **one step along its chain** — experience→consolidate, design→roadmap, problem→find-answer; long-untouched → let go (decay). Recency + frequency, not age. (The human-initiated version of this consolidate is `/knowie-consolidate`.) **Exception: a draft linked from an active roadmap item is in-flight design rationale — never reap it; it retires only when its roadmap item completes (§4).**
- `episodes/`: keep only the recall-worthy; let the rest fade.
- `skills/`: **detection backstop** — a recurring operation (across episodes / history / git) with no skill → flag a **skill candidate** (same recurrence-scan as draft's review-signal; capture records, human confirms). A stale/unused skill → flag for retirement: a stale skill *acts*, a stale doc only misleads, so don't let it rot loadable.
  - **Re-ensure projections** (reversible → just do it): each skill in `knowledge/skills/` (the source) gets a per-skill symlink in **every** dir listed in `knowledge/.knowie.json` → `skillDirs`. **Enumerate that list — never project only into the dir you happen to read yourself.** (No `skillDirs` key = a base predating it → run `npx knowie update`.) Heal missing/broken ones; copy-fallback where symlinks fail (Windows). **Symlinks MUST be relative** (`../../knowledge/skills/<name>`) — an absolute one breaks on every other checkout; rewrite any you find.

## 6. Stay within the line
Moving files (reversible) is yours. But **commit, amend root principles, anoint parent-concepts → propose only; wait for the human.**

## Output — evidence, not theater
To the user: a health report (🟢🟡🔴 with quotes) + a prioritized action list + "want me to fix any of these?". Show what you actually read (quotes) and what rot you found (orphans / dead links) — not verbose internal logs.
