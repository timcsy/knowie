import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_SOURCE, SKILLS_TARGET, SKILL_NAMES, KNOWLEDGE_DIR } from './constants.js';
import { getToolById } from './adapters/registry.js';

const CORE_MARKER = '<!-- knowie-core is injected above this line at install time -->';

/**
 * Install Claude Code skills into the project.
 * Each SKILL.md gets the shared _core injected at its marker, so the
 * installed skill is self-contained (skills don't read _core at runtime).
 * Always overwrites (managed files).
 */
export async function installSkills(projectRoot) {
  const installed = [];

  // Load the shared core once; strip its leading HTML-comment header.
  const core = await readFile(join(SKILLS_SOURCE, '_core.md'), 'utf8');
  const coreBody = core.replace(/^<!--[\s\S]*?-->\s*/, '').trim();

  for (const name of SKILL_NAMES) {
    const srcFile = join(SKILLS_SOURCE, name, 'SKILL.md');
    const destDir = join(projectRoot, SKILLS_TARGET, name);
    await mkdir(destDir, { recursive: true });

    let skill = await readFile(srcFile, 'utf8');
    skill = skill.includes(CORE_MARKER)
      ? skill.replace(CORE_MARKER, coreBody)
      : skill;
    await writeFile(join(destDir, 'SKILL.md'), skill);
    installed.push(name);
  }

  return installed;
}

/**
 * Install learned *domain* skills (knowledge/skills/<skill>/) into each detected
 * tool's skill location (agentskills.io: .claude/skills, .agents/skills, …).
 * knowledge/skills is the cerebellum (source of truth); these are copies.
 * Skips README.md (knowie's doc, not a skill). No-op until skills are learned.
 */
export async function installDomainSkills(projectRoot, toolIds = []) {
  const src = join(projectRoot, KNOWLEDGE_DIR, 'skills');
  let entries;
  try { entries = await readdir(src, { withFileTypes: true }); } catch { return { skills: [], dirs: [] }; }
  const skills = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  if (!skills.length) return { skills: [], dirs: [] };

  // Unique skill directories across the detected tools (e.g. .claude/skills, .agents/skills).
  const dirs = [...new Set(toolIds.map((id) => getToolById(id)?.skillsDir).filter(Boolean))];

  for (const dir of dirs) {
    for (const skill of skills) {
      await cp(join(src, skill), join(projectRoot, dir, skill), { recursive: true });
    }
  }
  return { skills, dirs };
}
