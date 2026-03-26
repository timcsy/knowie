# Design

This directory holds architecture designs, technical decision records (ADRs), system designs, and interface specifications.

## When to add a file here

- You're making an architectural decision that affects multiple parts of the system
- You're designing a new component, API, or data model
- You're choosing between approaches and want to document the reasoning
- You're proposing a significant change to existing architecture

## Suggested format

```markdown
# [Design Title]

**Date**: YYYY-MM-DD
**Status**: draft | accepted | superseded

## Context

What situation or need prompted this design?

## Decision

What approach did we choose?

## Rationale

Why this approach over alternatives?

## Consequences

What are the trade-offs? What becomes easier or harder?

## Alternatives Considered

- ...
```

## File naming

Use descriptive topic names: `auth-system.md`, `database-migration-strategy.md`

## Relationship to core files

Key architectural decisions should be reflected in **vision.md** (Architecture section). The design file has the full reasoning; vision.md has the summary. When a design is superseded, update vision.md accordingly.
