import { createInterface } from 'node:readline';
import { VERSION, STRUCTURE_VERSION, PACKAGE_ROOT } from './constants.js';

const PROTOCOL_VERSION = '2025-03-26';

// ── Tool Definitions ───────────────────────────────────────────────

const TOOLS = [
  {
    name: 'knowie_init',
    description: 'Scaffold knowledge/ structure, detect AI tools, inject references, and install skills. Returns a report of what was created.',
    inputSchema: {
      type: 'object',
      properties: {
        project_path: {
          type: 'string',
          description: 'Absolute path to the project root. Defaults to current working directory.',
        },
        tools: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tool IDs to connect (e.g., ["agents-md", "claude-code"]). If omitted, auto-detects and connects all detected tools plus AGENTS.md.',
        },
      },
    },
  },
  {
    name: 'knowie_update',
    description: 'Update Knowie skills and templates (managed files), re-detect tools, and refresh handshakes. Never overwrites knowledge files.',
    inputSchema: {
      type: 'object',
      properties: {
        project_path: {
          type: 'string',
          description: 'Absolute path to the project root. Defaults to current working directory.',
        },
      },
    },
  },
  {
    name: 'knowie_judge',
    description: 'Cross-check knowledge/ files for consistency and coherence. Returns a structured health check report with traffic-light indicators.',
    inputSchema: {
      type: 'object',
      properties: {
        project_path: {
          type: 'string',
          description: 'Absolute path to the project root.',
        },
        scope: {
          type: 'string',
          description: 'What to check: empty for full check, a file name (e.g., "experience"), a pair (e.g., "principles vision"), or an event description.',
        },
      },
    },
  },
  {
    name: 'knowie_next',
    description: 'Suggest what to work on next based on knowledge/ files. Returns a feature brief grounded in principles, vision, and experience.',
    inputSchema: {
      type: 'object',
      properties: {
        project_path: {
          type: 'string',
          description: 'Absolute path to the project root.',
        },
        direction: {
          type: 'string',
          description: 'Optional direction or feature area to explore. If omitted, suggests the next logical step from the roadmap.',
        },
      },
    },
  },
];

// ── Tool Handlers ──────────────────────────────────────────────────

async function handleKnowieInit(args) {
  const projectPath = args.project_path || process.cwd();
  const { scaffoldKnowledge } = await import('./scaffold.js');
  const { installTemplates } = await import('./templates.js');
  const { installSkills } = await import('./skills.js');
  const { detectTools } = await import('./adapters/detect.js');
  const { getToolById } = await import('./adapters/registry.js');
  const { injectHandshake } = await import('./adapters/handshake.js');
  const { readFile, writeFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const { KNOWIE_CONFIG } = await import('./constants.js');
  const { resolveLanguage } = await import('./i18n.js');

  const lang = await resolveLanguage(projectPath);
  const report = [];

  // Scaffold
  const scaffoldResult = await scaffoldKnowledge(projectPath, lang);
  for (const f of scaffoldResult.created) report.push(`✓ Created ${f}`);
  for (const f of scaffoldResult.skipped) report.push(`· Skipped ${f} (already exists)`);

  // Templates
  const templates = await installTemplates(projectPath, lang);
  report.push(`✓ Installed ${templates.length} templates`);

  // Detect & handshake
  const { detected } = await detectTools(projectPath);
  let toolIds = args.tools;
  if (!toolIds || toolIds.length === 0) {
    toolIds = ['agents-md', ...detected];
  }

  const writtenFiles = new Set();
  for (const id of toolIds) {
    const tool = getToolById(id);
    if (!tool) continue;
    for (const target of tool.targets) {
      if (writtenFiles.has(target.file)) continue;
      const result = await injectHandshake(projectPath, target);
      writtenFiles.add(target.file);
      report.push(`✓ ${result.action} ${result.file} (${tool.name})`);
    }
  }

  // Skills
  const skills = await installSkills(projectPath);
  report.push(`✓ Installed ${skills.length} skills`);

  // Update config
  const configPath = join(projectPath, KNOWIE_CONFIG);
  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf-8'));
  } catch {
    config = { version: VERSION, structureVersion: STRUCTURE_VERSION, createdAt: new Date().toISOString() };
  }
  config.version = VERSION;
  // Don't stamp structureVersion onto an existing base (absence = older structure).
  config.language = config.language || lang;
  config.tools = [...new Set(toolIds)];
  config.updatedAt = new Date().toISOString();
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');

  report.push('');
  report.push('Done! Run /knowie-init in your AI tool to populate knowledge files.');

  return report.join('\n');
}

async function handleKnowieUpdate(args) {
  const projectPath = args.project_path || process.cwd();
  const { installTemplates } = await import('./templates.js');
  const { installReadmes } = await import('./scaffold.js');
  const { installSkills } = await import('./skills.js');
  const { detectTools } = await import('./adapters/detect.js');
  const { getToolById } = await import('./adapters/registry.js');
  const { injectHandshake } = await import('./adapters/handshake.js');
  const { readFile, writeFile, access } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const { KNOWIE_CONFIG } = await import('./constants.js');

  const configPath = join(projectPath, KNOWIE_CONFIG);
  let config;
  try {
    config = JSON.parse(await readFile(configPath, 'utf-8'));
  } catch {
    return 'Error: .knowie.json not found. Run knowie_init first.';
  }

  const configLang = config.language || 'en';
  const report = [];

  // Update managed files (in the base's language, not the default)
  const templates = await installTemplates(projectPath, configLang);
  report.push(`✓ Updated ${templates.length} templates`);

  // Re-ensure orientation READMEs (managed files carrying the format
  // conventions) — refresh to latest, and heal a base that's missing them.
  const readmes = await installReadmes(projectPath, configLang, { overwrite: true });
  report.push(`✓ Refreshed ${readmes.created.length} subdir READMEs`);

  const skills = await installSkills(projectPath);
  report.push(`✓ Updated ${skills.length} skills`);

  // Re-detect and handshake
  const { detected } = await detectTools(projectPath);
  const existingTools = new Set(config.tools || []);
  const newTools = detected.filter(id => !existingTools.has(id));

  if (newTools.length > 0) {
    const names = newTools.map(id => getToolById(id)?.name).filter(Boolean);
    report.push(`New tools detected: ${names.join(', ')}`);
    for (const id of newTools) {
      existingTools.add(id);
    }
  }

  // Refresh all handshakes
  const writtenFiles = new Set();
  for (const id of existingTools) {
    const tool = getToolById(id);
    if (!tool) continue;
    for (const target of tool.targets) {
      if (writtenFiles.has(target.file)) continue;
      await injectHandshake(projectPath, target);
      writtenFiles.add(target.file);
    }
  }
  report.push(`✓ Refreshed ${writtenFiles.size} tool connection(s)`);

  // Update config
  config.version = VERSION;
  config.tools = [...existingTools];
  config.updatedAt = new Date().toISOString();
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n');

  report.push('\nUpdate complete.');
  return report.join('\n');
}

async function handleKnowieJudge(args) {
  const projectPath = args.project_path || process.cwd();
  const { readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const { KNOWLEDGE_DIR } = await import('./constants.js');

  // Read knowledge files
  const files = {};
  for (const name of ['principles.md', 'vision.md', 'experience.md']) {
    try {
      files[name] = await readFile(join(projectPath, KNOWLEDGE_DIR, name), 'utf-8');
    } catch {
      files[name] = null;
    }
  }

  const missing = Object.entries(files).filter(([, v]) => v === null).map(([k]) => k);
  if (missing.length > 0) {
    return `Cannot run judge — missing files: ${missing.join(', ')}\nRun knowie_init first.`;
  }

  // Return files content for AI to analyze
  const scope = args.scope || 'full';
  const lines = [
    `## Knowie Judge — Scope: ${scope}`,
    '',
    'Below are the current knowledge files. Please perform the cross-check analysis.',
    '',
    '### principles.md',
    '```markdown',
    files['principles.md'],
    '```',
    '',
    '### vision.md',
    '```markdown',
    files['vision.md'],
    '```',
    '',
    '### experience.md',
    '```markdown',
    files['experience.md'],
    '```',
    '',
    '### Instructions',
    '',
  ];

  if (scope === 'full') {
    lines.push('Perform a **full check** with all 11 sections:');
    lines.push('1. Internal Coherence (3): check each file for self-contradictions');
    lines.push('2. Cross-references (6 directional):');
    lines.push('   - Principles → Vision: can vision be derived from principles?');
    lines.push('   - Vision → Principles: does vision require unstated principles?');
    lines.push('   - Principles → Experience: do principles predict observed patterns?');
    lines.push('   - Experience → Principles: does experience challenge principles?');
    lines.push('   - Vision → Experience: does experience support the planned direction?');
    lines.push('   - Experience → Vision: are there lessons suggesting new opportunities?');
    lines.push('3. Overall (1): synthesize — where is the most pressure?');
    lines.push('4. Beyond Scope (1): content that doesn\'t belong');
    lines.push('5. Suggested Actions: numbered, prioritized');
  } else {
    lines.push(`Perform a **scoped check** for: "${scope}"`);
    lines.push('Show only the relevant sections from the full 11-section check.');
  }

  lines.push('');
  lines.push('Use 🟢 (one line) for healthy, 🟡 (expanded) for tensions, 🔴 (expanded) for conflicts.');
  lines.push('Always quote specific text from the files to support findings.');

  return lines.join('\n');
}

async function handleKnowieNext(args) {
  const projectPath = args.project_path || process.cwd();
  const { readFile, readdir } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const { KNOWLEDGE_DIR } = await import('./constants.js');

  // Read knowledge files
  const files = {};
  for (const name of ['principles.md', 'vision.md', 'experience.md']) {
    try {
      files[name] = await readFile(join(projectPath, KNOWLEDGE_DIR, name), 'utf-8');
    } catch {
      files[name] = null;
    }
  }

  const missing = Object.entries(files).filter(([, v]) => v === null).map(([k]) => k);
  if (missing.length > 0) {
    return `Cannot plan next step — missing files: ${missing.join(', ')}\nRun knowie_init first.`;
  }

  // Scan for spec tools
  let specTools = [];
  try {
    const skillsDir = join(projectPath, '.claude', 'skills');
    const skills = await readdir(skillsDir);
    specTools = skills.filter(s =>
      s.startsWith('speckit') || s.startsWith('openspec') || s.includes('spec')
    );
  } catch { /* no skills dir */ }

  const direction = args.direction || '';
  const lines = [
    `## Knowie Next${direction ? ` — Direction: ${direction}` : ''}`,
    '',
    'Below are the current knowledge files. Help the user plan their next step.',
    '',
    '### principles.md',
    '```markdown',
    files['principles.md'],
    '```',
    '',
    '### vision.md',
    '```markdown',
    files['vision.md'],
    '```',
    '',
    '### experience.md',
    '```markdown',
    files['experience.md'],
    '```',
    '',
    '### Instructions',
    '',
  ];

  if (direction) {
    lines.push(`The user wants to explore: "${direction}"`);
    lines.push('1. Locate this direction in the vision roadmap');
    lines.push('2. Check prerequisites');
    lines.push('3. Find relevant experience lessons');
  } else {
    lines.push('The user has no specific direction. Suggest the next logical step:');
    lines.push('1. Find the next incomplete milestone in the roadmap');
    lines.push('2. Consider experience lessons that affect priority');
  }

  lines.push('');
  lines.push('Converge on a feature brief: name, description, scope, grounding in principles, informed by experience, risks.');

  if (specTools.length > 0) {
    lines.push('');
    lines.push(`Spec tools detected in this project: ${specTools.join(', ')}`);
    lines.push('Suggest the user invoke the appropriate spec tool to flesh out the details.');
  } else {
    lines.push('');
    lines.push('No spec tools detected. Suggest: "You can now use your preferred specification tool to flesh out the details, or start implementing directly."');
  }

  return lines.join('\n');
}

// ── MCP Protocol Handler ───────────────────────────────────────────

function makeResponse(id, result) {
  return JSON.stringify({ jsonrpc: '2.0', id, result });
}

function makeError(id, code, message) {
  return JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } });
}

async function handleMessage(msg) {
  const { id, method, params } = msg;

  // Notifications (no id) — just acknowledge silently
  if (id === undefined) return null;

  switch (method) {
    case 'initialize':
      return makeResponse(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: 'knowie', version: VERSION },
      });

    case 'ping':
      return makeResponse(id, {});

    case 'tools/list':
      return makeResponse(id, { tools: TOOLS });

    case 'tools/call': {
      const toolName = params?.name;
      const args = params?.arguments || {};

      try {
        let result;
        switch (toolName) {
          case 'knowie_init':
            result = await handleKnowieInit(args);
            break;
          case 'knowie_update':
            result = await handleKnowieUpdate(args);
            break;
          case 'knowie_judge':
            result = await handleKnowieJudge(args);
            break;
          case 'knowie_next':
            result = await handleKnowieNext(args);
            break;
          default:
            return makeError(id, -32602, `Unknown tool: ${toolName}`);
        }
        return makeResponse(id, {
          content: [{ type: 'text', text: result }],
          isError: false,
        });
      } catch (err) {
        return makeResponse(id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        });
      }
    }

    default:
      return makeError(id, -32601, `Method not found: ${method}`);
  }
}

// ── Entry Point ────────────────────────────────────────────────────

export async function startMcpServer() {
  const rl = createInterface({
    input: process.stdin,
    terminal: false,
  });

  const pending = [];

  rl.on('line', (line) => {
    if (!line.trim()) return;

    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      const err = makeError(null, -32700, 'Parse error');
      process.stdout.write(err + '\n');
      return;
    }

    const task = handleMessage(msg).then((response) => {
      if (response) {
        process.stdout.write(response + '\n');
      }
    }).catch((err) => {
      process.stderr.write(`Error: ${err.message}\n`);
    });
    pending.push(task);
  });

  rl.on('close', async () => {
    await Promise.all(pending);
    process.exit(0);
  });

  process.stderr.write(`knowie MCP server v${VERSION} started\n`);
}
