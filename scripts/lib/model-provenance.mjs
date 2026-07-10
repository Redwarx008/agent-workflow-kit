export function parseResolvedModel(stdout = '', stderr = '') {
  const candidates = [];
  function inspect(value) {
    if (!value || typeof value !== 'object') return;
    if (typeof value.model === 'string') candidates.push(value.model);
    if (value.modelUsage && typeof value.modelUsage === 'object') candidates.push(...Object.keys(value.modelUsage));
    for (const child of Object.values(value)) if (child && typeof child === 'object') inspect(child);
  }
  for (const raw of [stdout, ...String(stdout).split(/\r?\n/)]) {
    try { inspect(JSON.parse(raw)); } catch { /* non-JSON event/log */ }
  }
  for (const match of String(stderr).matchAll(/(?:^|\s)model=([^\s]+)/gm)) candidates.push(match[1]);
  return [...new Set(candidates.filter(Boolean))][0] ?? null;
}
