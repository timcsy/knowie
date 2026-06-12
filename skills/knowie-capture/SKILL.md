---
name: knowie-capture
description: Dispatch a discussion or idea into the knowledge base — split by perspective, sort by maturity
user-invocable: true
argument-hint: "[the idea; or empty to capture the current discussion]"
---

<!-- knowie-core is injected above this line at install time -->

# Knowie Capture

Take a chunk of thinking (a finished discussion, an idea) and **dispatch** it into the knowledge base — route it, don't dump it.

## The move
Split the input into *which kinds* of knowledge it produced, then route each piece by maturity. Writing ≠ dumping into one file.

## Tests — per piece of the input
- **Which perspective?** normative → `principles` · situational → `vision` · existential → `experience` · a recurring root → a `concepts/` file · a "why it changed" → `history/`.
- **Which kind → which exit?** (recognition chain: problem → design → experience)
  - *Experience* (a verified lesson / a pitfall hit) → `experience`; its full scene, if recall-worthy → `episodes` (link them, and link the episode out to the *how* it produced — spec / PR / commit — point out, don't copy; pin a commit for a regenerable spec). Note experience's main source is *doing*'s reflow, not draft.
  - *Design* (a proposal / mechanism) → can't be settled until built+used → park as a `draft/` topic block; **when mature, its exit is the vision roadmap** (a human commits to building it), not direct consolidation. On promotion the roadmap item gets **acceptance criteria** and a **two-way link** to the draft; the draft stays as the in-flight rationale (don't delete it) until the item is done, then it reflows + retires (see judge §4).
  - *Problem* (an open question) → `draft/` topic block; its exit is finding an answer (→ becomes a design or experience).
  - *Rejected option* → tombstone in `history/` with the reason — the richest why; don't drop it for the conclusion alone.

## Two reflexes
- **Don't collapse dimensions.** One discussion usually spans perspectives — don't shove it all into `vision`. Route each piece to where it belongs.
- **When unsure if it's settled → `draft/`, not the three files.** (Captured ≠ committed.)

## Fire without being asked — reliance and pivot are the signals
The misses come from never running capture, not from running it wrong. Two signals should make you capture *on your own*, before being asked:
- **Reliance ≠ captured.** The moment you cite a criterion / lesson / decision as if it's established — "as we decided X", "per X", "this echoes X" — that reliance *is* proof X is load-bearing. **Stop and check X is actually in the base; if not, capture it now.** A vivid, agreed discussion is **not** capture — an idea fresh in context only *feels* stored, and the one you're actively relying on is the most dangerous miss.
- **Topic pivot.** When the thread changes subject, sweep what just got decided/learned for anything not yet in the base — a discussion abandoned for the next question is where capture is lost. (judge backstops both with a mechanical scan for cited-but-uncaptured names.)

## Procedural capture — repeated *doing* → a candidate skill
A second mode: not dispatching a discussion, but noticing you've done the **same operation repeatedly** (scrape-build a dataset, batch-translate…). That's procedural memory forming — capture it.
- **Notice + record a candidate** → a `draft/` block: what the task is + *how* you did it this time. (A candidate is still data/undecided → it incubates in `draft/` like anything else.)
- **On repetition + maturity → the human confirms → consolidate into `knowledge/skills/`** (the cerebellum, source of truth) as one skill: a folder + `SKILL.md` (agentskills.io format) carrying its *why*.
- **Then project it into the present tools' skill dirs so it's usable now.** The source of truth stays in `knowledge/skills/`; *project* it — per-skill **symlink** into each present tool's skill location (`.claude/skills/`, the cross-tool `.agents/skills/`), so edits to the source reach every tool with no drift. **Where symlinks fail (e.g. Windows), copy instead** and note it needs re-sync. It's reversible → **do it yourself; don't make the user run a CLI** for a skill they just made — the AI is present, so the AI does it (CLI is only for AI-absent bootstrap; see core). (judge §5 re-ensures these projections after a fresh clone or when a new tool appears.)
- **Stricter gate than knowledge**: a skill is *executed* (it acts, can fail silently) → consolidating needs firmer human confirmation than committing knowledge.
- **Form**: a *domain* skill automates a mechanical task → it may be procedural/rote (steps), unlike a *meta* skill (judgment). Don't force domain skills into judgment-form.

## Output
Show the dispatch plan (what goes where) first. Write `draft/` directly; for anything in the long-term tier or the roadmap, write only on confirmation.
