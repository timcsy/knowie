import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

export const VERSION = pkg.version;

// Structure version — bumped ONLY when the knowledge *structure* changes
// (folders / file layout / conventions), NOT every release. Decoupled from the
// tool VERSION so minor releases don't trigger a false migration prompt.
// History: (absent) = pre-redesign era (research/design/history); '2' = current
// (concepts/episodes/history/draft + root/derived principles + []() links).
export const STRUCTURE_VERSION = '2';

export const PACKAGE_ROOT = join(__dirname, '..');

export const KNOWLEDGE_DIR = 'knowledge';
export const KNOWIE_CONFIG = 'knowledge/.knowie.json';
export const TEMPLATES_DIR = '.templates';

export const CORE_FILES = ['principles.md', 'vision.md', 'experience.md'];
export const SUBDIRS = ['concepts', 'episodes', 'history', 'draft', TEMPLATES_DIR];

export const SKILLS_SOURCE = join(PACKAGE_ROOT, 'skills');
export const SKILLS_TARGET = '.claude/skills';
export const SKILL_NAMES = ['knowie-init', 'knowie-capture', 'knowie-next', 'knowie-judge', 'knowie-update'];

export const MARKER_START = '<!-- Knowie: Project Knowledge -->';
export const MARKER_END = '<!-- /Knowie -->';
