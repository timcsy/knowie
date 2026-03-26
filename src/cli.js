import { VERSION } from './constants.js';
import { resolveLanguage, detectLanguage, normalizeLanguage, t } from './i18n.js';

function buildHelp(lang) {
  return `
knowie v${VERSION} — ${t(lang, 'cli.help.tagline')}

${t(lang, 'cli.help.usage')}:
  knowie <command> [options]

${t(lang, 'cli.help.commands')}:
  init        ${t(lang, 'cli.help.init')}
  update      ${t(lang, 'cli.help.update')}
  setup-mcp   ${t(lang, 'cli.help.setupMcp')}

${t(lang, 'cli.help.options')}:
  --yes, -y        Non-interactive mode (auto-detect everything)
  --help, -h       ${t(lang, 'cli.help.help')}
  --version, -v    ${t(lang, 'cli.help.version')}
`.trim();
}

export async function run(args) {
  const flags = new Set(args.filter(a => a.startsWith('-')));
  const cmds = args.filter(a => !a.startsWith('-'));
  const cmd = cmds[0];
  const yes = flags.has('--yes') || flags.has('-y') || !process.stdin.isTTY;

  const lang = await resolveLanguage(process.cwd()).catch(() => normalizeLanguage(detectLanguage()));

  if (!cmd || flags.has('--help') || flags.has('-h')) {
    console.log(buildHelp(lang));
    return;
  }

  if (flags.has('--version') || flags.has('-v')) {
    console.log(VERSION);
    return;
  }

  if (cmd === 'init') {
    const { init } = await import('./commands/init.js');
    await init(process.cwd(), { yes });
    return;
  }

  if (cmd === 'update') {
    const { update } = await import('./commands/update.js');
    await update(process.cwd(), { yes });
    return;
  }

  if (cmd === 'setup-mcp') {
    const { setupMcp } = await import('./commands/setup-mcp.js');
    await setupMcp(process.cwd(), { yes });
    return;
  }

  const unknownMsg = t(lang, 'cli.unknownCommand');
  console.error(typeof unknownMsg === 'function' ? unknownMsg(cmd) : `Unknown command: ${cmd}`);
  console.log(buildHelp(lang));
  process.exitCode = 1;
}
