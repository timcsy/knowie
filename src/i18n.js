import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { KNOWY_CONFIG } from './constants.js';

/**
 * Detect the user's language from system environment.
 * Returns a BCP-47 language tag like 'en', 'zh-TW', 'ja', etc.
 */
export function detectLanguage() {
  // Try LANG, LC_ALL, LC_MESSAGES
  const raw = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || '';
  // e.g. "zh_TW.UTF-8" → "zh-TW", "en_US.UTF-8" → "en"
  const match = raw.match(/^([a-z]{2})(?:_([A-Z]{2}))?/);
  if (match) {
    const lang = match[1];
    const region = match[2];
    if (region) return `${lang}-${region}`;
    return lang;
  }

  // Fallback: try Intl
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale) return locale;
  } catch { /* ignore */ }

  return 'en';
}

/**
 * Resolve language: .knowy.json override > detected system language.
 * Normalizes to a supported language key.
 */
export async function resolveLanguage(projectRoot) {
  // Check .knowy.json override
  try {
    const config = JSON.parse(await readFile(join(projectRoot, KNOWY_CONFIG), 'utf-8'));
    if (config.language) return normalizeLanguage(config.language);
  } catch { /* no config yet */ }

  return normalizeLanguage(detectLanguage());
}

/**
 * Normalize a locale string to a supported language key.
 * Supported: 'en', 'zh-TW'
 * Add more as needed.
 */
export function normalizeLanguage(locale) {
  if (!locale) return 'en';
  const lower = locale.toLowerCase();
  if (lower.startsWith('zh')) return 'zh-TW';
  // Add more mappings here:
  // if (lower.startsWith('ja')) return 'ja';
  // if (lower.startsWith('ko')) return 'ko';
  return 'en';
}

// ── Message Catalog ────────────────────────────────────────────────

const messages = {
  en: {
    // CLI
    'cli.init.exists': '.knowledge/ already exists.',
    'cli.init.continue': 'Continue? (Knowledge files will not be overwritten)',
    'cli.init.aborted': 'Aborted.',
    'cli.init.created': (f) => `  ✓ Created ${f}`,
    'cli.init.skipped': (f) => `  · Skipped ${f} (already exists)`,
    'cli.init.templates': (n) => `  ✓ Installed ${n} templates to .knowledge/.templates/`,
    'cli.init.detected': (names) => `  Detected: ${names}`,
    'cli.init.selectTools': 'Select tools to connect:',
    'cli.init.selectHint': '  Enter numbers to toggle, then press Enter to confirm.',
    'cli.init.handshake.created': (file, tool) => `  ✓ Created ${file} (${tool})`,
    'cli.init.handshake.updated': (file, tool) => `  ✓ Updated ${file} (${tool})`,
    'cli.init.handshake.appended': (file, tool) => `  ✓ Added to ${file} (${tool})`,
    'cli.init.skills': (n) => `  ✓ Installed ${n} skills to .claude/skills/`,
    'cli.init.done': '✅ Done!',
    'cli.init.nextStep': 'Next step: run /knowy init in your AI tool to populate your knowledge files.',
    'cli.init.selectLanguage': 'Select language for templates:',
    'cli.init.langDetected': (lang) => `  Detected language: ${lang}`,

    'cli.update.title': 'update',
    'cli.update.noConfig': '.knowy.json not found. Run "knowy init" first.',
    'cli.update.badConfig': 'Failed to read .knowy.json. Run "knowy init" to re-initialize.',
    'cli.update.templates': (n) => `  ✓ Updated ${n} templates`,
    'cli.update.skills': (n) => `  ✓ Updated ${n} skills`,
    'cli.update.newTools': (names) => `  New tools detected: ${names}`,
    'cli.update.addTools': '  Add knowledge references to these tools?',
    'cli.update.refreshed': (n) => `  ✓ Refreshed ${n} tool connection(s)`,
    'cli.update.done': '✅ Update complete.',

    'cli.mcp.title': 'MCP setup',
    'cli.mcp.selectTools': 'Which tools should use the Knowy MCP server?',
    'cli.mcp.noSelection': 'No tools selected. Aborted.',
    'cli.mcp.alreadyConfigured': (name) => `  · ${name}: already configured`,
    'cli.mcp.added': (name) => `  ✓ ${name}: added Knowy MCP server`,
    'cli.mcp.done': '✅ MCP setup complete.',
    'cli.mcp.restart': '   Restart your AI tool to activate the Knowy MCP server.',

    'ui.toggle': 'Toggle (e.g., 1,3,5) or press Enter to confirm: ',

    'cli.help.tagline': 'Give your AI a structured project brain',
    'cli.help.usage': 'Usage',
    'cli.help.commands': 'Commands',
    'cli.help.options': 'Options',
    'cli.help.init': 'Scaffold .knowledge/ structure and connect AI tools',
    'cli.help.update': 'Update skills, templates, and tool connections',
    'cli.help.setupMcp': 'Configure MCP server for your AI tool',
    'cli.help.help': 'Show this help message',
    'cli.help.version': 'Show version number',
    'cli.unknownCommand': (cmd) => `Unknown command: ${cmd}`,
  },

  'zh-TW': {
    'cli.init.exists': '.knowledge/ 已存在。',
    'cli.init.continue': '繼續？（知識文件不會被覆蓋）',
    'cli.init.aborted': '已取消。',
    'cli.init.created': (f) => `  ✓ 已建立 ${f}`,
    'cli.init.skipped': (f) => `  · 已跳過 ${f}（已存在）`,
    'cli.init.templates': (n) => `  ✓ 已安裝 ${n} 個模板到 .knowledge/.templates/`,
    'cli.init.detected': (names) => `  偵測到：${names}`,
    'cli.init.selectTools': '選擇要連結的工具：',
    'cli.init.selectHint': '  輸入編號切換選擇，按 Enter 確認。',
    'cli.init.handshake.created': (file, tool) => `  ✓ 已建立 ${file}（${tool}）`,
    'cli.init.handshake.updated': (file, tool) => `  ✓ 已更新 ${file}（${tool}）`,
    'cli.init.handshake.appended': (file, tool) => `  ✓ 已加入 ${file}（${tool}）`,
    'cli.init.skills': (n) => `  ✓ 已安裝 ${n} 個 skills 到 .claude/skills/knowy/`,
    'cli.init.done': '✅ 完成！',
    'cli.init.nextStep': '下一步：在你的 AI 工具中執行 /knowy init 來填寫知識文件。',
    'cli.init.selectLanguage': '選擇模板語言：',
    'cli.init.langDetected': (lang) => `  偵測到語言：${lang}`,

    'cli.update.title': '更新',
    'cli.update.noConfig': '找不到 .knowy.json。請先執行 "knowy init"。',
    'cli.update.badConfig': '無法讀取 .knowy.json。請執行 "knowy init" 重新初始化。',
    'cli.update.templates': (n) => `  ✓ 已更新 ${n} 個模板`,
    'cli.update.skills': (n) => `  ✓ 已更新 ${n} 個 skills`,
    'cli.update.newTools': (names) => `  偵測到新工具：${names}`,
    'cli.update.addTools': '  要為這些工具加入知識引用嗎？',
    'cli.update.refreshed': (n) => `  ✓ 已刷新 ${n} 個工具連結`,
    'cli.update.done': '✅ 更新完成。',

    'cli.mcp.title': 'MCP 設定',
    'cli.mcp.selectTools': '哪些工具要使用 Knowy MCP server？',
    'cli.mcp.noSelection': '未選擇任何工具。已取消。',
    'cli.mcp.alreadyConfigured': (name) => `  · ${name}：已設定`,
    'cli.mcp.added': (name) => `  ✓ ${name}：已加入 Knowy MCP server`,
    'cli.mcp.done': '✅ MCP 設定完成。',
    'cli.mcp.restart': '   請重啟你的 AI 工具以啟用 Knowy MCP server。',

    'ui.toggle': '切換（例如 1,3,5）或按 Enter 確認：',

    'cli.help.tagline': '給你的 AI 一個結構化的專案大腦',
    'cli.help.usage': '用法',
    'cli.help.commands': '指令',
    'cli.help.options': '選項',
    'cli.help.init': '建立 .knowledge/ 結構並連結 AI 工具',
    'cli.help.update': '更新 skills、模板和工具連結',
    'cli.help.setupMcp': '為你的 AI 工具設定 MCP server',
    'cli.help.help': '顯示此說明',
    'cli.help.version': '顯示版本號',
    'cli.unknownCommand': (cmd) => `未知的指令：${cmd}`,
  },
};

/**
 * Get a message function/string for the given language and key.
 */
export function t(lang, key) {
  const catalog = messages[lang] || messages['en'];
  return catalog[key] || messages['en'][key] || key;
}
