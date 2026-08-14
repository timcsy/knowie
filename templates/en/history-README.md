# History

This directory holds the **causal trail** — why the project became what it is. Not a flat event log, but **decision transitions** and **rejected options**. It's the raw material distilled into experience.md.

## When to add a file here
- A decision **supersedes** an earlier one — record the old, the new, and **why it changed**; mark the old superseded and link to the new.
- An option was **rejected** — leave a **tombstone**: what was considered, and **why not** (the richest why).
- A debugging session or milestone **revealed a pivot** — a prior decision or assumption changed. (The pivot is the entry; the fact that something shipped is not.)

## Not here — a completion is not a transition
"Shipped feature X / tests green / increment done" is **not** a transition, even under a "Transition" heading. That belongs in the commit / CHANGELOG (the *how*-leg) and, if the exploration is recall-worthy, an `episodes/` scene; its lesson distils into `experience.md`. Only add a file here if a decision actually **changed**.
**Test:** delete the delivery/test lines from the entry — if an "old → new, and why it changed" remains, it's history; if only "we finished it" remains, it isn't. (One entry per shipped increment is the smell.)

## Suggested format

```markdown
# [NNN]: from [old] to [new]
> Date: YYYY-MM-DD

## Transition
- Old: ...
- New: ...

## Why it changed
...

## Status
✅ adopted  /  ⚰️ rejected (reason)
```

## File naming & date
Numbered prefixes keep causal order: `001-...`, `002-...` (NNN is the key — don't put the date in the filename, that mixes two axes: number + time). Use `-` instead of spaces; a space breaks half the links to the file.

**Let the filename read as the diff**: `002-from-managed-paas-to-a-self-hosted-vps` tells you the transition without opening it. If you can't phrase the name as "from X to Y" (or "rejected X"), that's the tell you're looking at a completion, not a transition — see "Not here — a completion is not a transition" above.
Put the date in the body (`> Date: YYYY-MM-DD`), to the **day**: time is over-precision — the NNN prefix already orders same-day transitions. (A date lets time-based health metrics like "root-principle churn rate" be computed.)

## Relationship to core files
This is the uncompressed causal trail; the lessons in it distil into **experience.md** (four-part format). A recurring trail, once mature, becomes one experience lesson.
