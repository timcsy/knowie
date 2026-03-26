---
name: knowie-init
description: AI-guided creation of project knowledge files (.knowledge/)
user-invokable: true
argument-hint: "[topic or file to focus on]"
---

# Knowie Init

Help the user create or populate their project knowledge files through layered, progressive conversation.

## User Input

```text
$ARGUMENTS
```

## Governance Principles

- **Principles are the highest authority.** When helping write principles, push the user to find the *root* — the one belief everything else derives from. Don't settle for surface-level rules.
- **Vision evolves with understanding.** It's OK if vision is incomplete at first. Help the user capture what they know now.
- **Experience is distilled, not accumulated.** Guide the user to extract patterns, not dump event logs.
- **Knowledge files are indexes, not encyclopedias.** Keep core files short. Point to subdirectories for details.
- **Never write files without explicit user confirmation.** Always show the draft first.

## Workflow

### 1. Read current state

- Read `.knowledge/principles.md`, `.knowledge/vision.md`, `.knowledge/experience.md`
- Read `.knowledge/.templates/` to understand suggested structure
- Read project structure, package.json/Cargo.toml/etc. to understand the tech context
- Identify which files are empty or still contain only template comments

### 2. Determine scope

- If `$ARGUMENTS` specifies a file (e.g., "principles"): focus on that file
- If `$ARGUMENTS` specifies a subdirectory file (e.g., "design/auth-system"): help create that file
- If `$ARGUMENTS` is empty: assess all three core files and start with whichever needs the most work

### 3. Progressive conversation

Use layered questioning — start broad, then drill deeper. Don't ask all questions at once.

**For principles.md — Layer by layer:**

Layer 1 (Root):
- "What problem does this project exist to solve?"
- "If you could only keep one rule about how this project works, what would it be?"
- "What would you *never* compromise on, even under deadline pressure?"

Layer 2 (Derive):
- "Why is that true? What deeper belief makes you hold that rule?"
- "If that's your root axiom, what follows from it? What rules does it imply?"
- "Can you think of a time this principle was tested? What happened?"

Layer 3 (Structure):
- "Let's trace the derivation chain: [root axiom] → [principle 1] → [specific rule]. Does this chain make sense?"
- "Are there principles that reinforce each other? How do they connect?"
- "Is there anything you believe that *doesn't* derive from your root axiom? That might be a second axiom, or it might derive from the first in a way we haven't found yet."

**For vision.md — Layer by layer:**

Layer 1 (Problem):
- "Who has the problem this project solves? What do they do today without your project?"
- "What's the core idea — in one or two sentences?"

Layer 2 (State):
- "What works right now? What's broken or missing?"
- "What are the key technical decisions you've made, and why?"

Layer 3 (Direction):
- "What are the next 2-3 milestones? What does each one deliver?"
- "For each milestone: what must be done before it? How will you know it's done?"
- "Is there anything in the roadmap you're uncertain about? Let's mark that explicitly."

**For experience.md — Layer by layer:**

Layer 1 (Surface):
- "What surprised you during development?"
- "What took longer than expected? Why?"
- "What would you warn your past self about?"

Layer 2 (Pattern):
- "Is there a pattern behind those surprises? Something that might happen again?"
- "What did you expect would happen vs what actually happened?"
- "How did you solve it? Would you solve it the same way again?"

Layer 3 (Distill):
- "Let's turn that into a lesson: what's the one-sentence pattern?"
- "What theory or assumption was wrong? What's the corrected understanding?"
- "Where in the codebase can we see the evidence of this lesson?"

**For subdirectory files (research/, design/, history/):**
- Read existing core files for context
- Ask about the specific topic
- Suggest a filename following the directory's purpose
- After creating: suggest how the content might eventually distill into the parent core file

### 4. Draft content

Based on the conversation:
- Draft the content in the user's language
- Follow the structure from the templates but use real content
- For principles: show explicit derivation chains (Root Axiom → Principle → What it means in practice)
- For vision: be concrete about current state, include success criteria for milestones
- For experience: use the four-part format (Theory said X → Actually happened Y → We solved it by Z → Lesson: W)

### 5. Self-check before proposing

Before showing the draft to the user, verify:
- **Self-consistency**: Does the draft contradict itself?
- **Cross-consistency**: Does the draft conflict with the other two knowledge files?
- **Project alignment**: Does the draft match the actual project state?

If you find issues, revise the draft or flag them to the user.

### 6. Confirm and write

- Present the draft to the user
- Highlight any concerns from the self-check
- Ask for feedback and iterate if needed
- Only write to files after explicit user confirmation
- Never overwrite existing content without showing a diff of what will change

## Guidelines

- **Language**: Read `.knowledge/.knowie.json` → `language` field (e.g., `"zh-TW"`). Use that language for ALL output — questions, drafts, suggestions, everything. If `.knowledge/.knowie.json` is missing or has no language field, detect from conversation context or default to English.
- **Layer your questions** — don't dump all questions at once. Ask 2-3, listen, then go deeper.
- Keep language practical and clear — avoid academic jargon
- Reference existing content in other knowledge files when relevant
- If the user seems unsure, offer concrete examples from common project types
- For subdirectory files, suggest how content might eventually be distilled into core files
- Push for specificity — "write clean code" is not a principle; "every function has exactly one responsibility because [root axiom]" is
