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

And Knowie is built using Knowie — its own reasoning lives in its own `knowledge/`. (Early days, version 0.x: the everyday files-and-`/knowie-judge` loop is solid; newer pieces like `/knowie-migrate` are still beta.)

That's the bar Knowie is designed for. Whether you're starting fresh or arriving at feature #40 wondering why the AI keeps re-suggesting things you already decided against — this is what it's for.

## Where Knowie Fits

Most AI coding tools right now are about **memory** or **automation**. Knowie adds the piece they leave out — and works alongside all of them.

| What's popular now | What it does | What it leaves out |
|---|---|---|
| **AI memory** (mem0, Letta, ChatGPT memory) | Remembers *what was said* — collected automatically, kept inside one vendor | The *why* — and it's often hard to check |
| **LLM wikis / knowledge bases** | Organize *what's known* about your code | A backbone: what the project is actually *for* |
| **Autonomous agents / "loops"** (the run-while-you-sleep kind) | *Do the work* toward a goal | Whether they're still on track — and memory between runs |
| **Spec tools** (SpecKit, OpenSpec, Kiro) | Pin down *each feature* | The shared thread across all features |

**Knowie holds the *why*** — the reasoning that decides which memory matters, what the project is for, and whether the work is still on course.

Two things make it different:

- **It's yours, and it goes everywhere.** Knowie is just Markdown in your git repo — not a service you log into. It works with every AI tool and vendor, even ones that can't see each other.
- **It sits underneath, not in the way.** Keep your memory tool, your wiki, your agent loop — Knowie is the *why* layer beneath them, not a replacement. (The closest tool, "ADR for AI," links decisions to code but stays flat — no vision, no lessons, no health check.)

**You write it, so you can trust it.** Every line is there on purpose, not auto-scraped noise — and `/knowie-judge` keeps it honest. No black-box memory tool does that.

Mix and match: a search tool for finding code, a memory tool for personal history, Knowie for the curated *why*. Different jobs.

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

**Already deep into a project?** `/knowie-migrate` can rebuild the *why* straight from your git history — replaying it commit by commit, so you don't start from a blank page. It's new (beta): it suggests, you review, and your existing notes are kept safe in `knowledge.old/`.

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
| `/knowie-migrate` | Adopting Knowie on a project that already has history? Rebuild the *why* from your git log (beta) |

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
