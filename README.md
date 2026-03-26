# Knowie

[繁體中文](README.zh-TW.md)

**Give your AI a structured project brain.**

Your AI assistant sees your code — but does it understand *why* you built it this way? What principles you won't compromise on? What you already tried and learned from?

Knowie gives your project three structured knowledge files that any AI tool can read, turning scattered context into a shared understanding.

## Quick Start

### From the terminal

```bash
npx knowie init
```

Interactive mode — choose your language and which AI tools to connect.

### From your AI tool

Ask your AI to run:

```bash
npx knowie init --yes
```

Fully automatic — detects language, finds your AI tools, and sets everything up with zero prompts. Also activates automatically when stdin is not a terminal (piped input, CI, etc.).

### Then, in your AI tool

If you're using an AI tool with skill support (e.g., Claude Code), you can run:

```
/knowie init
```

This starts an interactive conversation to help you fill in your knowledge files.

## What It Creates

```
knowledge/
  principles.md         ← Core beliefs and rules (rarely changes)
  vision.md             ← Goals, architecture, roadmap (evolves)
  experience.md         ← Distilled lessons (grows over time)
  research/             ← Exploratory notes → may become principles
  design/               ← Detailed designs → inform vision
  history/              ← Event records → distilled into experience
  .templates/           ← Reference templates (managed by Knowie)
  .knowie.json          ← Knowie config (version, language, tools)
```

## How It Works

Every project has knowledge that lives in people's heads — why certain decisions were made, what failed before, where things are headed. Knowie makes that knowledge explicit and structured:

- **Principles** answer "what rules guide us?" — your non-negotiable beliefs and the rules derived from them.
- **Vision** answers "where are we going?" — the problem you're solving, current state, and roadmap.
- **Experience** answers "what have we learned?" — patterns from development, especially where expectations met reality.

Your AI tools read these files automatically, so their suggestions align with your project's actual context — not just the code.

## Skills

Knowie installs four skills (under the `/knowie` namespace). Currently supports Claude Code, with more AI tools planned:

| Skill | What it does |
|-------|-------------|
| `/knowie init` | Interactive conversation to create or populate knowledge files |
| `/knowie update` | Check knowledge file structure against latest templates |
| `/knowie judge` | Cross-check the three files for consistency and coherence |
| `/knowie next` | Plan the next step based on your principles, vision, and experience |

### `/knowie judge` — Knowledge Health Check

Runs 17 checks across your knowledge files:

- **Self-consistency** (3): Are derivation chains intact? Is the structure sound?
- **Internal coherence** (3): Are there contradictions within each file?
- **Cross-references** (6): Do the files agree with each other? Checks all six directions (e.g., "Does experience support the vision?" is different from "Does vision address what experience found?")
- **Project alignment** (3): Do the files match the actual project state (code, dependencies, git history)?
- **Overall** (1): Synthesis — where should you focus?
- **Beyond scope** (1): Is there content that belongs elsewhere?

Results use traffic light indicators: 🟢 healthy (one-line summary), 🟡 tension (expanded with details), 🔴 conflict (expanded with suggested action).

## Supported Tools

Knowie detects and connects to 25+ AI and spec tools:

| Category | Tools |
|----------|-------|
| **AI Coding** | Claude Code, Cursor, Windsurf, GitHub Copilot, Codex CLI, Gemini CLI, Kiro, Amazon Q, Cline, Roo Code, Kilo Code, Aider, Continue.dev, Augment Code, Amp, Devin, Warp, Zed, OpenCode, Qodo, JetBrains AI, Tabnine, Replit Agent, Bolt.new |
| **Spec Tools** | Speckit, OpenSpec, Kiro Specs |
| **Standard** | AGENTS.md (cross-tool standard) |

`knowie init` auto-detects which tools you have and injects a reference to your `knowledge/` files. `knowie update` catches tools added later.

## MCP Server

Knowie also works as an MCP (Model Context Protocol) server, so your AI tool can use Knowie directly as native tools:

```bash
npx knowie setup-mcp
```

This configures the MCP server for your AI tool (Claude Code, Claude Desktop, Cursor, etc.). Once set up, your AI can call `knowie_init`, `knowie_update`, `knowie_judge`, and `knowie_next` directly.

You can also configure it manually. Add to your AI tool's MCP settings:

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

## Updating

When Knowie releases a new version with improved skills or templates:

```bash
npx knowie update
```

Or let your AI run it:

```bash
npx knowie update --yes
```

This updates skills and templates (managed files) without touching your knowledge files. It also detects any new AI tools you've added since the last run.

## Design Principles

- **Tool-agnostic**: `knowledge/` is plain Markdown — works with any tool, or none.
- **Zero dependencies**: No runtime, no server. Three Markdown files and a few skills.
- **No lock-in**: Knowie doesn't own your workflow. It connects to your existing tools, not the other way around.
- **Progressive adoption**: Use just the files, or add the skills, or both.
- **AI-friendly**: `--yes` flag for fully automatic operation — your AI can install and update Knowie without leaving the conversation.

## The Theory (for the curious)

The three-file structure isn't arbitrary. It maps to the structure of a *judgment* — the minimal unit of knowledge:

- **Principles** = what is correct (the standard)
- **Vision** = what is being built (the construction)
- **Experience** = what context we're in (the situation)

These three perspectives are inseparable — each one only makes sense in relation to the other two. `/knowie judge` verifies that they're still in alignment, and `/knowie next` uses all three to plan coherent next steps.

This framework draws from [triperspectivalism](https://en.wikipedia.org/wiki/Triperspectivalism) and type-theoretic judgments (Γ ⊢ t : A). If you're curious, the research papers behind Knowie's design are in the project's `knowledge/research/` directory.

## License

MIT
