import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { VERSION } from '../constants.js';
import { multiSelect } from '../ui.js';
import { resolveLanguage, t } from '../i18n.js';

const MCP_TARGETS = [
  {
    id: 'claude-code',
    name: 'Claude Code (project settings)',
    configPath: (projectRoot) => join(projectRoot, '.claude', 'settings.local.json'),
    ensureDir: (projectRoot) => join(projectRoot, '.claude'),
    scope: 'project',
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    configPath: () => join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    ensureDir: () => join(homedir(), 'Library', 'Application Support', 'Claude'),
    scope: 'global',
  },
  {
    id: 'cursor',
    name: 'Cursor (project settings)',
    configPath: (projectRoot) => join(projectRoot, '.cursor', 'mcp.json'),
    ensureDir: (projectRoot) => join(projectRoot, '.cursor'),
    scope: 'project',
  },
];

const MCP_ENTRY = {
  command: 'npx',
  args: ['-y', 'knowie', '--', 'knowie-mcp'],
};

async function readJsonSafe(path) {
  try {
    return JSON.parse(await readFile(path, 'utf-8'));
  } catch {
    return null;
  }
}

export async function setupMcp(projectRoot = process.cwd(), { yes = false } = {}) {
  const lang = await resolveLanguage(projectRoot);

  console.log(`\n🧠 knowie v${VERSION} — ${t(lang, 'cli.mcp.title')}\n`);

  let selectedIds;

  if (yes) {
    // Auto mode: configure all targets
    selectedIds = MCP_TARGETS.map(t => t.id);
  } else {
    const choices = MCP_TARGETS.map(t => ({
      id: t.id,
      name: `${t.name} (${t.scope})`,
      checked: false,
    }));

    selectedIds = await multiSelect(t(lang, 'cli.mcp.selectTools'), choices, lang);

    if (selectedIds.length === 0) {
      console.log(`\n${t(lang, 'cli.mcp.noSelection')}`);
      return;
    }
  }

  for (const id of selectedIds) {
    const target = MCP_TARGETS.find(t => t.id === id);
    if (!target) continue;

    const configPath = target.configPath(projectRoot);
    const dir = target.ensureDir(projectRoot);
    await mkdir(dir, { recursive: true });

    let config = await readJsonSafe(configPath) || {};

    if (!config.mcpServers) config.mcpServers = {};

    if (config.mcpServers.knowie) {
      console.log(t(lang, 'cli.mcp.alreadyConfigured')(target.name));
      continue;
    }

    config.mcpServers.knowie = MCP_ENTRY;
    await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
    console.log(t(lang, 'cli.mcp.added')(target.name));
  }

  console.log(`\n${t(lang, 'cli.mcp.done')}`);
  console.log(`${t(lang, 'cli.mcp.restart')}\n`);
}
