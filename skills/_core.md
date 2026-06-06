<!--
  knowie core — single source of truth, shared by every skill.
  The CLI injects this into each SKILL.md at scaffold/update time
  (skills must be self-contained; they don't read this file at runtime).
  Written in English; the AI translates output to the user's language
  (knowledge/.knowie.json → language).
-->

# Knowie Core

**What knowie is**: a project's *why* memory — the knowledge code can't hold, and that has no oracle to catch when it rots. It's a protocol parasitic on markdown: any AI that can read/write files can use it.

## Root axioms (never violate)
1. **One concept, many projections.** Organize by concept.
2. **Keep why, not what.** Code is the source of truth for *what*; don't duplicate it (redundant, and drifts from code).

## Structure
- `principles` / `vision` / `experience` = the normative / situational / existential perspectives; the three entry points.
- Inside `principles`: **root principles** (very stable, rarely change) + **derived principles** (derived from root, may evolve, must cite their derivation, must not contradict root).
- Detail sinks into `concepts/` **by concept**.
- `history/` = causal trail (why things became what they are).
- `draft/` = short-term memory: undecided things; decays by default, consolidated only when repeatedly used.

## Invariants (MUST)
- **Captured ≠ committed.** Undecided → `draft/`; writing into the three files or root principles needs human confirmation.
- **Record transitions, not just states.** Every change leaves a "why it changed"; mark the old one `superseded` and link to the new — don't delete.
- **Root principles stay stable.** Changing them takes a special path + a recorded reason; their churn should approach zero.
- **Converge.** Re-running a tidy should be near no-op; concepts converge toward few roots.
- **Answer to ground truth.** Any claim of "read it / compared it" attaches a verbatim quote + line number (user can grep). No silent skipping, no self-reported coverage.

## Tests (to judge, not to enumerate cases)
- **Qualifies as a concept?** → Does it project onto all three perspectives? Strong in only one → still a single lesson/principle; keep in `draft/`.
- **Record the causality?** → Would a future reader be confused ("didn't we say X?")? Yes → record.
- **Real parent-concept or fake?** → Does it have pruning power? Vague enough to hold anything = bad abstraction.
- **Keep or cut (any mechanism / phrase)?** → If cut, could an AI quietly skip it and no one notice? Yes → keep; No → cut.

## Division of labor
- **AI does the reversible, mechanical**: move, index, prune, detect, draft.
- **Human does the irreversible, semantic**: commit, amend root principles, anoint parent-concepts. AI proposes; it never writes into the long-term tier on its own.

## How these skills are written (they obey this too)
- Give **tests + reasons**, not exhaustive steps (contexts are infinite; only tests generalize).
- Whatever can live in structure (templates / filenames / indexes) shouldn't be written into instructions.
- Necessary friction (what plugs a hole) stays — compressed to one line; theater (what only looks good) is cut.
