import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { MARKER_START, MARKER_END, KNOWLEDGE_DIR } from '../constants.js';

const SNIPPET = `${MARKER_START}
## Project Knowledge

This project maintains structured knowledge in \`${KNOWLEDGE_DIR}/\`:

- **Principles** (\`${KNOWLEDGE_DIR}/principles.md\`): Core axioms and derived development principles — the project's non-negotiable rules.
- **Vision** (\`${KNOWLEDGE_DIR}/vision.md\`): Goals, current state, architecture decisions, and roadmap.
- **Experience** (\`${KNOWLEDGE_DIR}/experience.md\`): Distilled lessons from past development — patterns, pitfalls, and takeaways.

Read these files at the start of any task to understand the project's *why* and constraints.
Additional context may be found in \`${KNOWLEDGE_DIR}/concepts/\`, \`${KNOWLEDGE_DIR}/history/\`, and \`${KNOWLEDGE_DIR}/draft/\`.
${MARKER_END}`;

const MDC_SNIPPET = `---
description: Project knowledge context from Knowie
globs:
alwaysApply: true
---

${SNIPPET}`;

function buildSnippet(format) {
  if (format === 'mdc') return MDC_SNIPPET;
  return SNIPPET;
}

/**
 * Inject or update the Knowie reference in a tool's config file.
 * Creates the file (and parent dirs) if it doesn't exist.
 */
export async function injectHandshake(projectRoot, target) {
  const filePath = join(projectRoot, target.file);
  const snippet = buildSnippet(target.format);

  await mkdir(dirname(filePath), { recursive: true });

  let content;
  try {
    content = await readFile(filePath, 'utf-8');
  } catch {
    // File doesn't exist — create with just the snippet
    await writeFile(filePath, snippet + '\n');
    return { action: 'created', file: target.file };
  }

  // Check if markers already exist
  const startIdx = content.indexOf(MARKER_START);
  const endIdx = content.indexOf(MARKER_END);

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace between markers (inclusive)
    const before = content.slice(0, startIdx);
    const after = content.slice(endIdx + MARKER_END.length);
    await writeFile(filePath, before + snippet + after);
    return { action: 'updated', file: target.file };
  }

  // Append
  const separator = content.endsWith('\n') ? '\n' : '\n\n';
  await writeFile(filePath, content + separator + snippet + '\n');
  return { action: 'appended', file: target.file };
}

/**
 * Remove the Knowie reference from a file.
 */
export async function removeHandshake(projectRoot, target) {
  const filePath = join(projectRoot, target.file);
  let content;
  try {
    content = await readFile(filePath, 'utf-8');
  } catch {
    return { action: 'not_found', file: target.file };
  }

  const startIdx = content.indexOf(MARKER_START);
  const endIdx = content.indexOf(MARKER_END);

  if (startIdx === -1 || endIdx === -1) {
    return { action: 'no_markers', file: target.file };
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + MARKER_END.length);
  // Clean up extra blank lines
  const cleaned = (before + after).replace(/\n{3,}/g, '\n\n').trim();
  await writeFile(filePath, cleaned ? cleaned + '\n' : '');
  return { action: 'removed', file: target.file };
}
