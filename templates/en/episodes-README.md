# episodes — episodic memory (recall units)

Holds the full lived experiences worth recalling — the complete scene of one act of cognition. It's the story behind an experience lesson or a history decision; you can return to "what actually happened" later.

## What goes here
- When something is **fully done / settled** AND **significant, likely to revisit later** → save an episode.
- Most things are **not** kept — distil into an experience lesson / history decision and let the scene fade (heavy decay is normal).
- Still has open parts → stays in `draft/` (in-flight rationale, not yet a finished scene).

## Structure (the inverse of concepts)
| | concepts (semantic) | episodes (episodic) |
|---|---|---|
| Axis | by concept | **by time** (autobiographical) |
| Reduce | converge upward (merge) | **never merge** (each stands alone, append-only) |
| Shrink | distillation | **decay** (drop the non-recall-worthy, don't merge) |

- **Filename**: `YYYY-MM-DD-what-it-was.md` (date + one line). For one reflowed on redeem-and-retire, use the roadmap item's **completion date** (stamped in vision).
- **File body = a recall unit**: why / how (which options were weighed) / which concepts / outcome, with `[](path)` links back to the experience lesson or history decision it backs.
- **Link the "how" to external artifacts**: the *how* often has code/SDD-world artifacts — a **spec (e.g. Spec Kit), PR, commit**. Link them with `[](path)` — **point out, don't copy** (they're what/how, owned by code/SDD; knowie keeps the why + a pointer). For a spec that gets regenerated, pin a **commit/SHA** (link the version as it was), else it's changed by the time you look back.
- **Link direction**: one experience/history ← many episodes (the lesson/decision links down to its scenes).
- **No heavy index, no premature subfolders** (both fight decay; split by year only once one folder overflows).
