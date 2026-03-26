# Knowie

[繁體中文](README.zh-TW.md)

**Your AI reads your code. Knowie teaches it your thinking.**

---

## The Problem

Your AI writes code that works — but makes choices you wouldn't make. It picks the wrong library, breaks your conventions, or suggests an approach you already tried and failed with.

**It sees your code, but not your reasoning.**

## The Fix

Three Markdown files in a `knowledge/` directory:

```
knowledge/
  principles.md    ← What you believe and why
  vision.md        ← Where you're going and how
  experience.md    ← What you've learned the hard way
```

Your AI reads them before every task. Its suggestions now align with your project — not just your code.

## Get Started

In your **terminal**, run:

```bash
npx knowie init
```

That's it. Knowie creates the files, detects your AI tools, and connects everything.

> **Prefer to stay in your AI chat?** Ask your AI to run this (it will execute it in the terminal for you):
> ```bash
> npx knowie init --yes
> ```

## What Changes

**Beginner example** — "Add user login":

*Before:* AI generates OAuth2 + JWT + refresh tokens with three services.
*After:* AI reads your principles ("keep it simple — learning project") and vision ("single-user, no registration"). Adds a simple password check. 5 minutes, not 5 hours.

**Senior example** — "Add caching":

*Before:* AI picks Redis (popular online). But your principle says "no external dependencies for core," and experience.md records that caching caused stale data last quarter.
*After:* AI picks in-memory caching, adds TTL from the stale-data lesson, links to the design doc in `knowledge/design/`.

## Adding to an Existing Project

Knowie is safe to add at any point:

- **Won't touch your code** — it only creates `knowledge/` and injects references into AI tool configs
- **Won't break anything** — references use HTML comment markers, easily removable
- **Won't force a rewrite** — start with empty files and fill them gradually
- **Works alongside existing docs** — `knowledge/` complements your README, wiki, or ADRs

Start with just `principles.md`. Your AI benefits from the first file you fill in.

## How It Works

| File | Answers | Changes |
|------|---------|---------|
| `principles.md` | What rules guide us? | Rarely |
| `vision.md` | Where are we going? | After milestones |
| `experience.md` | What have we learned? | After surprises |

Templates include guided comments — no blank page anxiety.

Three subdirectories hold supporting details:

| Directory | Contains | Distills into |
|-----------|----------|---------------|
| `research/` | Explorations, experiments | → principles.md |
| `design/` | Architecture decisions | → vision.md |
| `history/` | Event records | → experience.md |

The three files are the *summary*; subdirectories are the *evidence*. Start with the summary — details grow over time.

## Skills

These commands run **inside your AI chat** (not in the terminal). For AI tools with skill support (e.g., Claude Code):

| Skill | What it does |
|-------|-------------|
| `/knowie init` | Guided conversation to draft your knowledge files |
| `/knowie update` | Check structure and suggest improvements |
| `/knowie judge` | 17-point health check: consistency, coherence, code alignment |
| `/knowie next` | Plan next step, grounded in principles and experience |

`/knowie judge` is the core feedback loop. It catches when your vision contradicts your experience, your principles don't match your code, or your files have gone stale. Results: 🟢 healthy, 🟡 worth watching, 🔴 needs action — with specific quotes and suggestions.

## Already Using a Spec Tool?

Knowie and spec tools are complementary:

```
Knowie (why)  →  Spec tool (what)  →  Code (how)
```

Spec tools generate requirements and designs. Knowie gives them context — your principles, roadmap, and lessons. Without Knowie, specs are written in a vacuum.

Knowie detects installed spec tools (Speckit, OpenSpec, Kiro Specs) and suggests handoff after `/knowie next`.

## Supported Tools

**25+ AI tools** connected automatically: Claude Code, Cursor, Windsurf, GitHub Copilot, Codex, Gemini, Kiro, Amazon Q, Cline, Roo Code, Kilo Code, Aider, Continue, Augment, Amp, Devin, Warp, Zed, OpenCode, Qodo, JetBrains AI, Tabnine, Replit, Bolt.new

**Standard:** AGENTS.md (60k+ repos)

`knowie init` detects what you have and injects references. No manual config.

<details>
<summary>MCP Server (advanced)</summary>

For AI tools supporting MCP:

```bash
npx knowie setup-mcp
```

Or manually:
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

When a new version of Knowie is released, run in your **terminal**:

```bash
npx knowie update
```

This updates skills and templates to the latest version. **Your knowledge files are never modified** — only managed files (skills, templates) are updated. It also detects any new AI tools you've added since last time.

> Re-running `npx knowie init` is also safe — it does the same thing and skips existing files.

## Design

- **Plain Markdown** — no proprietary format, no lock-in
- **No npm dependencies** — Node.js built-ins only
- **AI-native** — `--yes` for zero-prompt operation
- **Progressive** — start with three files, add skills/MCP/subdirectories when ready

## Why Three Files?

Every decision has three parts: what's *correct* (principles), what you're *building* (vision), and what *context* you're in (experience). Miss one:

- Principles without vision → rigid rules that ship nothing
- Vision without experience → plans that repeat mistakes
- Experience without principles → lessons with no framework

`/knowie judge` keeps them aligned. `/knowie next` uses all three to plan.

<details>
<summary>Theory</summary>

Maps to *judgment* in type theory (Γ ⊢ t : A) and [triperspectivalism](https://en.wikipedia.org/wiki/Triperspectivalism). Three co-dependent, irreducible perspectives.
</details>

## License

MIT
