import { readFile, writeFile, access } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { KNOWLEDGE_DIR, KNOWIE_CONFIG, VERSION, STRUCTURE_VERSION } from '../constants.js';
import { scaffoldKnowledge } from '../scaffold.js';
import { installTemplates } from '../templates.js';
import { installSkills } from '../skills.js';
import { detectTools } from '../adapters/detect.js';
import { getToolById, getSkillDirs, TOOL_REGISTRY } from '../adapters/registry.js';
import { injectHandshake } from '../adapters/handshake.js';
import { confirm, multiSelect, select } from '../ui.js';
import { detectLanguage, normalizeLanguage, t } from '../i18n.js';

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

// Walk up for `.git` — a dir in a normal clone, a file in a worktree or submodule.
// Deliberately not `git rev-parse`: knowie assumes the *repository*, not the binary,
// and a missing CLI would read as "no git" and fire a wrong warning.
async function inGitRepo(dir) {
  let cur = dir;
  for (;;) {
    if (await exists(join(cur, '.git'))) return true;
    const parent = parse(cur).dir;
    if (!parent || parent === cur) return false;
    cur = parent;
  }
}

const LANGUAGE_CHOICES = [
  { id: 'en', name: 'English' },
  { id: 'zh-TW', name: '繁體中文' },
];

export async function init(projectRoot, { yes = false } = {}) {
  const detectedLang = normalizeLanguage(detectLanguage());
  let lang = detectedLang;

  console.log(`\n🧠 knowie v${VERSION}\n`);

  // 1. Language selection
  if (yes) {
    console.log(t(lang, 'cli.init.langDetected')(lang));
  } else {
    console.log(typeof t(lang, 'cli.init.langDetected') === 'function'
      ? t(lang, 'cli.init.langDetected')(lang) : lang);
    const langChoices = LANGUAGE_CHOICES.map(c => ({
      ...c,
      checked: c.id === detectedLang,
    }));
    lang = await select(t(lang, 'cli.init.selectLanguage'), langChoices);
  }

  // 2. Check if knowledge/ already exists
  const knowledgeExists = await exists(join(projectRoot, KNOWLEDGE_DIR));
  if (knowledgeExists && !yes) {
    console.log(t(lang, 'cli.init.exists'));
    const proceed = await confirm(t(lang, 'cli.init.continue'));
    if (!proceed) {
      console.log(t(lang, 'cli.init.aborted'));
      return;
    }
  }

  // 3. Scaffold knowledge/
  console.log('');
  const scaffoldReport = await scaffoldKnowledge(projectRoot, lang);
  for (const f of scaffoldReport.created) console.log(t(lang, 'cli.init.created')(f));
  for (const f of scaffoldReport.skipped) console.log(t(lang, 'cli.init.skipped')(f));

  // 4. Install templates
  const templates = await installTemplates(projectRoot, lang);
  console.log(t(lang, 'cli.init.templates')(templates.length));

  // 5. Detect tools
  const { detected } = await detectTools(projectRoot);

  let selectedIds;

  if (yes) {
    // Auto mode: AGENTS.md + all detected tools (dedupe — an existing AGENTS.md
    // makes agents-md show up in `detected` too, and it was landing twice in config)
    selectedIds = [...new Set(['agents-md', ...detected])];
    if (selectedIds.length > 0) {
      const names = selectedIds.map(id => getToolById(id)?.name).filter(Boolean);
      console.log(`\n${t(lang, 'cli.init.detected')(names.join(', '))}`);
    }
  } else {
    // Interactive mode
    if (detected.length > 0) {
      const names = detected.map(id => getToolById(id)?.name).filter(Boolean);
      console.log(`\n${t(lang, 'cli.init.detected')(names.join(', '))}`);
    }

    const aiTools = TOOL_REGISTRY.filter(t => t.category === 'ai');
    const specTools = TOOL_REGISTRY.filter(t => t.category === 'spec');
    const standardTools = TOOL_REGISTRY.filter(t => t.category === 'standard');

    // First: AI tools + standard
    const aiChoices = [
      ...standardTools.map(t => ({
        id: t.id,
        name: t.name,
        checked: true,
      })),
      ...aiTools.map(t => ({
        id: t.id,
        name: t.name,
        checked: detected.includes(t.id),
      })),
    ];

    const selectedAi = await multiSelect(t(lang, 'cli.init.selectTools'), aiChoices, lang);

    // Second: Spec tools (only if any exist in registry)
    let selectedSpec = [];
    if (specTools.length > 0) {
      const specChoices = specTools.map(t => ({
        id: t.id,
        name: t.name,
        checked: detected.includes(t.id),
      }));

      selectedSpec = await multiSelect(t(lang, 'cli.init.selectSpecTools'), specChoices, lang);
    }

    selectedIds = [...selectedAi, ...selectedSpec];
  }

  // 6. Handshake
  const writtenFiles = new Set();
  for (const id of selectedIds) {
    const tool = getToolById(id);
    if (!tool) continue;
    for (const target of tool.targets) {
      if (writtenFiles.has(target.file)) continue;
      const result = await injectHandshake(projectRoot, target);
      writtenFiles.add(target.file);
      const msgKey = `cli.init.handshake.${result.action}`;
      console.log(t(lang, msgKey)(result.file, tool.name));
    }
  }

  // 7. Install skills — physical in SKILLS_HOME, symlinked into the rest.
  // The dir list is resolved *before* the config write so both use one value.
  const skillDirs = getSkillDirs(selectedIds);
  const skills = await installSkills(projectRoot, skillDirs);
  console.log(`\n${t(lang, 'cli.init.skills')(skills.installed.length, skills.home, skills.projected)}`);

  // 8. Update .knowie.json
  const configPath = join(projectRoot, KNOWIE_CONFIG);
  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf-8'));
  } catch {
    config = { version: VERSION, structureVersion: STRUCTURE_VERSION, createdAt: new Date().toISOString() };
  }
  config.version = VERSION;
  // NOTE: don't stamp structureVersion onto an existing base — absence means an
  // older structure that /knowie-migrate should detect and migrate (then bump it).
  config.language = lang;
  config.tools = selectedIds;
  // Where learned skills get projected — the AI can't read the registry, so give
  // it the resolved list to enumerate (see getSkillDirs).
  config.skillDirs = skillDirs;
  config.updatedAt = new Date().toISOString();
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');

  // 9. Summary — flag a missing git repo *here*, not on every later run: it's a
  // one-time prerequisite, and a warning that repeats each planning round gets
  // tuned out (emphasis is a budget).
  if (!await inGitRepo(projectRoot)) {
    console.log(`\n${t(lang, 'cli.init.noGit')}`);
  }

  console.log(`\n${t(lang, 'cli.init.done')}\n`);
  console.log(`${t(lang, 'cli.init.nextStep')}\n`);
}
