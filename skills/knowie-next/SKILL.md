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
3. **Retrieve — recall over precision.** Pull everything relevant from all three perspectives **and `knowledge/skills/`** — a learned skill that does this step → recommend *using* it, don't re-plan it from scratch. Missing a relevant one is worse than one extra (retrieval recall is the bottleneck for adherence).
4. **Write the plan as a brief, organized by the three perspectives** (below).
5. **Hand off** — give the brief's cautions to the spec tool. Suggest only; never auto-implement, never auto-invoke another skill.

## The plan — a brief grounded in all three perspectives
Every line cites where it comes from; skip a line if empty.

**The next step is the *best* move, not necessarily the roadmap's sequential item.** next may re-prioritize, jump roadmap order, or flag a **re-route** (a committed route found wrong → say so and make admitting it cheap). Justify the jump from the three perspectives like any recommendation. Guardrail: a *new* route still passes the gate (draft → roadmap) before it's built — jumping ≠ bypassing the commit gate.

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
**"Before we start, promote these first? (design → roadmap, then build it through the roadmap; insight → consolidate.)"** — list them. The human decides; you propose. This is the gate that keeps a design from being built straight out of `draft/`. (For a focused, human-initiated consolidate outside planning, that's `/knowie-crystallize`.)

Promoting is a **dispatch, not a relocation** (see core: *Consolidating is dispatch*) — direction → roadmap/`experience`, recurring concept → `concepts/`, brainstorming scene → `episodes/`, transition → `history/`. A new roadmap item carries **acceptance criteria** (verifiable) and a **two-way link** to its design draft. The draft is **not deleted** — it stays as the in-flight design rationale until the item is done (then it reflows + retires, judge §4). Only the pieces already dispatched elsewhere (concept, transition) leave the draft.

## Skill candidate — the prevention catch
If the planned step is a **repeated manual operation** with no skill yet → flag it a **skill candidate** (prevention: skill it *before* doing it manually again; capture records it, the human confirms). next is the earliest, cheapest catch of repetition — before the next manual redo. (judge catches what slips through, later.)

## Invariant
Every recommendation traces to vision / principles / experience. Nothing from thin air — if there's no relevant knowledge for a point, say so explicitly.
