import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_SOURCE, SKILLS_TARGET, SKILL_NAMES } from './constants.js';

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
