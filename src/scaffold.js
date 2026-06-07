import { mkdir, copyFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import {
  KNOWLEDGE_DIR, KNOWIE_CONFIG, CORE_FILES, SUBDIRS,
  PACKAGE_ROOT, VERSION, STRUCTURE_VERSION, TEMPLATES_DIR
} from './constants.js';

// Subdirectories that get a README (excludes .templates)
const SUBDIR_READMES = {
  concepts: 'concepts-README.md',
  episodes: 'episodes-README.md',
  skills: 'skills-README.md',
  history: 'history-README.md',
  draft: 'draft-README.md',
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

export async function scaffoldKnowledge(projectRoot, language = 'en') {
  const knowledgeDir = join(projectRoot, KNOWLEDGE_DIR);
  const report = { created: [], skipped: [] };

  // Create knowledge/ and subdirectories
  await mkdir(knowledgeDir, { recursive: true });
  for (const sub of SUBDIRS) {
    await mkdir(join(knowledgeDir, sub), { recursive: true });
  }

  // Copy core files from language-specific templates (never overwrite)
  for (const file of CORE_FILES) {
    const dest = join(knowledgeDir, file);
    if (await exists(dest)) {
      report.skipped.push(file);
    } else {
      // Try language-specific template first, fallback to English
      let src = join(PACKAGE_ROOT, 'templates', language, `${file}.tmpl`);
      if (!await exists(src)) {
        src = join(PACKAGE_ROOT, 'templates', 'en', `${file}.tmpl`);
      }
      await copyFile(src, dest);
      report.created.push(file);
    }
  }

  // Copy knowledge/README.md (never overwrite) — orients a third party who's never heard of knowie
  {
    const dest = join(knowledgeDir, 'README.md');
    if (await exists(dest)) {
      report.skipped.push('README.md');
    } else {
      let src = join(PACKAGE_ROOT, 'templates', language, 'knowledge-README.md');
      if (!await exists(src)) {
        src = join(PACKAGE_ROOT, 'templates', 'en', 'knowledge-README.md');
      }
      await copyFile(src, dest);
      report.created.push('README.md');
    }
  }

  // Copy subdirectory READMEs (never overwrite)
  for (const [sub, tmplName] of Object.entries(SUBDIR_READMES)) {
    const dest = join(knowledgeDir, sub, 'README.md');
    if (await exists(dest)) {
      report.skipped.push(`${sub}/README.md`);
    } else {
      let src = join(PACKAGE_ROOT, 'templates', language, tmplName);
      if (!await exists(src)) {
        src = join(PACKAGE_ROOT, 'templates', 'en', tmplName);
      }
      await copyFile(src, dest);
      report.created.push(`${sub}/README.md`);
    }
  }

  // Create .knowie.json
  const configPath = join(projectRoot, KNOWIE_CONFIG);
  if (await exists(configPath)) {
    report.skipped.push(KNOWIE_CONFIG);
  } else {
    await writeFile(configPath, JSON.stringify({
      version: VERSION,
      structureVersion: STRUCTURE_VERSION,
      language,
      createdAt: new Date().toISOString(),
      tools: []
    }, null, 2) + '\n');
    report.created.push(KNOWIE_CONFIG);
  }

  return report;
}
