# Changelog

All notable changes to knowie are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/); this project is pre-1.0, so a **minor** bump can carry breaking changes.

## [0.7.5] — 2026-08-26

One suggestion from outside — define your vocabulary up front, then refer back to it instead of re-explaining (DDD's ubiquitous language, as applied to skill-writing) — and it changed shape on contact with the constraint that makes knowie knowie: **skills are copied into other people's repos**, so `history/012` is a pointer that resolves nowhere for every user who isn't this project. Rationale had nowhere to go, so it sat inline next to the criterion it justified; judge's longest bullet ran 1099 characters. The only reference target guaranteed to be present is `_core`, because the CLI injects it into every `SKILL.md`. Everything below follows from that.

### Changed

- **`/knowie-judge`: criterion and rationale no longer share a line — 13538 → 10928 characters (−19.3%).** Three things turned out to be cuttable, and they generalize. **Evidence**: the numbers that justify a threshold to a human reader (seven bases at 0.0/1.4/2.3/2.5% vs 11.8/13.4/22.4%, six bases for the `history/`-shape check) don't change what the AI does — they belong in `history/` and `episodes/`. **Tombstones**: the 629-character sub-bullet explaining why filename-keyword matching was rejected is addressed to whoever might *add* a check, and judge's reader is executing them, not designing them; it already has a grave in `history/012`. **Duplication with `_core`**: "collapsing a finished stage under `<details>` is a symptom, not the fix" is in `_core`'s *marking in place is not dispatch*, injected directly above — now a `see core:` pointer, which is the same technique the suggestion proposed, aimed at a target that actually resolves. What did **not** move: every threshold (`~10%`, `>80%`, `3:1`, retirement debt's `0`), every grep, every exclusion clause. Compressing a countable check into an elegant noun phrase is precisely the failure `history/014` closed one release ago. One bullet was **split rather than shortened** — §2's "within each file" packed four checks into one line while its own last clause says a bullet crammed with several claims should be split.
- **`/knowie-migrate`: the same rule, a much narrower safe set — 12452 → 11141 characters (−10.5%).** judge's checks are mechanical, so its rationale only ever persuaded a human. migrate is generative: its wording constrains what the AI does under masking, and its entire failure history is the AI peeking at the ending. So every behavioral guard is untouched — causal masking, *don't read the working tree*, two voices, inferred-vs-absent why, dates from git, no mid-pass re-deciding. What went: the RNN → Transformer derivation and the event-sourcing/IRL mirrors (**provenance** — still in `draft/2026-06-12-migrate時間軸replay.md` and `concepts/意義可追溯改寫`, verified present before cutting, because a skill must never be the only copy), the **tombstone** for why the old sequential fold was abandoned (its one executable part — that long-range transitions need global reach — folded into the encoder's description instead), and `## Invariants`, which was a second verbatim copy of Phases A–D. That section was **not deleted**: a generative skill benefits from a closing recitation. Each entry was compressed from a re-explanation to a name plus the clause that is actually the rule — the phases carry the derivation, the list is the recall handle. That is the suggestion working as intended, pointed at the same document's upper half.
- **Named concepts stay assertions, not nouns.** The suggestion's canonical form is a noun phrase ("the materialization cascade"). `history/013`, two releases old, moved concept naming the other way for a reason that still holds: a noun tells you where to file something, a claim lets you judge it. The reconciliation is in `history/017` — a term used as a *retrieval handle* wants to be rare and distinctive; a term that *is* the criterion has to stay judgeable. `_core`'s own headings (`Emphasis is a budget`, `Consolidating is dispatch, not relocation`) are both at once, which is strictly better than either.

### Fixed

- **judge §5's example was undercutting the rule in the next sentence.** "…into **every** dir listed in `skillDirs` (typically `.agents/skills/` … and `.claude/skills/` …)" is immediately followed by "**enumerate that list — don't project into only the dir you happen to read yourself**". Handing the reader two concrete directory names is an invitation to use those two instead of enumerating — the continuation of the exact failure 0.7.3 diagnosed as *having no list to enumerate*. The example is gone.
- **Two shipped skills pointed at this project's own files.** judge cited `history/012` and migrate cited `history/001-early-lessons`; neither exists in a user's base. Both were backticked rather than `[]()` — the notation was already admitting they weren't real links. The warnings survive without the citations.

### Knowledge base (not shipped)

Retirement debt went 2 → 0, and settling it surfaced the reason it existed: both decisions had never reached `history/` at all — `015` (structure version decoupled from tool version, after `init`/`update` unconditionally wrote `config.version` and silently marked un-migrated bases as current) and `016` (skill distribution from single-source-plus-enumerated-projection, and the "Codex has no skill mechanism" belief underneath the old design). `009` regains the four guardrails for using git as context, which had been living only in a draft that was about to retire. `fixtures/judge-baseline.md` pins ten real bases by commit, because 0.7.4's indebted trio (11.8/13.4/22.4%) has since been repaired and no longer reproduces — the clean gap has moved to 6.8% → 14.2% across a sample of ten, and `~10%` still separates them.

`structureVersion` unchanged. `npx knowie update` picks up the compressed skills.

## [0.7.4] — 2026-08-26

Three fixes, all flowed back from one real project (KnowField) — and all three are defects in checks 0.7.3 itself shipped, not in the knowledge structure. The common shape: **a clause and the scanner that enforces it had drifted apart** — once the scanner counted something it shouldn't, twice it was missing a clause entirely.

### Fixed

- **The orphan rate was systematically inflated by link notation — judge now measures notation before reporting any graph number.** The orphan/backlink/dead-link scans only recognize `[]()`, so a base that points at files with `[[wikilinks]]` or backticked paths has edges an AI can follow by name but **grep cannot see** — every downstream number comes out wrong, and wrong in the direction that reads as catastrophic. KnowField: converting the notation took its link count from 14 to 165+ and dropped `history/`'s orphan rate to 26%, without one word of content changing. Sending someone to reorganize a knowledge base when the real problem is link syntax is the most expensive kind of false positive. The definition needed care (65 self-inflicted false positives before it converged): a `[[ ]]` counts only **with content** (an empty one is prose *about* the notation), and a backticked path counts only if it **resolves to a file that exists in this base** and isn't a generic name (`SKILL.md`, `README.md`, the three core files). Seven real bases: 0.0 / 1.4 / 2.3 / 2.5%, a clean gap, then 11.8 / 13.4 / 22.4% — healthy and indebted separate, so this one **earns a threshold** (~10%) where emphasis density didn't (`history/012`). Third check validated against a real distribution, and the first one validated *before* it was written rather than after.
- **Retirement debt was invisible — two existing checks jointly certified it as healthy.** judge §4 has said since 0.7.2 that a finished roadmap item retires **and so does its source design draft**, but that rule lived only in prose. The one mechanical check nearby (Draft↔vision sync) inspects the *promotion* side — does a linked draft carry its marker — and §5's exception protects any draft linked from an **active** roadmap item. So a draft whose item is already `[x]`, carrying an in-flight marker, satisfies both: marked ⇒ healthy, linked ⇒ never reap. KnowField had accumulated **26** such drafts with **104** inbound pointers, and judge came back green every time. New check, **Retirement debt**: grep vision for `[x]` items still linking a `draft/` file. Counted in **absolutes, not ratios** (unlike done:open — retirement is event-triggered, not a flow), healthy value **0**, reported as one 🔴 with the inbound count beside it as the re-point worklist rather than a second finding. §4 also gains an ordering clause — **extract → re-point → delete** — because a batch delete that skips extraction is silent loss of the only irreproducible part (options weighed, numbers actually measured) and it leaves every check green. Sharpening the prose was considered and rejected: 26 misses is not a comprehension failure, it's the absence of anything that lights up.
- **Dead links vetoed the one correct operation that must create them.** Retirement necessarily breaks the pointers aimed at what it retires, and dead links are listed as rot — so on the base's own scoreboard, *proposing a deletion reads as proposing damage*. Observed live: "deleting these would produce 31 dead links" was used to argue against the retirement the protocol requires, until the user asked "aren't dead links exactly the thing you're supposed to fix?". The check now carries its exemption: dead links a **pending** retirement would create are the re-point worklist, quotable as the size of step 2 and never as a reason to keep the file. Generalized in `concepts/讓認錯變便宜`: no mechanism should make a correct operation look like damage on its own metric — a red light with a number attached is the best rationalization ammunition there is.

### Changed

- **`_core`: marking in place is not dispatch — it's weaker than relocation.** "Consolidating is dispatch, not relocation" already forbade moving a block whole, but not the move that actually happened for months: annotating a draft `redeemed` / `done` and leaving it. The file hasn't moved, every pointer still aims at short-term memory, and the brainstorming scene is still unextracted — the same symptom as folding a finished vision stage under `<details>` (the bulk is still there). Test: after the operation, is the file still where it was? Then nothing was dispatched.

`structureVersion` unchanged. `npx knowie update` picks up the sharper judge and `_core`.

## [0.7.3] — 2026-08-14

Everything here came out of auditing five real projects that use Knowie (ArduinoCAD, VizGPT, KnowField, semorphe, wewayfinders) — the first time Knowie's own output, rather than a theory or a competitor, was used as the mirror. It caught two things the earlier mirrors structurally couldn't: work that had already been delivered but never recorded, and template improvements the users had invented on their own.

### Fixed

- **`.agents/skills/` was never actually created — the instruction had no list to enumerate.** Projecting a learned skill is the AI's job (`/knowie-capture`, `/knowie-judge` §5), and both skills said to project into `.claude/skills/` *and* the cross-tool `.agents/skills/`. But the registry's `skillsDir` is CLI data the skill markdown can't read, and `knowledge/.knowie.json` recorded only tool *ids* — so the AI had nothing to enumerate and projected into the one directory it reads itself. Across all five audited projects `.agents/skills/` did not exist, on four bases whose registered tool was `agents-md` (not `claude-code`) — meaning Codex/Gemini were blind to every skill those projects had learned. `init`/`update` (CLI and MCP, all four config writes, via a shared `getSkillDirs()`) now resolve the registered tools' skill directories into `.knowie.json` → `skillDirs`, and capture/judge enumerate *that*. The registry stays the single source of truth; the config just carries a projection of it.
- **Skill projections must be relative symlinks.** One audited base had absolute ones (`/Users/…/knowledge/skills/…`), which break on any other machine or checkout. judge §5 now rewrites absolute links it finds (reversible → it just does it).
- **`knowie --version` printed the help text instead of the version.** The help branch tested `!cmd` first, and a bare `--version` has no command, so it never reached the version branch. (Found while verifying this release.)
- **`knowie init --yes` recorded duplicate tool ids.** An existing `AGENTS.md` puts `agents-md` in both the default list and the detected list, so it landed twice in `config.tools`; the MCP path deduped, the CLI path didn't (the same CLI/MCP drift family as 0.6.9).

### Changed

- **`/knowie-judge` gains five mechanical checks — and deliberately does not gain a sixth.** 0.7.2 tightened "a completion is not a transition" with prose; the audit found the disease still present in real bases, because prose is addressed to a reader who already believes they complied. Now greppable: an `## Transition` block whose *old* side reads "not yet / only X / just a draft" (a progress bar, not a superseded decision); vision's `[x]:[ ]` ratio past ~3:1 (redeem-and-retire isn't running); a subdirectory with >80% orphans reported as **one 🔴** ("this tier was never wired in") rather than N 🟡 that scroll past; a lesson with no source pointer (root axiom 2 — the *how*-leg is gone); filenames containing spaces (they make `%20`-encoded and literal links disagree, silently breaking half the pointers). **The sixth — matching `history/` filenames against transition words — was built, tested against six real bases, and cut**: it false-positived on five of them (`unified`, `switched to`, `downgraded to`, `consolidated`, `precedes` are all real transitions), because the vocabulary of change is an open set. It survives as a *naming prompt* in `history-README` instead. Same type-1 / type-2 split migrate already uses: a definable category error earns a rule, judgment variance gets a human, not an ever-longer regex. Acceptance run across all six bases: **zero false positives** — every flag was a defect confirmed by hand during the audit.
- **The experience template grows a boundary and a sideways link.** Three of the five projects had independently evolved the four-part format in the same direction, so the template follows: *Actually happened / Lesson / Source* are always required; the opener is a choice between **Theory said** (there was a gap) and **How it hit** (procedural lessons, where forcing an expectation invents a fake one); **Doesn't apply when** (the boundary — without it a lesson gets over-applied and ends up rewritten once per context) and **Related** (sibling lessons) are optional and usually worth the space. The template also now says to write the lesson as a **criterion**, not a **practice** — a practice expires with the stack, a criterion travels — and notes that *Source* is the leg that disappears first once you start adapting the format (measured: two bases had dropped it from 58% and 74% of their lessons).
- **`_core` and `concepts-README`: name a concept as a claim, not a noun.** `copying-a-truth-schedules-its-expiry.md` over `duplication.md`. A noun tells you where to *file* something; a claim lets you *judge* it — which makes the existing pruning-power test fire at naming time instead of six months later when the concept turns out to hold nothing. The audit's clearest split: the base with claim-named concepts could prune, the one with a domain vocabulary could not.
- **`_core`: emphasis is a budget.** Bold marks the criterion itself, ⚠️ marks "I got this wrong right here", everything else stays plain. Two of the audited bases carried 800+ ⚠️ apiece, and the single best-written concept file among them had 20+ on one page — at which point the genuinely load-bearing sentences sink. This costs more with an AI reader than a human one: emphasis is a signal aimed at attention, and diluting it lowers recall precision, which is the mechanism `/knowie-next` actually runs on. It stays a *writing* criterion in `_core` and deliberately does **not** become a judge scan — measured across six bases, inline emphasis density lands in a 0.42–0.77 band with the best-written base sitting mid-range, so it doesn't separate healthy from unhealthy well enough to be a flag.
- **The three core-file Key Extensions tables now use `[]()` links.** All 23 rows were backticked paths — derived principle 8 ("links are always `[]()`: navigable, greppable, no resolver") was unenforced in the very files that state it, which left five `history/` entries mechanically orphaned. Knowledge-base change only; no `structureVersion` bump.

`structureVersion` unchanged — the knowledge structure is identical. Existing bases keep working; `npx knowie update` picks up the sharper skills, templates, and the new `skillDirs` key.

## [0.7.2] — 2026-07-28

### Changed

- **Reflow discipline tightened: a completion is not a transition.** Three real-project dogfoods (`history/010`) surfaced two failure modes that dogfood alone couldn't — `history/` used as a changelog (LearnNews: 31 entries in 5 days, many just "increment shipped / tests green" dressed under a "Transition" heading) and `vision/` used as an append-only log (VizGPT: 738-line roadmap, every finished stage sedimenting its delivery notes / obsolete "current state" / lifted caveats inline). Same disease — a completion that never *exits*, settling in the wrong tier. Fixes: **capture** adds a `Completion ≠ transition` test (a milestone earns a `history/` entry only when it *revealed a pivot*; delete the delivery/test lines — if an "old → new, and why" remains it's history, else it's a commit/CHANGELOG + `episodes` scene whose lesson reflows to `experience`); **judge** §2 adds a vision "stays forward-looking?" structure check and §5 strengthens vision tidy to *redeem-and-retire, then converge* (a done item collapses to a one-line result + a `history/` pointer; detail retires to `episodes`/`history`, `<details>`-collapsing is a symptom not the fix; keep the body's modes apart — stable positioning + live roadmap + a thin milestone index); **history-README** (en + zh-TW) closes the "milestone = completion" loophole and adds a "not here" section. `structureVersion` unchanged (skill/template behavior only; the knowledge structure is the same — existing bases keep working, they just get sharper guidance). See `history/011`.

## [0.7.1] — 2026-06-17

### Docs

- **README + docs reworked for release.** Repositioned against the now-hot landscape in plain language (AI memory / LLM wikis / autonomous loops — "they manage memory or automation; Knowie holds the *why*"), with the key anti-lock-in points: it's yours and travels (Markdown + git), it sits underneath not in the way, and it wraps any round of work (spec / agent loop / plan mode) without being tied to an engine. Added a concise "full loop" (setup once → `next` → a round → `judge` → `capture`/`consolidate` → repeat), honest 0.x/beta labelling (the daily loop is solid; `/knowie-migrate` is beta), a dogfood note (Knowie is built using Knowie), and surfaced the tutorial / origin-story / video-intro links at the top. Fixed stale facts in `docs/` (`.knowie.json` location, removal markers, the real `specify init` command, version references) and aligned the tutorial with the real end-to-end workflow. No code changes.

## [0.7.0] — 2026-06-13

### Changed

- **`/knowie-migrate` rewritten as an encoder-decoder over git** (was a sequential masked fold). The old model carried an accumulated base forward slice-by-slice (an RNN hidden state) — slow, and long-range transitions got diluted into the lossy base and missed. The rewrite splits the work the way a Transformer does: a **bidirectional structure pass** (the encoder — reads the whole history, emits *only* structure: slicing + the transition/tombstone/projection-edit classification; never any why, so it can see everything without rationalizing), **parallel causal-masked sub-agents** (the decoder — one per slice, each blind to its own future, recovering the author's why-under-uncertainty by running the real metabolism locally), a **merge** (assemble the masked whys into the structure; fill the cross-slice *transition* whys, which legitimately span both endpoints), and **rumination** (re-read against git — the fixed text — until it converges; HITL is a denoising step). Parallelism is now safe because transition-detection moved up to the encoder, so masked slices do only local why and need no carried base — reframing the old "sequential, never parallel" rule rather than contradicting it. Git dates + `--first-parent` order are the positional encoding (structural, not cosmetic). The prior patch-rules (mask-the-future, projection-edit≠event, tombstone≠transition, dates-from-git, two-voices, re-bootstrap, adoption-phase) are preserved but **fold into the phases as properties** rather than standing as separate bullets — the skill is shorter and generated from the architecture. **Structure can now converge** (encoder + rumination against fixed evidence); **why stays a sample** (no oracle). **Unverified — a big rewrite; needs A/B against the prior model on a real project before it's trusted.** (`structureVersion` unchanged — the knowledge structure is the same; only migrate's process changed.)

## [0.6.13] — 2026-06-13

### Changed

- **`/knowie-migrate` no longer dresses rejected options as transitions.** A re-run produced `history/` entries like "001 — 否決 ORM" framed as an X→Y transition ("old: (candidate) ORM → new: raw SQL"), with one numbered entry per rejection — but a never-adopted candidate was never *in force*, so nothing is `superseded`; it's a **tombstone** (what was considered, why declined, thaw condition), not a transition. The skill now states the distinction sharply: only a decision that *was actually in force and then changed* gets a numbered transition; a rejected option is a tombstone and tombstones may be grouped into one catalog (per milestone), not one `NNN` each. The tell: if there's no prior decision this supersedes, it's a tombstone. (Found dogfooding — same family as the projection-edit miss: what belongs in `history/`, and in what shape.)
- **`/knowie-migrate` now states its nature up front: a one-shot generative reconstruction + human curation, not an idempotent function.** It infers unverifiable why from git (why has no oracle), so re-running yields a different-but-valid reconstruction — expected, not a bug. Differences split into Type 1 (definable category errors → rules, they converge) and Type 2 (inherent judgment variance → handled by HITL curation, not ever-sharper prose rules). The quality gate is good-enough + human curation, not determinism — so migrate isn't held to the convergence/idempotence standard that fits the skills operating on existing knowledge.

## [0.6.12] — 2026-06-13

### Changed

- **`/knowie-migrate` now emphatically dates everything by the git commit date, never the run date.** A migrated episode came out dated to the day migrate *ran* (today) instead of when the feature actually happened — live capture stamps *today*, and replaying you fall into that muscle memory and silently corrupt the timeline. The per-slice rule is now a prominent warning with the lookup command (`git show -s --format=%cs <commit>`), applied to filename prefixes, `> 日期：` body lines, and how-leg dates, plus a dedicated invariant. Every date is a *past* git date, never now.

## [0.6.11] — 2026-06-13

### Changed

- **`/knowie-migrate` re-bootstraps via the real scaffold after `mv`, so `update`'s READMEs survive and the format source is present during the replay.** The old flow did `mv knowledge knowledge.old` then hand-`mkdir`'d the fresh subdirs, and only created the subdir READMEs at the final step — so the filename/format conventions they carry (`history/` = `NNN`, `episodes/`/`draft/` = date-prefix) were **absent for the entire replay**, which is why migrated `history/` files came out date-prefixed instead of numbered. Now step 2 runs the CLI bootstrap (`scaffoldKnowledge`) to lay down the canon subdirs **+ subdir READMEs + `.templates/` + `.knowie.json` from the package, carrying the language read back from `knowledge.old/.knowie.json`** (so it isn't defaulted to English) — the convention source is in place *before* slice 1. Scaffolding is the CLI's bootstrap job, not AI hand-work (a hand `mkdir` is exactly how the just-`update`-installed READMEs vanished).
- **Per-slice sub-agents now name files by the subdir READMEs** — `history/` numbered (never date-prefixed), `episodes/`/`draft/` date-prefixed with the slice's *contemporaneous* date, base-language filenames. (Even with READMEs present, the replay wasn't consulting them.)
- **`/knowie-migrate` honors an explicit rebuild request** — detection no-ops a current-`structureVersion` base, so to deliberately re-replay one the human says so and migrate treats it as drift instead of silently doing nothing.

## [0.6.10] — 2026-06-13

### Changed

- **`/knowie-migrate` no longer replays knowledge-base housekeeping as domain history.** A commit whose diff touches only `knowledge/` is an edit to the *old projection* (the old knowledge metabolism under old rules), not a domain event — in the event-sourcing frame migrate runs on (git = event log, `knowledge/` = projection), replay rebuilds the projection fresh from the **domain** events (code/spec/product), so re-enacting an old projection edit is a category error. Such commits now yield **no `history/` transition**: read the contemporaneous `knowledge/` state they left as reference, but re-home their content by current rules at its *original authoring slice* (an archived lesson → `experience`, where it was first learned) and ignore the move itself. This is the structural fix for the `history/001-early-lessons`-type regression — a knowledge-housekeeping commit ("M1 lessons archived experience → history/") was being mistaken for a domain decision and faithfully reproduced. Found dogfooding migrate on a real project.

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
