import { readFile, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { KNOWIE_CONFIG, VERSION } from '../constants.js';
import { installTemplates } from '../templates.js';
import { installSkills } from '../skills.js';
import { detectTools } from '../adapters/detect.js';
import { getToolById } from '../adapters/registry.js';
import { injectHandshake } from '../adapters/handshake.js';
import { confirm } from '../ui.js';
import { resolveLanguage, t } from '../i18n.js';

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

export async function update(projectRoot, { yes = false } = {}) {
  const lang = await resolveLanguage(projectRoot);

  console.log(`\n🧠 knowie v${VERSION} — ${t(lang, 'cli.update.title')}\n`);

  // 1. Check .knowie.json exists
  const configPath = join(projectRoot, KNOWIE_CONFIG);
  if (!await exists(configPath)) {
    console.log(t(lang, 'cli.update.noConfig'));
    return;
  }

  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf-8'));
  } catch {
    console.log(t(lang, 'cli.update.badConfig'));
    return;
  }

  const configLang = config.language || lang;

  // 2. Update templates
  const templates = await installTemplates(projectRoot, configLang);
  console.log(t(lang, 'cli.update.templates')(templates.length));

  // 3. Update skills
  const skills = await installSkills(projectRoot);
  console.log(t(lang, 'cli.update.skills')(skills.length));

  // 4. Re-detect tools
  const { detected } = await detectTools(projectRoot);
  const existingTools = new Set(config.tools || []);
  const newTools = detected.filter(id => !existingTools.has(id));

  // 5. Handshake new tools
  if (newTools.length > 0) {
    const names = newTools.map(id => getToolById(id)?.name).filter(Boolean);
    console.log(`\n${t(lang, 'cli.update.newTools')(names.join(', '))}`);

    const add = yes || await confirm(t(lang, 'cli.update.addTools'));
    if (add) {
      for (const id of newTools) {
        const tool = getToolById(id);
        if (!tool) continue;
        for (const target of tool.targets) {
          const result = await injectHandshake(projectRoot, target);
          const verb = result.action === 'created' ? 'Created' : 'Updated';
          console.log(`  ✓ ${verb} ${result.file}`);
        }
        existingTools.add(id);
      }
    }
  }

  // 6. Refresh existing handshakes
  const writtenFiles = new Set();
  for (const id of existingTools) {
    const tool = getToolById(id);
    if (!tool) continue;
    for (const target of tool.targets) {
      if (writtenFiles.has(target.file)) continue;
      await injectHandshake(projectRoot, target);
      writtenFiles.add(target.file);
    }
  }
  console.log(t(lang, 'cli.update.refreshed')(writtenFiles.size));

  // 7. Update .knowie.json
  config.version = VERSION;
  config.tools = [...existingTools];
  config.updatedAt = new Date().toISOString();
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');

  console.log(`\n${t(lang, 'cli.update.done')}\n`);
}
