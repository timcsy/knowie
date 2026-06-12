# Knowie

[繁體中文](README.zh-TW.md)

**Your AI reads your code. Knowie teaches it your thinking.**

---

## The Problem

Your AI writes code that works — but makes choices you wouldn't make. It picks the wrong library, breaks your conventions, or suggests an approach you already tried and failed with.

**It sees your code, but not your reasoning.**

This compounds at scale. Around 30–50 features in, most AI-assisted projects start to drift: principles get silently abandoned, the same bugs reappear, scope balloons unconsciously. Each new feature is written without memory of the last ten.

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

> *Before:* AI generates OAuth2 + JWT + refresh tokens with three services.
>
> *After:* AI reads your principles ("keep it simple — learning project") and vision ("single-user, no registration"). Adds a simple password check. 5 minutes, not 5 hours.

**Senior example** — "Add caching":

> *Before:* AI picks Redis (popular online). But your principle says "no external dependencies for core," and experience.md records that caching caused stale data last quarter.
>
> *After:* AI picks in-memory caching, adds TTL from the stale-data lesson, links to the rationale in `knowledge/history/`.

## Proven in Practice

**One person. One project. 150+ features. Still coherent.**

That's the bar Knowie is designed for. Whether you're starting fresh or arriving at feature #40 wondering why the AI keeps re-suggesting things you already decided against — this is what it's for.

## Where Knowie Fits

The AI coding landscape has grown many layers. Knowie occupies one specific layer:

| Layer | Manages | Examples |
|-------|---------|----------|
| Harness | How the agent runs (retry, validation, workflows) | Claude Code, agent SDKs |
| Context engineering | What goes into the LLM context *right now* | RAG, @-mentions, repo grep |
| Memory systems | Auto-extracted facts persisted across sessions | mem0, Letta, ChatGPT memory |
| Spec tools | Per-feature contracts | SpecKit, OpenSpec, Kiro Specs |
| **Knowie** | **Human-curated, project-level *why* — durable across sessions, specs, and tools** | — |

**vs spec tools:** Specs are per-feature. Knowie is the shared layer *across* all specs — so spec #20 still respects the principle set in spec #1. Spec tools make each feature rigorous; Knowie keeps the project coherent.

**vs memory systems:** Memory systems auto-extract and accumulate (often with noise you can't audit). Knowie is explicitly human-authored — every line is something you can point at and stand behind. `/knowie-judge` gives you a feedback loop no black-box memory system offers.

**vs context engineering:** Context engineering decides *what to load right now*. Knowie decides *what stays true across every query*. Different axis.

They can coexist. Use a RAG system for code retrieval, a memory system for personal history, and Knowie for the curated "why." Different layers, different jobs.

**When Knowie isn't the right fit:**
- You need automatic fact extraction from conversations → use a memory system
- Your project logic fits in one file → a single `CLAUDE.md` is probably enough
- You don't yet have strong opinions about your project → come back when you do

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

Five subdirectories hold the rest:

| Directory | Holds |
|-----------|-------|
| `concepts/` | Recurring core concepts — the three files keep only pointers, detail lives here (semantic memory) |
| `episodes/` | Recall-worthy full scenes behind a lesson or decision (episodic memory) |
| `skills/` | Learned domain skills — repeated work distilled into reusable capability (procedural memory / cerebellum); projected into your AI tool's skill dir |
| `history/` | The causal trail — why things became what they are (decisions, rejected options) |
| `draft/` | Short-term memory — undecided ideas still forming |

The three files are the *interface*; subdirectories hold the detail. Start with the three — the rest grows over time.

## Skills

These commands run **inside your AI chat** (not in the terminal). For AI tools with skill support (e.g., Claude Code):

| Skill | What it does |
|-------|-------------|
| `/knowie-init` | Guided conversation to draft your knowledge files |
| `/knowie-capture` | Dispatch a discussion or idea into the right place |
| `/knowie-consolidate` | Human-initiated: consolidate a ripe draft out to the long-term tier |
| `/knowie-next` | Plan the next step, grounded in principles, vision, and experience |
| `/knowie-judge` | Health check: coherence, alignment with code, rot detection — then tidy |
| `/knowie-migrate` | Migrate the knowledge base when the structure version moves on |

`/knowie-judge` is the core feedback loop. It catches when your vision contradicts your experience, your principles don't match your code, or your files have gone stale. Results: 🟢 healthy, 🟡 worth watching, 🔴 needs action — with specific quotes and suggestions.

## Working With Spec Tools

Spec tools (SpecKit, OpenSpec, Kiro Specs) give each feature a rigorous contract. But specs are per-feature — left alone, they fragment. Spec #1 enforces performance; spec #20 quietly doesn't, because it was written without visibility into spec #1.

Knowie sits *underneath* your spec tool, not in a pipeline with it:

```
           ┌── spec 1
           ├── spec 2
  knowie ──┼── spec 3  ──→ code
           ├── ...
           └── spec N
```

Every spec shares the same principles, vision, and lessons. `/knowie-next` detects installed spec tools and hands off naturally — Knowie provides the *why*, your spec tool provides the *what*, AI handles the *how*.

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

If the knowledge **structure** itself moves on between versions, `npx knowie update` still won't touch your files — it flags the drift loudly, and you run `/knowie-migrate` (inside your AI) to migrate, proposing each move for your confirmation. Breaking changes are surfaced, never applied silently.

## Design

- **Plain Markdown** — no proprietary format, no lock-in
- **Human-authored** — every line is auditable, not auto-extracted noise
- **No npm dependencies** — Node.js built-ins only
- **Tool-agnostic** — works with any AI tool that reads files
- **Progressive** — start with three files, add skills/MCP/subdirectories when ready

## Why Three Files?

Every decision has three parts: what's *correct* (principles), what you're *building* (vision), and what *context* you're in (experience). Miss one:

- Principles without vision → rigid rules that ship nothing
- Vision without experience → plans that repeat mistakes
- Experience without principles → lessons with no framework

`/knowie-judge` keeps them aligned. `/knowie-next` uses all three to plan.

<details>
<summary>Theory</summary>

Maps to *judgment* in type theory (Γ ⊢ t : A) and [triperspectivalism](https://en.wikipedia.org/wiki/Triperspectivalism). Three co-dependent, irreducible perspectives.
</details>

## License

MIT
