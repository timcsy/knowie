# skills — procedural memory (learned capabilities / the cerebellum)

Holds the **domain skills this project has learned** — repeated work distilled into executable capability (like the cerebellum: learned through repetition, then automatic).

## What goes here
- A domain task done **repeatedly** (scrape-and-build a dataset, batch-translate…) → capture records a "candidate skill" in `draft/` → on maturity, **human-confirmed** → consolidated into a skill here.
- A skill **is** knowledge — its use-intent is just "execute". It's high-stakes (it acts; it can fail silently) → consolidating it needs **stricter** human confirmation than committing knowledge.

## Format & install
- Each skill = a folder + `SKILL.md` ([agentskills.io](https://agentskills.io) open standard).
- This is the **source of truth**; on consolidation the **AI copies it straight into the tool's skill location** (`.claude/skills`, `.agents/skills`, …) so it's **usable now**, and `knowie update` does the **systematic re-sync** (new tools / new machine). Both copy from the same source.

## vs knowie's own skills
- Here: domain skills **this project** learned.
- knowie's built-in init/capture/next/judge/update are **protocol meta-skills** — they don't live here (installed from knowie).

(Just here to understand the project? Skip this layer — it's a capability library, not *why*.)
