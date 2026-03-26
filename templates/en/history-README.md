# History

This directory holds event records — what happened, when, and why it mattered. These are the raw material that gets distilled into experience.md.

## When to add a file here

- You just completed a significant milestone or feature
- Something unexpected happened during development
- You made a decision you might need to revisit later
- A debugging session revealed something important about the system

## Suggested format

```markdown
# [Event Title]

**Date**: YYYY-MM-DD

## What Happened

Describe the event — what was built, what broke, what changed.

## Impact

How did this affect the project? What changed as a result?

## Follow-up Actions

- [ ] ...
```

## File naming

Use numbered prefixes to maintain chronological order: `001-initial-setup.md`, `002-auth-migration.md`, `015-performance-crisis.md`

## Relationship to core files

History entries are the raw events. The lessons they teach should be distilled into **experience.md** using the four-part format (Theory said → Actually happened → Resolved by → Lesson). The history file stays here as the detailed record; experience.md has the actionable pattern.
