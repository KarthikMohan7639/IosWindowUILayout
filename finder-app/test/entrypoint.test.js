const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('Backend entry point exists', () => {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const mainFile = packageJson.main || 'index.js';
  const filePath = path.resolve(__dirname, '..', mainFile);

  assert.strictEqual(
    fs.existsSync(filePath),
    true,
    `Entry point file "${mainFile}" (resolved to ${filePath}) does not exist.`
  );
});
