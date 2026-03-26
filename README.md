# Knowie

[繁體中文](README.zh-TW.md)

**Your AI reads your code. Knowie teaches it your thinking.**

---

## The Problem

You ask your AI to add a feature. It writes code that works — but makes choices you wouldn't make.

Maybe it picks a complex library when your project values simplicity. Maybe it restructures files in a way that breaks your team's conventions. Or maybe it suggests the exact approach you tried last month — the one that failed.

**Your AI doesn't know what you know.** It sees your code, but not your reasoning, your plans, or your hard-won lessons.

## The Fix

Three files. That's it.

```
knowledge/
  principles.md    ← What you believe and why
  vision.md        ← Where you're going and how
  experience.md    ← What you've learned the hard way
```

Your AI reads them before every task. Now its suggestions align with your project — not just your code.

## 30 Seconds to Start

```bash
npx knowie init
```

Done. Knowie creates the files, detects your AI tools (25+ supported), and connects everything.

> Using an AI tool? It can do this for you: `npx knowie init --yes`

## What Changes

**Example 1 — A beginner building a personal project:**

*Before:* "Add user login" → AI generates a full OAuth2 + JWT + refresh token system with three services.

*After:* AI reads `principles.md` ("keep it simple — this is a learning project") and `vision.md` ("single-user app, no registration needed"). It adds a simple password check. Done in 5 minutes instead of 5 hours.

**Example 2 — A senior engineer on a team project:**

*Before:* "Add caching" → AI picks Redis because it's popular online. But your principle says "no external dependencies for core features," and `experience.md` records that a similar caching layer caused stale data issues last quarter.

*After:* AI reads all three files. It picks in-memory caching, adds a TTL based on the stale-data lesson, and links to the relevant design doc in `knowledge/design/`.

## How It Works

| File | Answers | Changes |
|------|---------|---------|
| `principles.md` | What rules guide us? | Rarely |
| `vision.md` | Where are we going? | After milestones |
| `experience.md` | What have we learned? | After surprises |

Each file has guided comments to help you get started — no blank page anxiety.

Three subdirectories hold the details:

| Directory | Contains | Distills into |
|-----------|----------|---------------|
| `research/` | Explorations, experiments | → principles.md |
| `design/` | Architecture decisions | → vision.md |
| `history/` | Event records | → experience.md |

Think of the three files as the *summary* and the subdirectories as the *supporting evidence*. You start with the summary; the details grow over time.

## Skills

If your AI tool supports skills (e.g., Claude Code), Knowie gives you four commands:

| Skill | What it does |
|-------|-------------|
| `/knowie init` | Guided conversation to help you fill in your knowledge files — it asks you questions and drafts content |
| `/knowie update` | Check file structure and suggest improvements as your project evolves |
| `/knowie judge` | Health check: are your files consistent with each other and with your actual code? |
| `/knowie next` | Plan the next step, grounded in your principles and informed by your experience |

### `/knowie judge` — The Core Loop

After you finish a feature, run `/knowie judge`. It checks 17 things:

- Are your three files internally consistent? (no self-contradictions)
- Do they agree with each other? (e.g., does your vision match what experience taught you?)
- Do they match your actual project? (e.g., does your roadmap say "Phase 1 done" when it really is?)

Results: 🟢 healthy, 🟡 worth watching, 🔴 needs action — each with quotes from your files and concrete suggestions.

## "I already use Speckit / OpenSpec / Kiro Specs — do I need this?"

Yes. They do different jobs.

**Spec tools** answer *what* to build: requirements, designs, task breakdowns. They're great at turning an idea into a concrete plan.

**Knowie** answers *why* you build it that way: your principles, your roadmap context, and the lessons that should inform every decision.

Without Knowie, your spec tool doesn't know that your project avoids external dependencies, that Phase 2 depends on Phase 1, or that a similar feature failed last quarter. It generates specs in a vacuum.

With Knowie, your spec tool inherits the context. Knowie even detects spec tools in your project and suggests handoff — for example, after `/knowie next` converges on a feature, it'll suggest running `/speckit-specify` if Speckit is installed.

```
Knowie (why)  →  Spec tool (what)  →  Code (how)
  principles       requirements         implementation
  vision           design               tests
  experience       task breakdown        deployment
```

They're complementary layers. Knowie gives the context; spec tools give the structure; you write the code.

## Works With Your Tools

Knowie connects to **25+ AI tools and spec tools** — automatically:

**AI tools:** Claude Code, Cursor, Windsurf, GitHub Copilot, Codex, Gemini, Kiro, Amazon Q, Cline, Roo Code, Kilo Code, Aider, Continue, Augment, Amp, Devin, Warp, Zed, OpenCode, Qodo, JetBrains AI, Tabnine, Replit, Bolt.new

**Spec tools:** Speckit, OpenSpec, Kiro Specs

**Standard:** AGENTS.md (cross-tool standard, 60k+ repos)

`knowie init` detects what you have and injects a reference to your `knowledge/` files. No manual config needed.

## MCP Server

For AI tools that support MCP (Model Context Protocol):

```bash
npx knowie setup-mcp
```

This gives your AI direct access to `knowie_init`, `knowie_update`, `knowie_judge`, and `knowie_next` as native tools.

<details>
<summary>Manual MCP config</summary>

```json
{
  "mcpServers": {
    "knowie": {
      "command": "npx",
      "args": ["-y", "knowie", "--", "knowie-mcp"]
    }
  }
}
```
</details>

## Updating

```bash
npx knowie update
```

Updates skills and templates without touching your knowledge files. Catches new AI tools added since last run. Use `--yes` for automatic mode.

## Design Principles

- **Plain Markdown** — `knowledge/` works with any tool, or none. No proprietary format, no lock-in.
- **No npm dependencies** — only Node.js built-ins. Install is instant.
- **AI-native** — `--yes` flag for zero-prompt operation. Your AI can install and update Knowie without you leaving the conversation.
- **Progressive** — start with just the three files. Add skills, MCP, or subdirectories when you're ready.

## Why Three Files?

Every decision you make has three parts: what's *correct* (your principles), what you're *building* (your vision), and what *context* you're in (your experience). Miss one, and you get:

- Principles without vision → rigid rules that don't ship anything
- Vision without experience → plans that repeat past mistakes
- Experience without principles → lessons with no framework to apply them

Knowie keeps all three in sync. `/knowie judge` checks the alignment. `/knowie next` uses all three to plan coherent next steps.

<details>
<summary>For the theoretically curious</summary>

This maps to the structure of a *judgment* in type theory (Γ ⊢ t : A) and [triperspectivalism](https://en.wikipedia.org/wiki/Triperspectivalism) in epistemology. The three perspectives are co-dependent and irreducible — each only makes sense in relation to the other two.
</details>

## License

MIT
