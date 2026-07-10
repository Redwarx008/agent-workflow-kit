import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function codexStandaloneBins() {
  if (process.platform !== 'win32') return [];
  const releases = path.join(os.homedir(), '.codex', 'packages', 'standalone', 'releases');
  try {
    return fs.readdirSync(releases, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => path.join(releases, entry.name, 'bin', 'codex.exe'))
      .filter(candidate => fs.existsSync(candidate))
      .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }));
  } catch {
    return [];
  }
}

const RUNNERS = {
  codex: {
    env: 'AGENT_WORKFLOW_CODEX_CLI',
    executable: process.platform === 'win32' ? 'codex.exe' : 'codex',
    defaults: process.platform === 'win32'
      ? [...codexStandaloneBins(), path.join(process.env.LOCALAPPDATA ?? '', 'Programs', 'OpenAI', 'Codex', 'bin', 'codex.exe')]
      : [path.join(os.homedir(), '.local', 'bin', 'codex')],
  },
  claude: {
    env: 'AGENT_WORKFLOW_CLAUDE_CLI',
    executable: process.platform === 'win32' ? 'claude.exe' : 'claude',
    defaults: process.platform === 'win32'
      ? [
          path.join(os.homedir(), '.local', 'bin', 'claude.exe'),
          path.join(process.env.APPDATA ?? '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe'),
        ]
      : [path.join(os.homedir(), '.local', 'bin', 'claude')],
  },
};

function pathCandidates(executable, env = process.env) {
  const pathValue = env.PATH ?? env.Path ?? '';
  const extensions = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', '.com'] : [''];
  const basename = path.extname(executable) ? executable.slice(0, -path.extname(executable).length) : executable;
  const names = process.platform === 'win32'
    ? [...new Set([executable, ...extensions.filter(Boolean).map(ext => `${basename}${ext}`)])]
    : [executable];
  return pathValue.split(path.delimiter).filter(Boolean).flatMap(directory => names.map(name => path.join(directory, name)));
}

export function buildCliCandidates(runner, options = {}) {
  const config = RUNNERS[runner];
  if (!config) throw new Error(`Unknown runner: ${runner}`);
  const env = options.env ?? process.env;
  const values = [
    options.explicit,
    env[config.env],
    ...(options.officialDefaults ?? config.defaults),
    ...(options.pathCandidates ?? pathCandidates(config.executable, env)),
  ].filter(Boolean).map(value => path.resolve(String(value)));
  const seen = new Set();
  return values.filter(value => {
    const key = process.platform === 'win32' ? value.toLowerCase() : value;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function discoverCli(runner, options = {}) {
  const exists = options.exists ?? (candidate => fs.existsSync(candidate));
  const probe = options.probe ?? ((candidate, timeoutMs) => spawnSync(candidate, ['--version'], {
    encoding: 'utf8', timeout: timeoutMs, windowsHide: true,
    shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(candidate),
  }));
  const timeoutMs = options.timeoutMs ?? 5000;
  const diagnostics = [];
  for (const candidate of buildCliCandidates(runner, options)) {
    if (!exists(candidate)) {
      diagnostics.push({ path: candidate, status: 'missing' });
      continue;
    }
    if (/\\WindowsApps\\/i.test(candidate) && /\\OpenAI\.Codex_/i.test(candidate)) {
      diagnostics.push({ path: candidate, status: 'windowsapps-internal-resource' });
      continue;
    }
    const result = probe(candidate, timeoutMs);
    if (!result.error && result.status === 0) {
      return {
        available: true,
        runner,
        path: candidate,
        version: String(result.stdout || result.stderr || '').trim(),
        diagnostics,
      };
    }
    diagnostics.push({
      path: candidate,
      status: result.error?.code === 'ETIMEDOUT' ? 'timeout' : 'unusable',
      detail: result.error?.message ?? String(result.stderr ?? '').trim() ?? `exit ${result.status}`,
    });
  }
  return { available: false, runner, diagnostics };
}

export function discoverCodexResources(cliVersion, options = {}) {
  if (process.platform !== 'win32') return null;
  const version = /(?:codex-cli\s+)?(\d+\.\d+\.\d+)/.exec(cliVersion ?? '')?.[1];
  const env = options.env ?? process.env;
  const candidates = [
    options.explicit,
    env.AGENT_WORKFLOW_CODEX_RESOURCES,
    version && path.join(os.homedir(), '.codex', 'packages', 'standalone', 'releases', `${version}-x86_64-pc-windows-msvc`, 'codex-resources'),
  ].filter(Boolean).map(value => path.resolve(value));
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'codex-windows-sandbox-setup.exe')) && fs.existsSync(path.join(candidate, 'codex-command-runner.exe'))) return candidate;
  }
  return null;
}
