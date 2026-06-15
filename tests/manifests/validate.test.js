import { describe, it } from 'mocha';
import { expect } from 'chai';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

function readJson(rel) {
  const abs = join(rootDir, rel);
  if (!existsSync(abs)) return null;
  return JSON.parse(readFileSync(abs, 'utf-8'));
}

describe('Manifest Validation (跨平台 manifest 格式校验)', () => {
  describe('Claude Code manifest (.claude-plugin/plugin.json)', () => {
    it('文件存在且为合法 JSON', () => {
      const m = readJson('.claude-plugin/plugin.json');
      expect(m, '.claude-plugin/plugin.json must exist').to.not.equal(null);
    });

    it('包含 name/version/description 字段', () => {
      const m = readJson('.claude-plugin/plugin.json');
      expect(m.name).to.be.a('string').and.to.not.be.empty;
      expect(m.version).to.match(/^\d+\.\d+\.\d+/);
      expect(m.description).to.be.a('string').and.to.not.be.empty;
    });

    it('包含 keywords 数组（v0.13.0+ 要求）', () => {
      const m = readJson('.claude-plugin/plugin.json');
      expect(m.keywords).to.be.an('array');
      expect(m.keywords.length).to.be.greaterThan(0);
    });

    it('不再包含 skills/commands 字段（依赖约定发现）', () => {
      const m = readJson('.claude-plugin/plugin.json');
      expect(m).to.not.have.property('skills');
      expect(m).to.not.have.property('commands');
    });
  });

  describe('Cursor manifest (.cursor-plugin/plugin.json)', () => {
    it('文件存在且为合法 JSON', () => {
      const m = readJson('.cursor-plugin/plugin.json');
      expect(m, '.cursor-plugin/plugin.json must exist').to.not.equal(null);
    });

    it('包含必要字段 name/version', () => {
      const m = readJson('.cursor-plugin/plugin.json');
      expect(m.name).to.be.a('string').and.to.not.be.empty;
      expect(m.version).to.match(/^\d+\.\d+\.\d+/);
    });

    it('包含 skills/commands/hooks 路径引用', () => {
      const m = readJson('.cursor-plugin/plugin.json');
      expect(m.skills).to.equal('./skills/');
      expect(m.commands).to.equal('./commands/');
      expect(m.hooks).to.equal('./hooks/hooks-cursor.json');
    });
  });

  describe('Gemini CLI manifest (gemini-extension.json)', () => {
    it('文件存在且为合法 JSON', () => {
      const m = readJson('gemini-extension.json');
      expect(m, 'gemini-extension.json must exist').to.not.equal(null);
    });

    it('包含 contextFileName 指向 GEMINI.md', () => {
      const m = readJson('gemini-extension.json');
      expect(m.contextFileName).to.equal('GEMINI.md');
    });

    it('包含 name/version 字段', () => {
      const m = readJson('gemini-extension.json');
      expect(m.name).to.be.a('string').and.to.not.be.empty;
      expect(m.version).to.match(/^\d+\.\d+\.\d+/);
    });

    it('GEMINI.md 入口文件存在', () => {
      const geminiMd = join(rootDir, 'GEMINI.md');
      expect(existsSync(geminiMd), 'GEMINI.md must exist').to.equal(true);
    });
  });

  describe('Codex manifests', () => {
    it('.codex-plugin/plugin.json（旧路径，向后兼容）存在', () => {
      const m = readJson('.codex-plugin/plugin.json');
      expect(m, '.codex-plugin/plugin.json must exist').to.not.equal(null);
      expect(m.version).to.match(/^\d+\.\d+\.\d+/);
    });

    it('.codex/INSTALL.md（新路径）存在', () => {
      const installMd = join(rootDir, '.codex', 'INSTALL.md');
      expect(existsSync(installMd), '.codex/INSTALL.md must exist').to.equal(true);
    });

    it('.codex/context.md 存在', () => {
      const contextMd = join(rootDir, '.codex', 'context.md');
      expect(existsSync(contextMd), '.codex/context.md must exist').to.equal(true);
    });
  });

  describe('OpenCode manifest', () => {
    it('.opencode/INSTALL.md 存在', () => {
      const installMd = join(rootDir, '.opencode', 'INSTALL.md');
      expect(existsSync(installMd), '.opencode/INSTALL.md must exist').to.equal(true);
    });

    it('.opencode/plugins/crs.js（ESM 入口）存在', () => {
      const entry = join(rootDir, '.opencode', 'plugins', 'crs.js');
      expect(existsSync(entry), '.opencode/plugins/crs.js must exist').to.equal(true);
    });
  });

  describe('Cursor hooks 配置', () => {
    it('hooks/hooks-cursor.json 存在且为合法 JSON', () => {
      const m = readJson('hooks/hooks-cursor.json');
      expect(m, 'hooks/hooks-cursor.json must exist').to.not.equal(null);
      expect(m.version).to.equal(1);
      expect(m.hooks).to.be.an('object');
    });

    it('hooks/run-hook.cjs 存在', () => {
      const runner = join(rootDir, 'hooks', 'run-hook.cjs');
      expect(existsSync(runner), 'hooks/run-hook.cjs must exist').to.equal(true);
    });
  });
});
