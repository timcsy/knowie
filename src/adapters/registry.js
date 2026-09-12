import { BASE_SKILL_DIRS } from '../constants.js';

/**
 * Tool registry — defines how to detect and handshake with each AI/spec tool.
 *
 * Each entry:
 *   id          — unique key
 *   name        — human-readable label
 *   detect      — array of { type: 'file'|'dir', path } checks (OR logic)
 *   targets     — files to inject the Knowy reference into
 *   readsAgents — true if the tool also reads AGENTS.md
 *   skillsDir   — (optional) where this tool loads agentskills.io SKILL.md skills from.
 *                 Only needed for a tool that reads *neither* dir in BASE_SKILL_DIRS — those
 *                 two are always created, so this field only ever *adds* to the list.
 *                 Two kinds of skill land in these dirs, by two different hands:
 *                 package skills (knowie-*) are installed by the CLI — physical in
 *                 SKILLS_HOME, per-skill symlink everywhere else; learned domain skills
 *                 live in knowledge/skills/ (their single source) and are projected by the
 *                 *AI* when it consolidates one / during judge §5 — never by a CLI (the AI
 *                 is present; see experience "在場的 AI 自己做").
 *   category    — 'ai' | 'spec' | 'standard'
 */
export const TOOL_REGISTRY = [
  // ── Cross-tool standard ──────────────────────────────────────────
  {
    id: 'agents-md',
    name: 'AGENTS.md (Cross-tool standard)',
    detect: [{ type: 'file', path: 'AGENTS.md' }],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    skillsDir: '.agents/skills', // cross-tool SKILL.md location (Codex/Cursor/Gemini/Copilot/OpenCode…)
    category: 'standard',
    alwaysAvailable: true,
  },

  // ── AI coding tools ──────────────────────────────────────────────
  {
    id: 'claude-code',
    name: 'Claude Code',
    detect: [{ type: 'file', path: 'CLAUDE.md' }],
    targets: [{ file: 'CLAUDE.md', format: 'markdown' }],
    readsAgents: false,
    skillsDir: '.claude/skills',
    category: 'ai',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    detect: [{ type: 'dir', path: '.cursor' }],
    targets: [{ file: '.cursor/rules/knowie.mdc', format: 'mdc' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    detect: [
      { type: 'file', path: '.windsurfrules' },
      { type: 'dir', path: '.windsurf' },
    ],
    targets: [{ file: '.windsurf/rules/knowie.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    detect: [
      { type: 'file', path: '.github/copilot-instructions.md' },
      { type: 'dir', path: '.github/instructions' },
    ],
    targets: [{ file: '.github/copilot-instructions.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'codex',
    name: 'Codex CLI (OpenAI)',
    detect: [],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'gemini',
    name: 'Gemini CLI',
    detect: [{ type: 'file', path: 'GEMINI.md' }],
    targets: [{ file: 'GEMINI.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'kiro',
    name: 'Kiro',
    detect: [{ type: 'dir', path: '.kiro' }],
    targets: [{ file: '.kiro/steering/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'amazon-q',
    name: 'Amazon Q Developer',
    detect: [{ type: 'dir', path: '.amazonq' }],
    targets: [{ file: '.amazonq/rules/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'cline',
    name: 'Cline',
    detect: [
      { type: 'file', path: '.clinerules' },
      { type: 'dir', path: '.clinerules' },
    ],
    targets: [{ file: '.clinerules/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'roo-code',
    name: 'Roo Code',
    detect: [{ type: 'dir', path: '.roo' }],
    targets: [{ file: '.roo/rules/knowie.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'kilo-code',
    name: 'Kilo Code',
    detect: [{ type: 'dir', path: '.kilocode' }],
    targets: [{ file: '.kilocode/rules/knowie.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'aider',
    name: 'Aider',
    detect: [{ type: 'file', path: '.aider.conf.yml' }],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'continue',
    name: 'Continue.dev',
    detect: [{ type: 'dir', path: '.continue' }],
    targets: [{ file: '.continue/rules/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'augment',
    name: 'Augment Code',
    detect: [
      { type: 'dir', path: '.augment' },
      { type: 'file', path: '.augment-guidelines' },
    ],
    targets: [{ file: '.augment/rules/knowie.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'amp',
    name: 'Amp (Sourcegraph)',
    detect: [],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'devin',
    name: 'Devin',
    detect: [],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'warp',
    name: 'Warp',
    detect: [{ type: 'file', path: 'WARP.md' }],
    targets: [{ file: 'WARP.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'zed',
    name: 'Zed',
    detect: [{ type: 'file', path: '.rules' }],
    targets: [{ file: '.rules', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    detect: [
      { type: 'file', path: 'opencode.json' },
      { type: 'file', path: 'opencode.jsonc' },
    ],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'qodo',
    name: 'Qodo',
    detect: [],
    targets: [{ file: 'AGENTS.md', format: 'markdown' }],
    readsAgents: true,
    category: 'ai',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains AI Assistant',
    detect: [{ type: 'dir', path: '.aiassistant' }],
    targets: [{ file: '.aiassistant/rules/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    detect: [
      { type: 'dir', path: '.tabnine' },
      { type: 'file', path: '.tabnine' },
    ],
    targets: [{ file: '.tabnine/guidelines/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'replit',
    name: 'Replit Agent',
    detect: [{ type: 'file', path: 'replit.md' }],
    targets: [{ file: 'replit.md', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    detect: [{ type: 'dir', path: '.bolt' }],
    targets: [{ file: '.bolt/prompt', format: 'markdown' }],
    readsAgents: false,
    category: 'ai',
  },

  // ── Spec tools ───────────────────────────────────────────────────
  {
    id: 'speckit',
    name: 'Speckit',
    detect: [{ type: 'dir', path: '.specify' }],
    targets: [{ file: '.specify/memory/constitution.md', format: 'markdown' }],
    readsAgents: false,
    category: 'spec',
  },
  {
    id: 'openspec',
    name: 'OpenSpec',
    detect: [{ type: 'dir', path: 'openspec' }],
    targets: [{ file: 'openspec/project.md', format: 'markdown' }],
    readsAgents: false,
    category: 'spec',
  },
  {
    id: 'kiro-specs',
    name: 'Kiro Specs',
    detect: [{ type: 'dir', path: '.kiro/specs' }],
    targets: [{ file: '.kiro/steering/knowie.md', format: 'markdown' }],
    readsAgents: false,
    category: 'spec',
  },
];

/** Get tools that can be detected (have detect rules) */
export function getDetectableTools() {
  return TOOL_REGISTRY.filter(t => t.detect.length > 0);
}

/** Get all selectable tools (for the interactive menu) */
export function getSelectableTools() {
  return TOOL_REGISTRY.filter(t => t.category !== 'standard' || t.alwaysAvailable);
}

/** Find a tool by id */
export function getToolById(id) {
  return TOOL_REGISTRY.find(t => t.id === id);
}

/**
 * The skill-projection targets for a set of selected tools (deduped, stable order).
 * Always starts from BASE_SKILL_DIRS — the registered tools only ever *add*.
 *
 * Why this exists: projecting a learned skill is the *AI's* job (capture / judge §5),
 * but the AI can't read this registry — so it had no list to enumerate and only ever
 * projected into the one dir it knew (`.claude/skills`), silently skipping
 * `.agents/skills` even on bases that registered `agents-md`. The CLI writes the
 * resolved list into `knowledge/.knowie.json` → `skillDirs` so the skills have a
 * source to enumerate. Registry stays the single source of truth; the config just
 * carries a projection of it (see experience "重複的知識會獨立漂移").
 *
 * Why the floor: gating the dirs on detection made the dir list a bet on *today's*
 * tool, and the bet is wrong as soon as someone opens the project in another agent
 * — which people do constantly. Both dirs cost nothing; a missing one costs the
 * whole skill set. `SKILLS_HOME` stays first: it's where installSkills puts the
 * physical files, the rest get symlinks.
 */
export function getSkillDirs(toolIds = []) {
  const dirs = [...BASE_SKILL_DIRS];
  for (const id of toolIds) {
    const dir = getToolById(id)?.skillsDir;
    if (dir && !dirs.includes(dir)) dirs.push(dir);
  }
  return dirs;
}
