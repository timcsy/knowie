import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

export const VERSION = pkg.version;
export const PACKAGE_ROOT = join(__dirname, '..');

export const KNOWLEDGE_DIR = '.knowledge';
export const KNOWIE_CONFIG = '.knowledge/.knowie.json';
export const TEMPLATES_DIR = '.templates';

export const CORE_FILES = ['principles.md', 'vision.md', 'experience.md'];
export const SUBDIRS = ['research', 'design', 'history', TEMPLATES_DIR];

export const SKILLS_SOURCE = join(PACKAGE_ROOT, 'skills');
export const SKILLS_TARGET = '.claude/skills';
export const SKILL_NAMES = ['knowie-init', 'knowie-update', 'knowie-judge', 'knowie-next'];

export const MARKER_START = '<!-- Knowie: Project Knowledge -->';
export const MARKER_END = '<!-- /Knowie -->';
