---
name: knowie-next
description: Plan the next step based on project knowledge
user-invocable: true
argument-hint: "[direction or feature area to explore]"
---

# Knowie Next

Help the user decide and plan what to work on next, grounded in the project's principles, vision, and experience.

## User Input

```text
$ARGUMENTS
```

## Governance Principles

- **Principles are the highest authority.** Every recommendation must be traceable to a principle. If it isn't, flag it as a pragmatic choice.
- **Vision is the roadmap.** Follow the established order unless experience provides compelling reason to deviate.
- **Experience is the guardrail.** Always check for relevant lessons before recommending an approach.
- **Never auto-invoke other skills.** Only suggest them.

## Workflow

### 0. Load state file (mandatory, first step)

Read `knowledge/.knowie-state.yaml`. If missing, treat as stub (`version: 1` + empty `sub_files`).
Extract **debt list** = all sub-files with `skipped_in_a_row >= 3`.

Sub-files in the debt list **MUST** appear in the Phase A contract marked
`fresh-read` OR `propose-row-removal`. Silent skip again is not allowed.

### 1. Read knowledge files

Read all three core files:
- `knowledge/principles.md`
- `knowledge/vision.md`
- `knowledge/experience.md`

### Output discipline (applies to all of Step 1.5 / 1.6 / 4.5)

Phase A contract, Phase B evidence, and state diff are **internal mechanics**.
They are computed, executed, and written to `knowledge/.knowie-state.yaml`
but **MUST NOT** be printed verbatim in the user-facing output.

User-facing output structure:

1. The recommendation block (Step 4 template)
2. A **Reading audit footer** ≤ 5 lines, NOT YAML:
   - Line 1: fresh-read count + each as `<file>:<line> → "<quote>"`
   - Line 2: skip-to-debt escalations (only if `skipped_in_a_row` crossed 3 this turn)
   - Line 3: count of carryover / strategic-skip entries + pointer "see `knowledge/.knowie-state.yaml` diff"
   - Line 4-5: only if Block condition triggered (debt file forced fresh-read; STOP and ask user)
3. The suggested next action (Step 5)

**Forensic invariants** (still mandatory; just not printed):
- Phase A contract was committed before the recommendation was drafted
- Every fresh-read corresponds to an actual Read tool call this turn
- State file is updated atomically at end of turn
- `evidence_quote` in state file is verbatim from the file (user can `grep` to verify)

The footer surfaces only the *anomalies* (new fresh-read, debt escalations) and
points to the state file for full audit. Verbose YAML output proved to drift
toward self-serving 100% — the new mechanism keeps verification in the file
system, not in chat output.

---

### 1.5 Reading Contract — Phase A (commit *before* drawing conclusions, internally)

Each core file should contain a **Key Extensions table** at the bottom — titled `## Key Extensions` or `## 關鍵延伸`, matching the project's `language` field in `knowledge/.knowie.json`. Steps:

1. Extract **topic keywords** from `$ARGUMENTS` + `git log --oneline -10` + user intent
2. For each core file, scan the Key Extensions table; list **hit rows** + every sub-file the row references
3. Union the hit sub-files with Step 0's debt list → **expected-reads** list
4. For each expected-read, **pre-commit** how it will be handled (this prevents backfill rationalisation):
   - `fresh-read` — open this turn via Read tool, attach verbatim quote
   - `carryover` — cite state's `last_fresh_read` date + `evidence_quote`, must be ≤ 1 session old
   - `strategic-skip` — reason ≥ 15 specific characters; banned phrases: "context pressure", "context accumulation", "already settled" (these are content-free rationalisations)
   - `propose-row-removal` — sub-file should not be hit by this row; output a proposed table edit

**Block condition**: if any debt-list sub-file is marked `strategic-skip` or `carryover`, **block the recommendation** until it is changed to `fresh-read` or `propose-row-removal`.

**Phase A output** (must appear *before* the final recommendation):

```yaml
expected-reads-contract:
  - file: <path>
    why: <one-line decision relevance>
    plan: fresh-read | carryover | strategic-skip | propose-row-removal
    skip-reason: <only if strategic-skip; ≥15 specific chars>
    carryover-vintage: <YYYY-MM-DD; only if carryover>
    debt-resolution: <only if file is in debt list>
```

### 1.6 Reading Evidence — Phase B (execute the contract)

For each Phase A entry:

- **fresh-read** → call Read tool on the file, then output:
  - `quote`: one **verbatim** sentence (copied from file, user can `grep` to verify)
  - `quote_line`: line number
  - `informs`: how this sentence shapes the recommendation

- **carryover** → cite state's `evidence_quote` + `evidence_line`, justify why the quote is still fresh (`last_fresh_read` within 1 session)

- **strategic-skip** → repeat the reason, note `debt-impact: skipped_in_a_row += 1`

- **propose-row-removal** → state which row should be removed/split, and output a concrete patch suggestion at the end of this turn

Also check:
- Project structure and recent git log for actual state

### 2. Determine direction

**If `$ARGUMENTS` provides a direction** (e.g., "error handling", "mobile support"):
- Locate it in the vision roadmap
- Check prerequisites — are prior milestones actually complete? (check code, not just what vision says)
- Find relevant experience entries (lessons, pitfalls, patterns)
- Find relevant design documents
- Check if principles constrain the approach

**If `$ARGUMENTS` is empty**:
- Look at the vision roadmap for the next incomplete milestone
- Cross-reference with actual project state (what's really done?)
- Consider experience lessons that might affect priority
- Suggest the most logical next step with justification

### 3. Converge

Through conversation with the user, converge on all of these items:

- **Feature name**: short, descriptive
- **One-line description**: what it delivers to the user/system
- **Roadmap position**: which phase/milestone it belongs to
- **Prerequisites**: what must be done first (check if actually done)
- **Scope**:
  - What's included (explicit list)
  - What's explicitly excluded (prevent scope creep)
- **Grounded in principles**: which principle(s) this serves, and how. Show the derivation chain.
- **Informed by experience**: relevant lesson(s) and how to apply them. Quote the specific lesson.
- **Risks**: based on experience, what could go wrong? What mitigation is available?
- **Success criteria**: how do we know this is done? Make it concrete and verifiable.

### 4. Output

Present a concise feature brief:

```markdown
## Next: [Feature Name]

**Description**: [One-line description]

**Roadmap**: [Phase/milestone reference]

**Prerequisites**:
- [x] [Completed prerequisite]
- [ ] [Missing prerequisite — must be addressed first]

**Scope**:
- ✅ [Included]
- ✅ [Included]
- ❌ [Explicitly excluded]

**Grounded in principles**:
- Principle: "[quoted principle]"
- How this feature serves it: [explanation]

**Informed by experience**:
- Lesson: "[quoted lesson from experience.md]"
- How to apply: [specific guidance for this feature]

**Risks**:
- [Known risk from experience] → Mitigation: [approach]

**Success criteria**:
- [ ] [Concrete, verifiable criterion]
- [ ] [Concrete, verifiable criterion]
```

### 4.5 Update state file (mandatory final step)

Write back to `knowledge/.knowie-state.yaml` based on Phase B execution:

- For each `fresh-read`:
  - `last_fresh_read: <today>`
  - `fresh_read_count += 1`
  - `skipped_in_a_row: 0`
  - `last_skip_reasons: []`
  - `evidence_quote: <Phase B verbatim quote>`
  - `evidence_line: <Phase B line>`
  - `evidence_session: <today>`

- For each `strategic-skip`:
  - `skipped_in_a_row += 1`
  - `last_skip_reasons.push(<reason>)` — keep last 5 (FIFO)

- For each `carryover`:
  - No state change (already current)

- For each `propose-row-removal`:
  - No state change; output the patch suggestion in the user-facing recommendation

**Verification**: after writing, echo the state diff to the user. If any
`evidence_quote` is claimed for `fresh-read` but no actual Read tool call was
made this turn, the whole recommendation is invalid — redo Phase B.

### 5. Suggest next action

After presenting the feature brief, scan the project for spec/planning tools:

- Check `.claude/skills/` for spec-related skills (e.g., `speckit-specify`, `speckit-plan`)
- Check `.specify/` for Speckit
- Check `openspec/` for OpenSpec
- Check `.kiro/specs/` for Kiro Specs

**If a spec tool is found**: suggest the specific command.
  Example: "You can now use `/speckit-specify` to create a detailed specification for this feature."

**If no spec tool is found**: give a generic prompt.
  "You can now use your preferred specification tool to flesh out the details, or start implementing directly."

## Guidelines

- **Language**: Read `knowledge/.knowie.json` → `language` field (e.g., `"zh-TW"`). Use that language for ALL output — section headers, descriptions, suggestions, everything. If `knowledge/.knowie.json` is missing or has no language field, detect from conversation context or default to English.
- Keep the feature brief concise — it's a starting point, not a full spec
- **Every recommendation must reference knowledge files.** Don't invent principles or cite non-existent experience. If there's no relevant principle, say so explicitly.
- Verify project state before claiming prerequisites are met — check actual code, not just what vision says
- If the user's direction conflicts with principles or experience, flag it clearly with the specific conflict, but let them decide
- If the roadmap is empty or unclear, help the user think through priorities rather than guessing
- Never auto-invoke other skills — only suggest them
