import { readFile, writeFile, mkdir, rm, symlink, lstat, readlink } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { SKILLS_SOURCE, SKILLS_HOME, BASE_SKILL_DIRS, SKILL_NAMES } from './constants.js';

const CORE_MARKER = '<!-- knowie-core is injected above this line at install time -->';

async function lstatOrNull(p) {
  try { return await lstat(p); } catch { return null; }
}

/**
 * Project one package skill into a non-home dir as a per-skill *relative* symlink.
 * Returns 'symlink' | 'copy' — copy is the Windows (and locked-down CI) fallback.
 *
 * Per-skill, never a whole-dir symlink: `.claude/skills/` is also where the user's
 * own skills live, and a dir symlink would swallow them (same reason 016 rejected it
 * for domain skills).
 */
async function projectSkill(projectRoot, dir, name, contents) {
  const linkPath = join(projectRoot, dir, name);
  const homePath = join(projectRoot, SKILLS_HOME, name);
  const target = relative(dirname(linkPath), homePath);

  const st = await lstatOrNull(linkPath);
  if (st?.isSymbolicLink() && await readlink(linkPath) === target) return 'symlink';
  // Anything else here is a stale projection of ours — a pre-0.7.6 real copy, an
  // absolute symlink, a link to a moved home. Replace it; only SKILL_NAMES are
  // ever touched, so a user's own skill of another name is never at risk.
  if (st) await rm(linkPath, { recursive: true, force: true });

  await mkdir(dirname(linkPath), { recursive: true });
  try {
    await symlink(target, linkPath, 'dir');
    return 'symlink';
  } catch {
    await mkdir(linkPath, { recursive: true });
    await writeFile(join(linkPath, 'SKILL.md'), contents);
    return 'copy';
  }
}

/**
 * Install the knowie package skills into the project.
 *
 * Physical files land in SKILLS_HOME (`.agents/skills/`, the cross-tool convention);
 * every other dir in `skillDirs` gets a per-skill relative symlink to it. One set of
 * bytes, so `knowie update` touches one copy and no tool's view can drift from another's.
 *
 * Each SKILL.md gets the shared _core injected at its marker, so the installed skill
 * is self-contained (skills don't read _core at runtime). Always overwrites (managed files).
 */
export async function installSkills(projectRoot, skillDirs = BASE_SKILL_DIRS) {
  const dirs = skillDirs?.length ? [...new Set(skillDirs)] : [...BASE_SKILL_DIRS];
  if (!dirs.includes(SKILLS_HOME)) dirs.unshift(SKILLS_HOME);
  const projected = dirs.filter(d => d !== SKILLS_HOME);

  // Load the shared core once; strip its leading HTML-comment header.
  const core = await readFile(join(SKILLS_SOURCE, '_core.md'), 'utf8');
  const coreBody = core.replace(/^<!--[\s\S]*?-->\s*/, '').trim();

  const installed = [];
  const copied = new Set(); // dirs where the symlink failed and we fell back to a copy

  for (const name of SKILL_NAMES) {
    const srcFile = join(SKILLS_SOURCE, name, 'SKILL.md');
    const destDir = join(projectRoot, SKILLS_HOME, name);
    await mkdir(destDir, { recursive: true });

    let skill = await readFile(srcFile, 'utf8');
    skill = skill.includes(CORE_MARKER)
      ? skill.replace(CORE_MARKER, coreBody)
      : skill;
    await writeFile(join(destDir, 'SKILL.md'), skill);
    installed.push(name);

    for (const dir of projected) {
      if (await projectSkill(projectRoot, dir, name, skill) === 'copy') copied.add(dir);
    }
  }

  return { installed, home: SKILLS_HOME, projected, copied: [...copied] };
}
