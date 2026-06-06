# History

This directory holds the **causal trail** — why the project became what it is. Not a flat event log, but **decision transitions** and **rejected options**. It's the raw material distilled into experience.md.

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

## File naming
Numbered prefixes keep chronological order: `001-...`, `002-...`.

## Relationship to core files
This is the uncompressed causal trail; the lessons in it distil into **experience.md** (four-part format). A recurring trail, once mature, becomes one experience lesson.
