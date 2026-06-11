# History

This directory holds the **causal trail** — why the project became what it is. Not a flat event log, but **decision transitions** and **rejected options**. It's the raw material distilled into experience.md.

> Why `history`, not `migrations` / `decisions` (a tombstone for the rejected names): `migrations` means **structural changes only** and is **software-specific**; `decisions` drops the transition/superseded dimension. `history` is the most universal — it covers decision transitions, rejected options, and the system's own evolution, in any domain.

## When to add a file here
- A decision **supersedes** an earlier one — record the old, the new, and **why it changed**; mark the old superseded and link to the new.
- An option was **rejected** — leave a **tombstone**: what was considered, and **why not** (the richest why).
- A debugging session or milestone revealed an important turn.

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
Numbered prefixes keep causal order: `001-...`, `002-...` (NNN is the key — don't put the date in the filename, that mixes two axes: number + time).
Put the date in the body (`> Date: YYYY-MM-DD`), to the **day**: time is over-precision — the NNN prefix already orders same-day transitions. (A date lets time-based health metrics like "root-principle churn rate" be computed.)

## Relationship to core files
This is the uncompressed causal trail; the lessons in it distil into **experience.md** (four-part format). A recurring trail, once mature, becomes one experience lesson.
