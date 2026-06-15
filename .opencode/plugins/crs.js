#!/usr/bin/env node
/**
 * CRS Plugin - OpenCode 入口
 *
 * 自动扫描 skills/ 和 commands/ 目录，导出 plugin 元数据。
 * 参考 superpowers v5.0.7 的 .opencode/plugins/superpowers.js 实现。
 */

import { readdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = resolve(__dirname, '../../');

function readPackageJson() {
  try {
    const pkgPath = join(pluginRoot, 'package.json');
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return {};
  }
}

function listSkillDirs() {
  const skillsDir = join(pluginRoot, 'skills');
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(skillsDir, name, 'SKILL.md')));
}

function listCommands() {
  const commandsDir = join(pluginRoot, 'commands');
  if (!existsSync(commandsDir)) return [];
  return readdirSync(commandsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

const pkg = readPackageJson();

export default {
  name: 'crs',
  version: pkg.version || '0.0.0',
  description: pkg.description || 'CRS - 智能需求管理系统',
  author: pkg.author,
  license: pkg.license || 'MIT',
  homepage: pkg.homepage,
  repository: pkg.repository,
  skills: listSkillDirs(),
  commands: listCommands(),
};
