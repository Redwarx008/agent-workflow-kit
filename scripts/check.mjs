#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = ['design', 'act', 'review'];

function json(relative) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'));
}

function frontmatterName(skill) {
  const text = fs.readFileSync(path.join(ROOT, '.agents', 'skills', skill, 'SKILL.md'), 'utf8');
  return /^---\s*\r?\n[\s\S]*?^name:\s*([^\r\n]+)$/m.exec(text)?.[1]?.trim();
}

function checkReferences(skill, failures) {
  const root = path.join(ROOT, '.agents', 'skills', skill);
  const text = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target) || target.startsWith('#')) continue;
    if (!fs.existsSync(path.resolve(root, target))) failures.push(`missing reference: ${skill}/${target}`);
  }
}

export function inspectRepository() {
  const failures = [];
  const codex = json('.codex-plugin/plugin.json');
  const claude = json('.claude-plugin/plugin.json');
  const codexMarket = json('.agents/plugins/marketplace.json');
  const claudeMarket = json('.claude-plugin/marketplace.json');
  for (const field of ['name', 'version', 'description', 'skills']) {
    if (codex[field] !== claude[field]) failures.push(`manifest mismatch: ${field}`);
  }
  if (codex.name !== 'agent-workflow-kit') failures.push('unexpected plugin name');
  if (codex.skills !== './.agents/skills/') failures.push('skills must use the canonical .agents/skills path');
  if (codexMarket.name !== codex.name || codexMarket.plugins?.[0]?.name !== codex.name) failures.push('Codex marketplace name mismatch');
  if (claudeMarket.name !== codex.name || claudeMarket.plugins?.[0]?.name !== codex.name) failures.push('Claude marketplace name mismatch');
  if (claudeMarket.version !== codex.version || claudeMarket.plugins?.[0]?.version !== codex.version) failures.push('Claude marketplace version mismatch');

  const skillsRoot = path.join(ROOT, '.agents', 'skills');
  const inventory = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.') && fs.existsSync(path.join(skillsRoot, entry.name, 'SKILL.md')))
    .map(entry => entry.name).sort();
  if (JSON.stringify(inventory) !== JSON.stringify(SKILLS.slice().sort())) failures.push(`unexpected skill inventory: ${inventory.join(', ')}`);
  for (const skill of SKILLS) {
    if (frontmatterName(skill) !== skill) failures.push(`skill frontmatter mismatch: ${skill}`);
    checkReferences(skill, failures);
  }
  if (fs.existsSync(path.join(ROOT, '.claude', 'skills'))) failures.push('legacy .claude/skills exists');

  const source = SKILLS.map(skill => fs.readFileSync(path.join(skillsRoot, skill, 'SKILL.md'), 'utf8')).join('\n');
  if (/\$workflow-(?:design|plan|act|review)/.test(source)) failures.push('legacy workflow-* invocation remains');

  return { ok: failures.length === 0, failures, plugin: { name: codex.name, version: codex.version }, inventory };
}

function parse(argv) {
  let jsonOutput = false;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--json') jsonOutput = true;
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return { jsonOutput };
}

function main() {
try {
  const args = parse(process.argv.slice(2));
  const result = inspectRepository();
  if (args.jsonOutput) console.log(JSON.stringify(result, null, 2));
  else {
    console.log(`${result.ok ? 'PASS' : 'FAIL'} agent-workflow-kit ${result.plugin.version}`);
    console.log(`skills: ${result.inventory.join(', ')}`);
    for (const failure of result.failures) console.error(`- ${failure}`);
  }
  if (!result.ok) process.exitCode = 1;
} catch (error) {
  console.error(error.stack ?? error.message);
  process.exitCode = 2;
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
