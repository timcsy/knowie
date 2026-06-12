# Changelog

All notable changes to knowie are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/); this project is pre-1.0, so a **minor** bump can carry breaking changes.

## [0.6.9] — 2026-06-12

### Fixed

- **`knowie update` now re-ensures the subdir READMEs** (`concepts/`, `episodes/`, `history/`, `draft/`, `skills/` + `knowledge/README.md`). Previously update only refreshed the `.tmpl` core templates into `.templates/`, so a base set up or refreshed via `update` (rather than a full `init`) had **no subdir READMEs at all** — and those READMEs are where the filename/format conventions live (`history/` = `NNN-slug`, `episodes/`+`draft/` = `YYYY-MM-DD-slug`). With the conventions absent, downstream metabolism guessed formats wrong (e.g. `history/` files date-prefixed instead of numbered, `draft/` files missing the date prefix). The README-copy logic is now factored into a shared `installReadmes()` — `init` copies never-overwrite, `update` refreshes to latest, both heal a base that's missing them.
- **`knowie update` now refreshes templates in the base's language**, not English. The MCP `knowie_update` path called `installTemplates` without the language, defaulting to `en` and overwriting a `zh-TW` base's `.templates/*.tmpl` with English. It now passes `config.language` (the CLI `update` already did).
- **Removed duplicated single-source-of-truth lists found in a drift audit** (the same class of bug as the README gap above): `CORE_FILES` was hardcoded twice inline in `src/mcp-server.js` (the judge/next handlers) — now imported from `constants.js`, so renaming a core file can't silently read a stale name. `SUBDIR_READMES` was defined locally in `scaffold.js` — now in `constants.js` next to `SUBDIRS`, so adding a subdir surfaces both lists in one place. And `_core.md`'s filename-language rule now lists `draft/` (it already applies in practice) and states the `skills/` + canonical-filename exception explicitly.

## [0.6.8] — 2026-06-12

### Changed

- **`/knowie-migrate` slices along git structure, not by guessing.** Replay now walks the `--first-parent` mainline, one slice per merge/PR — the mainline *is* the decision timeline (DDD domain events; a branch's internal commits are the *how* of one decision), so boundaries are git-structural and re-running yields the same skeleton. This removes the non-determinism a semantic (LLM-read) slicer would smuggle back in, and handles the common reality that history is a messy DAG, not a clean line (pure-linear no-merge history falls back to commit-runs; rebased history is *more* linear, not less).
- **`/knowie-migrate` treats the adoption commit as a phase boundary.** migrate quietly serves two operations with very different evidence — *structure migration* (knowie present from day 1) and *archaeological backfill* (knowie adopted midway). The seam is the first commit that introduces `knowledge/`: coarse slices before it (no contemporaneous knowledge — reconstruct from code/spec/PR, mark the why as inferred), fine slices after (read the contemporaneous `knowledge/`, the author's strongest why). Reading the old `knowledge/` is now enrichment-when-present, never a precondition — most real adoptions are midway, so the pre-adoption stretch is the common case.
- **`/knowie-migrate` separates stated-why from inferred-why, and never fabricates.** A why the author recorded is authoritative; a why reconstructed from a diff is marked as conjecture (HITL targets those first); a commit with no recoverable why is logged as an `episodes/` scene with no `history/` transition — an honest gap beats a confident fiction (why has no oracle; git can't verify it).
- **`/knowie-migrate` distinguishes correcting the record from re-deciding the past.** The monotonicity ban is only on re-litigating what the project actually decided (hindsight overruling history); fixing a *transcription error* (a slice mis-recorded what happened — e.g. a `history/` transition pointing at a decision the base never recorded, which `/knowie-judge` catches) is allowed — fix it and re-checkpoint. Checkpoint-per-slice plus periodic judge are the cascade firebreak.

## [0.6.7] — 2026-06-12

### Changed

- **`/knowie-capture` now fires on its own** (reliance + topic-pivot signals) instead of waiting to be asked: the moment you cite a criterion/lesson/decision as established, that reliance is proof it's load-bearing — verify it's captured, and if not, capture it now (a vivid discussion only *feels* stored). **`/knowie-judge` adds a "conceptual dead references" check** — named ideas cited as established but with no file/heading defining them, the mechanical backstop for the same gap. Together they guard against insights that get discussed but never captured.
- **`/knowie-migrate` now runs the real metabolism per slice instead of re-implementing it.** Each masked slice runs `/knowie-capture` (as the developer who just finished that slice would) — so the output is standard-format and `history/` only gets real decision-*transitions*, not a summary per slice. And the per-slice sub-agent is **sequential, carrying the accumulated base forward** (fresh = unseen-future, not empty) — without the prior state it can't detect transitions, which is why earlier runs degraded `history/` to per-milestone summaries.

## [0.6.6] — 2026-06-12

### Changed

- **`/knowie-migrate` masks the future *in-session* instead of relying on wording (or an external harness).** The previous skill contradicted itself — it told the AI to replay forward without peeking, yet also to read the final state for drift-detection and quarantine, so the AI saw the ending and rationalized backward. Now: detect *minimally* (structureVersion + folder names, never content); `mv knowledge knowledge.old` so the working tree can't be peeked; replay each slice in a **fresh sub-agent given only that slice's past** (`git show <commit>:…`) — a clean context that never saw the ending *is* the mask (worktree-per-commit as a stronger fallback; an external harness only as last resort). The old base is kept aside for an end cross-check. HITL during replay is read + additive-only (no mid-replay re-deciding — that breaks monotonicity).

## [0.6.5] — 2026-06-12

### Changed

- **`/knowie-migrate` no longer assumes SpecKit.** Design intent is sourced tool-agnostically: detect the spec tool by its marker (`.specify/` SpecKit, `openspec/` OpenSpec, `.kiro/specs/` Kiro, or others), else fall back to `docs/` / commit messages / PR descriptions — and **gracefully accept there may be none** (e.g. ephemeral plan-mode, nothing committed), in which case the intent lives in commit messages + the contemporaneous `knowledge/`. The primary *why* source is always the contemporaneous `knowledge/`; spec/plan is secondary and may be absent.

## [0.6.4] — 2026-06-12

### Changed

- **`/knowie-migrate` reads the contemporaneous `knowledge/` + specs at each slice**, as the primary *why* source — the author's own curated why *at that time*, watched as it evolves slice to slice — instead of reverse-engineering why from code diffs. This also subsumes the old "quarantine" step: old-rule curation (e.g. experience archived into `history/`) surfaces in the contemporaneous `knowledge/` at the slice where it was authored and is re-homed there by current rules.

## [0.6.3] — 2026-06-12

### Changed

- **`/knowie-migrate` now replays git history forward, slice by slice** — instead of judging the whole final state in one pass. The old one-pass reconstruction was non-reproducible (re-running produced a substantially different base) and blind to decision *transitions*. Replaying forward is monotonic (it converges — re-running is near no-op), catches transitions as they happen (the heart of `history/`), and anchors each episode to a real commit window rather than the model's per-run whim. Granularity (one slice per milestone / spec / commit cluster) is the cost knob. Migrate once and checkpoint — don't re-run from scratch. (From a third real-world migration that exposed the non-determinism.)

## [0.6.2] — 2026-06-12

### Changed

- **`/knowie-migrate` handles old-rule content + language + completeness** (from a second real-world migration). It now: (1) **quarantines existing curated files first** and re-judges each by current rules — an existing file's folder is not authoritative (e.g. lessons archived into `history/` under old rules belong in `experience`); (2) re-distributes content the git trail compressed under *past* rules, instead of replaying old homings; (3) **names files in the base's language** (`.knowie.json` `language`) — shared convention now stated in core (applies to capture / consolidate / migrate); (4) treats the **`structureVersion` bump as a hard final gate** with the explicit current value, and verifies the field is present (it was being dropped).

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

[0.6.7]: https://github.com/timcsy/knowie/releases/tag/v0.6.7
[0.6.6]: https://github.com/timcsy/knowie/releases/tag/v0.6.6
[0.6.5]: https://github.com/timcsy/knowie/releases/tag/v0.6.5
[0.6.4]: https://github.com/timcsy/knowie/releases/tag/v0.6.4
[0.6.3]: https://github.com/timcsy/knowie/releases/tag/v0.6.3
[0.6.2]: https://github.com/timcsy/knowie/releases/tag/v0.6.2
[0.6.1]: https://github.com/timcsy/knowie/releases/tag/v0.6.1
[0.6.0]: https://github.com/timcsy/knowie/releases/tag/v0.6.0
