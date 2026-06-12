# Changelog

All notable changes to knowie are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/); this project is pre-1.0, so a **minor** bump can carry breaking changes.

## [0.6.1] — 2026-06-12

### Changed

- **`/knowie-migrate` is now deep by default.** Migrating an existing base is treated as *memory archaeology*, not folder-renaming: it reconstructs the project's past from **git history + specs** and dispatches each piece to its right layer — recall-worthy **scenes → `episodes/`**, **decision transitions → `history/`** (a scene is not a decision — don't conflate), recurring concepts → `concepts/`, lessons → `experience`. It also completes the canon (Key Extensions tables, all subdirs incl. `skills/`, `[](path)` links, root/derived principles) and bumps `structureVersion` only once canon is fully applied. Prompted by the first real-world migration, where the shallow version left `episodes/` empty and the routing interface missing.

## [0.6.0] — 2026-06-12

A ground-up redesign: knowie is now **a why-protocol parasitic on markdown** — for "human + AI" shared understanding of a project's *why*.

### ⚠️ Breaking — knowledge structure redesigned

The knowledge layout changed. **Your knowledge is never touched automatically.**

- Old: `research/` · `design/` · `history/` (folders that mixed *type* and *time*).
- New: `concepts/` (semantic) · `episodes/` (episodic) · `skills/` (procedural / cerebellum) · `history/` (causal trail) · `draft/` (working memory) — plus root/derived principles and `[](path)` links.
- **Upgrading an existing project:** `npx knowie update` won't migrate your files — it flags the drift loudly. Run **`/knowie-migrate`** (inside your AI) to migrate: it detects drift, proposes each move, and you confirm. Breaking changes are surfaced, never applied silently. `.knowie.json` now carries a `structureVersion` (decoupled from the tool version) so old structures are recognized.

### Added

- **Six judgment-based skills** (was fewer): `init` / `capture` / `consolidate` / `next` / `judge` / `migrate`. They share an injected `_core`. `capture` → encode a discussion into the right place; `consolidate` → human-initiated, move a ripe draft into the long-term tier; `next` → plan grounded in principles/vision/experience; `judge` → coherence + alignment + rot check, then tidy.
- **Five memory layers** — added `episodes/` (recall-worthy scenes) and `skills/` (learned domain skills / cerebellum, agentskills.io SKILL.md format).
- **`/knowie-migrate`** — structure migration, distinct from the CLI's `knowie update`. Uses git as a time machine to reconstruct contemporaneous context when re-homing old content is ambiguous.
- **Cross-vendor domain skills** — learned skills live in `knowledge/skills/` (single source) and are projected (per-skill symlink, copy-fallback on Windows) into your tools' skill dirs (`.claude/skills`, `.agents/skills`).
- **25+ AI tools** auto-detected, with `AGENTS.md` (the cross-tool standard) as a neutral handshake point.

### Changed

- Links are plain `[](path)` (grep-verifiable, no resolver); the graph/backlinks are derived, not stored.
- `knowie update` (CLI) only refreshes managed files (skills/templates) and never touches your knowledge or its structure version.

[0.6.1]: https://github.com/timcsy/knowie/releases/tag/v0.6.1
[0.6.0]: https://github.com/timcsy/knowie/releases/tag/v0.6.0
