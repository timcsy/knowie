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

```bash
npx knowie init        # interactive
npx knowie init --yes  # automatic (AI tools, CI)
```

That's it. Knowie creates the files, detects your AI tools, and connects everything.

## What Changes

<details>
<summary><b>Beginner example</b> — "Add user login"</summary>

*Before:* AI generates OAuth2 + JWT + refresh tokens with three services.

*After:* AI reads your principles ("keep it simple — learning project") and vision ("single-user, no registration"). Adds a simple password check. 5 minutes, not 5 hours.
</details>

<details>
<summary><b>Senior example</b> — "Add caching"</summary>

*Before:* AI picks Redis (popular online). But your principle says "no external dependencies for core," and experience.md records that caching caused stale data last quarter.

*After:* AI picks in-memory caching, adds TTL from the stale-data lesson, links to the design doc in `knowledge/design/`.
</details>

## Adding to an Existing Project

Knowie is safe to add at any point:

- **Won't touch your code** — it only creates `knowledge/` and injects references into AI tool configs
- **Won't break anything** — references use HTML comment markers, easily removable
- **Won't force a rewrite** — start with empty files and fill them gradually
- **Works alongside existing docs** — `knowledge/` complements your README, wiki, or ADRs

Run `npx knowie init` in your existing project and start with just `principles.md`. Add vision and experience when you're ready. Your AI starts benefiting from the first file you fill in.

## How It Works

| File | Answers | Changes |
|------|---------|---------|
| `principles.md` | What rules guide us? | Rarely |
| `vision.md` | Where are we going? | After milestones |
| `experience.md` | What have we learned? | After surprises |

Templates include guided comments — no blank page anxiety.

<details>
<summary>Subdirectories for supporting details</summary>

| Directory | Contains | Distills into |
|-----------|----------|---------------|
| `research/` | Explorations, experiments | → principles.md |
| `design/` | Architecture decisions | → vision.md |
| `history/` | Event records | → experience.md |

Think of the three files as the *summary* and subdirectories as the *evidence*. Start with the summary; details grow over time.
</details>

## Skills

For AI tools with skill support (e.g., Claude Code):

| Skill | What it does |
|-------|-------------|
| `/knowie init` | Guided conversation to draft your knowledge files |
| `/knowie update` | Check structure and suggest improvements |
| `/knowie judge` | 17-point health check: consistency, coherence, code alignment |
| `/knowie next` | Plan next step, grounded in principles and experience |

<details>
<summary>About <code>/knowie judge</code></summary>

The core feedback loop. Checks: self-consistency (3), internal coherence (3), cross-references between files (6 directional), alignment with actual code/git (3), overall synthesis (1), beyond-scope (1).

Results: 🟢 healthy, 🟡 worth watching, 🔴 needs action — with specific quotes and suggestions.
</details>

## Already Using a Spec Tool?

Knowie and spec tools are complementary:

```
Knowie (why)  →  Spec tool (what)  →  Code (how)
```

Spec tools generate requirements and designs. Knowie gives them context — your principles, roadmap, and lessons. Without Knowie, specs are written in a vacuum.

Knowie detects installed spec tools and suggests handoff after `/knowie next`.

<details>
<summary>Supported spec tools</summary>

Speckit, OpenSpec, Kiro Specs — auto-detected and connected during init.
</details>

## Supported Tools

**25+ AI tools** connected automatically: Claude Code, Cursor, Windsurf, GitHub Copilot, Codex, Gemini, Kiro, Amazon Q, Cline, Roo Code, Kilo Code, Aider, Continue, Augment, Amp, Devin, Warp, Zed, OpenCode, Qodo, JetBrains AI, Tabnine, Replit, Bolt.new

**Standard:** AGENTS.md (60k+ repos)

`knowie init` detects what you have and injects references. No manual config.

<details>
<summary>MCP Server</summary>

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

```bash
npx knowie update       # or --yes for automatic
```

Updates skills and templates. Never touches your knowledge files.

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
