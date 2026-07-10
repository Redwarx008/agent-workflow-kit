const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.cjs'), 'utf8');
const frame = fs.readFileSync(path.join(root, 'frame-template.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'SOURCE.md'), 'utf8');

assert(server.includes("const COMPANION_NAME = 'Agent Workflow Design Companion'"));
assert(frame.includes('<title>Agent Workflow Design Companion</title>'));
assert(!server.includes('primeradiant.com'));
assert(!server.includes('SUPERPOWERS_TELEMETRY'));
assert(!server.includes('<img class="brand-logo"'));
assert(source.includes('d884ae04edebef577e82ff7c4e143debd0bbec99'));
assert(fs.existsSync(path.join(root, 'LICENSE.superpowers')));

console.log('PASS: local branding has no remote image or telemetry and preserves provenance');
