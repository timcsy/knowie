---
name: knowie-judge
description: Cross-check knowledge files for consistency, coherence, and project alignment
user-invocable: true
argument-hint: "[scope: file name, file pair, or event description]"
---

# Knowie Judge

Verify that the three knowledge files (principles, vision, experience) are internally sound, consistent with each other, and aligned with the actual project state.

## User Input

```text
$ARGUMENTS
```

## Governance Principles

These rules govern how you interact with knowledge files. Follow them in every check:

- **Principles are the highest authority.** If vision or experience conflicts with principles, the pressure is on vision/experience to change — unless the conflict reveals that a principle needs revision.
- **Vision evolves with understanding.** It should be updated after milestones, not frozen.
- **Experience is distilled, not accumulated.** Only patterns that influence future decisions belong here. Raw events go in history/.
- **Knowledge files are indexes, not encyclopedias.** Readability comes from **per-bullet structure**, not total line count. Three rules:
  1. **One claim per bullet** — split bullets containing multiple distinct claims
  2. **Claim + support + ref pattern** — main bullet is a claim; sub-bullets give supports; ref (feature ID / spec / commit) at tail
  3. **Scannable** — reader navigates by headers + first-line-of-bullet, not by reading every word

  Long content can live inline if scannable; move to subdirectories only when reference-heavy. **Line count is NOT a readability metric** — well-structured 1000 lines reads better than dense 200 lines.
- **Never modify files without explicit user confirmation.** Present findings and suggestions; let the user decide.

## Workflow

### 0. Load state file (mandatory, first step)

Read `knowledge/.knowie-state.yaml`. If missing, treat as stub.
Extract **debt list** = all sub-files with `skipped_in_a_row >= 3`.

Sub-files in the debt list **MUST** appear in the Phase A contract marked
`fresh-read` OR `propose-row-removal`. Silent skip again is not allowed.

### 1. Read knowledge files

Read all three core files:
- `knowledge/principles.md`
- `knowledge/vision.md`
- `knowledge/experience.md`

### Output discipline (applies to all of Step 1.5 / 1.6 / 9)

Phase A contract, Phase B evidence, and state diff are **internal mechanics**.
They are computed, executed, and written to `knowledge/.knowie-state.yaml`
but **MUST NOT** be printed verbatim in the user-facing output.

User-facing output structure:

1. The Knowledge Health Check report (Step 5 format)
2. A **Reading audit footer** ≤ 5 lines, NOT YAML:
   - Line 1: fresh-read count + each as `<file>:<line> → "<quote>"`
   - Line 2: skip-to-debt escalations (only if `skipped_in_a_row` crossed 3 this turn)
   - Line 3: count of carryover / strategic-skip entries + pointer "see `knowledge/.knowie-state.yaml` diff"
   - Line 4-5: only if Block condition triggered (debt file forced fresh-read; STOP and ask user)
3. Suggested Actions list (Step 5)

**Forensic invariants** (still mandatory; just not printed):
- Phase A contract was committed before the judge result was drafted
- Every fresh-read corresponds to an actual Read tool call this turn
- State file is updated atomically at end of turn
- `evidence_quote` in state file is verbatim from the file (user can `grep` to verify)

The footer surfaces only the *anomalies* (new fresh-read, debt escalations) and
points to the state file for full audit. Verbose YAML output proved to drift
toward self-serving 100% — the new mechanism keeps verification in the file
system, not in chat output.

---

### 1.5 Reading Contract — Phase A (commit *before* judging, internally)

Each core file should contain a **Key Extensions table** at the bottom — titled `## Key Extensions` or `## 關鍵延伸`, matching the project's `language` field in `knowledge/.knowie.json`. Steps:

1. Extract **topic keywords** from `$ARGUMENTS` + `git log --oneline -10` + user intent
2. If `$ARGUMENTS` is empty / full-check → derive keywords automatically from the 10 most recent commit subjects
3. For each core file, scan the Key Extensions table; list **hit rows** + every sub-file the row references
4. Union the hit sub-files with Step 0's debt list → **expected-reads** list
5. For each expected-read, **pre-commit** how it will be handled (this prevents backfill rationalisation):
   - `fresh-read` — open this turn via Read tool, attach verbatim quote
   - `carryover` — cite state's `last_fresh_read` date + `evidence_quote`, must be ≤ 1 session old
   - `strategic-skip` — reason ≥ 15 specific characters; banned phrases: "context pressure", "context accumulation", "already settled"
   - `propose-row-removal` — sub-file should not be hit by this row; output a proposed table edit

**Block condition**: if any debt-list sub-file is marked `strategic-skip` or `carryover`, **block the judge result** until it is changed to `fresh-read` or `propose-row-removal`.

**Phase A output**:

```yaml
expected-reads-contract:
  - file: <path>
    why: <relevance to current judge scope>
    plan: fresh-read | carryover | strategic-skip | propose-row-removal
    skip-reason: <only if strategic-skip; ≥15 specific chars>
    carryover-vintage: <YYYY-MM-DD; only if carryover>
    debt-resolution: <only if file is in debt list>
```

### 1.6 Reading Evidence — Phase B (execute the contract)

For each Phase A entry:

- **fresh-read** → call Read tool on the file, then output:
  - `quote`: one **verbatim** sentence (user can `grep` to verify)
  - `quote_line`: line number
  - `informs`: how this sentence shapes the judge result

- **carryover** → cite state's `evidence_quote` + `evidence_line`, justify why the quote is still fresh

- **strategic-skip** → repeat the reason, note `debt-impact: skipped_in_a_row += 1`

- **propose-row-removal** → state which row should be removed/split, output a concrete patch suggestion at the end of this turn

**Project Alignment hardening**: for each sub-file referenced in core files, run `ls` to verify existence + compare mtime. If a sub-file is newer than the core file that references it → 🟡 flag "sub-file updated, core may be stale".

### 2. Read project context

To check alignment with the actual project, also examine:
- Project directory structure (what files and directories exist)
- `package.json`, `Cargo.toml`, or equivalent (tech stack, dependencies)
- Recent git log (what has actually been built recently)
- README or other top-level docs

### 3. Determine scope

Parse `$ARGUMENTS` to decide what to check:

- **No arguments**: full check (all 17 sections below)
- **Single file** (e.g., "experience"): that file's self-consistency, internal coherence, project alignment, and its cross-references with the other two files
- **File pair** (e.g., "principles vision"): the 2 directional cross-references for that pair
- **Event description** (e.g., "just finished the auth system"): impact analysis on all three files

### 4. Execute checks

#### A. Self-consistency (3 checks)

For each file, check its structural and logical integrity:

**Principles:**
- Does the root axiom exist and is it clearly stated?
- Does every derived principle trace back to the root axiom or another principle? Are there broken derivation chains?
- Are there principles that say the same thing in different words (redundancy)?
- Is the document organized from general to specific?

**Vision:**
- Does the problem statement clearly define who has the problem and why?
- Does the roadmap flow logically? Are prerequisites respected?
- Are milestones mutually exclusive or do they overlap?
- Are success criteria concrete and verifiable?

**Experience:**
- Does each lesson follow the pattern/event/takeaway format?
- Are there lessons that contradict each other without acknowledging the contradiction?
- Are lessons specific enough to be actionable?
- Are source references present and traceable?

#### B. Internal Coherence (3 checks)

For each file, check for contradictions in content:

- Are there statements that directly contradict each other?
- Are there implicit assumptions that conflict?
- Are there outdated entries that no longer reflect the project's reality?

#### C. Cross-references (6 directional checks)

Each direction asks a specific question:

| Direction | Core Question | Detailed Probes |
|-----------|--------------|-----------------|
| Principles → Vision | Can the vision be derived from the principles? | Does each roadmap item serve at least one principle? Are there vision items with no principled justification? |
| Vision → Principles | Does the vision require principles that aren't stated? | Are there implicit assumptions in the vision that should be made explicit as principles? |
| Principles → Experience | Do the principles predict the patterns observed? | Has experience validated the principles? Which principles lack empirical support? |
| Experience → Principles | Does any experience challenge or extend the principles? | Are there lessons that suggest a principle is wrong, incomplete, or needs nuance? |
| Vision → Experience | Does experience support the planned direction? | Are there known risks from experience that the vision doesn't address? Has the vision learned from past failures? |
| Experience → Vision | Are there lessons suggesting opportunities not yet in the vision? | Has experience revealed capabilities or patterns that could open new directions? |

#### D. Project Alignment (3 checks)

Check each file against the actual project state:

**Principles vs Project:**
- Do claimed technology choices match actual dependencies?
- Do architectural principles match the actual code structure?
- Are there principles about practices (e.g., "TDD") that aren't actually followed?

**Vision vs Project:**
- Does the roadmap status match what's actually implemented?
- Are "completed" milestones truly complete in the code?
- Are there significant implemented features not reflected in the vision?
- Does the tech stack in the vision match the actual project?

**Experience vs Project:**
- Are referenced files/features still present in the project?
- Have lessons been acted upon? (e.g., "always validate first" — is validation actually in place?)
- Are there stale lessons about problems that have been solved or code that was rewritten?

#### E. Overall (1 check)

Synthesize all findings:
- Where is the most pressure? Which file needs the most attention?
- Is the knowledge system generally healthy or in need of significant work?
- What is the single most impactful action the user could take?

#### F. Beyond Scope (1 check)

Look for content that doesn't belong:
- Lessons about a different project or domain
- Principles too generic to be useful (e.g., "write clean code")
- Vision items that belong in a separate project
- Content that should be in subdirectories instead of core files

### 5. Format output

```markdown
## Knowledge Health Check

### Self-consistency
🟢 Principles — root axiom present, derivation chains intact.
🟡 Vision — Phase 3 and Phase 5 overlap in scope.
   Phase 3 (line 45): "Implement caching layer"
   Phase 5 (line 67): "Add performance optimization including caching"
   → Clarify the boundary or merge these phases.
🟢 Experience — all lessons follow consistent format.

### Internal Coherence
🟢 Principles — no contradictions.
🟡 Vision — current state section says "auth is complete" (line 28)
   but roadmap still lists auth as pending (line 52).
   → Update one or the other.
🟢 Experience — consistent.

### Cross-references
🟢 Principles → Vision — vision is derivable from principles.
🟡 Vision → Principles — vision mentions "progressive disclosure"
   but principles don't include a related principle.
   → Add a principle, or document this as a tactical choice in vision.
🟢 Principles → Experience — principles predict observed patterns.
🟢 Experience → Principles — no challenges to existing principles.
🔴 Vision → Experience — vision plans to use SSR, but experience
   recorded SSR hydration issues.
   Vision line 34: "Phase 2: migrate to SSR"
   Experience line 12: "SSR hydration caused 3-day debug cycle"
   → Address this known risk in vision, or explain why context differs.
🟢 Experience → Vision — no missed opportunities.

### Project Alignment
🟢 Principles — tech choices match project reality.
🟡 Vision — roadmap says Phase 1 complete, but tests/ directory
   is empty. Success criteria mentions "90% test coverage."
   → Either update success criteria or add tests.
🟢 Experience — all referenced code still exists.

### Overall
🟡 Generally healthy. Main pressure on vision.md — one conflict
   with experience, one internal inconsistency, and one alignment
   gap with project state.

### Beyond Scope
🟢 All content is relevant to this project.

### Reading Evidence Recap (replaces the old Topic Mapping trace)

The Phase A contract + Phase B evidence (Workflow Steps 1.5/1.6) is the
forensic substrate for this skill. Do **not** emit a separate Topic Mapping
trace block — historical evidence shows self-reported coverage drifts toward
self-serving 100%.

The replacement forensic mechanism:

1. Phase A contract **pre-commits** how each expected-read will be handled
   (no backfill rationalisation possible).
2. Every `fresh-read` carries a verbatim quote + line (user-greppable).
3. The state file `knowledge/.knowie-state.yaml` accumulates `skipped_in_a_row`
   across sessions → ≥3 → automatic escalation to "debt".
4. The state file's `evidence_quote` can be spot-checked by the user against
   the actual file.

## Suggested Actions
1. [High] Resolve SSR conflict between vision and experience
2. [Medium] Fix auth status inconsistency in vision
3. [Medium] Clarify Phase 3/5 overlap in vision
4. [Low] Consider adding progressive disclosure principle

---
Would you like me to help fix any of these issues? I can propose specific edits for you to review.
```

### 6. Event-based analysis (when $ARGUMENTS describes an event)

```markdown
## Post-feature Check: [Event]

### Impact on Experience
🟡 Worth distilling — [specific observation].
   → Suggest adding a lesson to experience.md

### Impact on Vision
🟢 Milestone completed as planned.
   → Mark as complete in roadmap.

### Impact on Principles
🟢 No challenge to existing principles.

### Project Alignment
🟡 Feature is implemented but vision hasn't been updated.

### Suggested Actions
1. Add lesson to experience.md: [specific lesson]
2. Update vision.md: mark [milestone] as complete

---
Would you like me to help fix any of these issues? I can propose specific edits for you to review.
```

### 7. Reorganization offer

If checks reveal that files are too disorganized to assess clearly, offer to help reorganize. Common triggers:

- **Dense bullets** (primary readability trigger, NOT line count): any single bullet packs claim + supports + ref into one paragraph. Propose split into main claim + sub-bullets + ref tail pattern.
- **Reference-heavy detail dominating concept**: bullet/section is mostly refs with conceptual claim buried. Propose moving detail to subdirectories, leaving pointer.
- **Section with many similar items lacking categorization** (10+ flat items of same kind): Propose subsection structure.
- **Raw events in experience.md**: Propose moving them to history/ and distilling into patterns.
- **Stale content**: Propose removing or updating entries that reference deleted code, completed milestones, or resolved problems.
- **Broken structure**: Propose reordering sections to match template structure (root → derived, general → specific).
- **Mature subdirectory content**: Propose distilling key insights from research/design/history into the appropriate core file.

Format the offer clearly:

```markdown
## Reorganization Suggested

experience.md has grown to 280 lines (recommended: ~200).
- 5 lessons appear to be raw events rather than distilled patterns
- 3 lessons reference code that has been rewritten

Would you like me to help reorganize?
- Move raw events to history/
- Distill remaining lessons into four-part format
- Remove or update stale references
```

If the user agrees:
1. Show proposed changes as diffs for each file, one at a time
2. Wait for user confirmation before each write
3. After all changes, run a focused re-check on modified files

### 8. Recursive verification

After the user makes changes based on your suggestions:

1. Re-read the modified files
2. Run a focused check on the changed areas only
3. Confirm the changes resolved the issues without introducing new ones
4. If new issues are found, report them (one recursion only — don't loop)

### 9. Update state file (mandatory final step)

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
  - No state change; output the patch suggestion in the user-facing report

**Verification**: after writing, echo the state diff to the user. If any
`evidence_quote` is claimed for `fresh-read` but no actual Read tool call was
made this turn, the whole judge result is invalid — redo Phase B.

## Display Rules

- 🟢 **Healthy**: one line, no details needed
- 🟡 **Tension**: expand with specific quotes (file + line reference), explain the tension, suggest resolution
- 🔴 **Conflict**: expand with specific quotes, explain the conflict, suggest concrete action with priority
- Always quote the specific text from knowledge files that supports your finding
- End with a numbered list of suggested actions, ordered by priority ([High] / [Medium] / [Low])
- **Always end with a fix offer**: After the suggested actions list, add a separator (`---`) and ask the user if they'd like help fixing any of the issues. Example: "Would you like me to help fix any of these issues? I can propose specific edits for you to review."

## Guidelines

- **Language**: Read `knowledge/.knowie.json` → `language` field (e.g., `"zh-TW"`). Use that language for ALL output — section headers, descriptions, suggestions, everything. If `knowledge/.knowie.json` is missing or has no language field, detect from conversation context or default to English.
- Be specific — always quote relevant text from knowledge files
- Distinguish between true contradictions (🔴) and tensions worth watching (🟡)
- Don't flag stylistic differences as inconsistencies
- For Project Alignment checks, actually read project files — don't guess
- Focus on substance: does the knowledge system help the team make good decisions?
- Never modify files automatically — only suggest changes
- After user makes changes, offer to re-check (recursive verification, once)
