#!/usr/bin/env node
/**
 * 版本号同步脚本
 *
 * 从 package.json 读取 version 字段，同步到所有 manifest 文件。
 * 确保跨平台 manifest 版本一致，避免版本 drift 问题。
 *
 * 同步目标：
 *   - .claude-plugin/plugin.json  (Claude Code)
 *   - .cursor-plugin/plugin.json  (Cursor)
 *   - .codex-plugin/plugin.json   (Codex 旧路径，保留兼容)
 *   - gemini-extension.json       (Gemini CLI)
 *
 * 注：.opencode/plugins/crs.js 动态读取 package.json，无需静态同步。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf-8'));
const version = packageJson.version;

const manifests = [
  { path: '.claude-plugin/plugin.json', key: 'version' },
  { path: '.cursor-plugin/plugin.json', key: 'version' },
  { path: '.codex-plugin/plugin.json', key: 'version' },
  { path: 'gemini-extension.json', key: 'version' },
];

let updated = 0;
let skipped = 0;
let missing = 0;

manifests.forEach(({ path, key }) => {
  const filePath = join(rootDir, path);

  if (!existsSync(filePath)) {
    console.warn(`! Missing: ${path}`);
    missing++;
    return;
  }

  const manifest = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (manifest[key] !== version) {
    const oldVersion = manifest[key];
    manifest[key] = version;
    writeFileSync(filePath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`✓ Updated ${path}: ${oldVersion} → ${version}`);
    updated++;
  } else {
    console.log(`- ${path} already at ${version}`);
    skipped++;
  }
});

console.log(
  `\nVersion ${version} synced: ${updated} updated, ${skipped} skipped, ${missing} missing.`
);

if (missing > 0) {
  console.warn('Warning: Some manifest files are missing.');
}
