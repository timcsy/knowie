import { mkdir, copyFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
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

// Install the orientation READMEs — knowledge/README.md + one per subdir.
// These are *managed* files (they carry the filename/format conventions), not
// user knowledge. init copies them never-overwrite (don't clobber a populated
// base); update refreshes them to latest (overwrite) so convention changes
// reach existing bases. Both heal a base that's missing them entirely.
export async function installReadmes(projectRoot, language = 'en', { overwrite = false } = {}) {
  const knowledgeDir = join(projectRoot, KNOWLEDGE_DIR);
  const report = { created: [], skipped: [] };

  const copyManaged = async (destRel, tmplName) => {
    const dest = join(knowledgeDir, destRel);
    if (!overwrite && await exists(dest)) {
      report.skipped.push(destRel);
      return;
    }
    let src = join(PACKAGE_ROOT, 'templates', language, tmplName);
    if (!await exists(src)) {
      src = join(PACKAGE_ROOT, 'templates', 'en', tmplName);
    }
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
    report.created.push(destRel);
  };

  // knowledge/README.md — orients a third party who's never heard of knowie
  await copyManaged('README.md', 'knowledge-README.md');
  for (const [sub, tmplName] of Object.entries(SUBDIR_READMES)) {
    await copyManaged(join(sub, 'README.md'), tmplName);
  }

  return report;
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

  // Copy orientation READMEs (never overwrite a populated base)
  const readmeReport = await installReadmes(projectRoot, language, { overwrite: false });
  report.created.push(...readmeReport.created);
  report.skipped.push(...readmeReport.skipped);

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
