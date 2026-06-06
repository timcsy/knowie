---
name: knowie-next
description: Plan the next step as a brief grounded in vision, principles, and experience — then carry it into the spec
user-invocable: true
argument-hint: "[a direction or feature; empty = infer from vision + recent commits]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Next

Turn the knowledge base into a **structured plan** for the next step, and carry the *why* into the spec tool so it's obeyed during implementation.

## Steps
1. **Check `draft/` for ripe items first.** Before planning, scan `draft/` for any topic mature enough to graduate (recognition chain: a *design* settled enough to commit → its exit is the **vision roadmap**; an *experience/insight* verified enough → consolidate). Surface these — never silently build a design straight from `draft/`; a design must become a roadmap item (the human-commit gate) before it's implemented.
2. **Read with evidence** — attach a verbatim quote for whatever you rely on.
3. **Retrieve — recall over precision.** Pull everything relevant from all three perspectives; missing a relevant one is worse than one extra (retrieval recall is the bottleneck for adherence).
4. **Write the plan as a brief, organized by the three perspectives** (below).
5. **Hand off** — give the brief's cautions to the spec tool. Suggest only; never auto-implement, never auto-invoke another skill.

## The plan — a brief grounded in all three perspectives
Every line cites where it comes from; skip a line if empty.

**Next: [name] — [one-line]** · roadmap position: [phase / milestone]

- **From vision** (the roadmap / situational):
  - **Prerequisites** — verify against the *code*, not just what vision says.
  - **In scope** / **Out of scope** — state exclusions explicitly, to prevent scope creep.
  - **Acceptance** — concrete, verifiable criteria.
- **From principles** (normative):
  - Which principle this serves — **quote it + show the derivation chain**. Can't trace to one? Flag it a pragmatic choice, not a principled one.
- **From experience** (existential):
  - Relevant lesson — **quote it + how to apply**.
  - **Risks** (from past pitfalls) + mitigation.
  - **Other routes considered** + why not — the rejected options carry the richest *why*.

## Output — end with a choice, don't auto-act
After the brief, if step 1 found ripe `draft/` items, end with the option:
**"Before we start, promote these first? (design → roadmap, then build it through the roadmap; insight → consolidate.)"** — list them. The human decides; you propose. This is the gate that keeps a design from being built straight out of `draft/`.

Promoting is a **dispatch, not a relocation** (see core: *Consolidating is dispatch*) — direction → roadmap/`experience`, recurring concept → `concepts/`, brainstorming scene → `episodes/`, transition → `history/`. Ask the human which pieces to keep; let the rest of the draft fade.

## Invariant
Every recommendation traces to vision / principles / experience. Nothing from thin air — if there's no relevant knowledge for a point, say so explicitly.
