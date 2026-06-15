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

/**
 * 验证 sync-version.js 同步逻辑的结果（不直接执行脚本）
 * 通过检查所有 manifest 的 version 字段一致性来验证同步机制有效性
 */
describe('Version Sync (跨平台 manifest 版本同步验证)', () => {
  const packageJson = readJson('package.json');
  const expectedVersion = packageJson.version;

  it('package.json 包含 version 字段', () => {
    expect(expectedVersion).to.match(/^\d+\.\d+\.\d+/);
  });

  const manifests = [
    { path: '.claude-plugin/plugin.json', platform: 'Claude Code' },
    { path: '.cursor-plugin/plugin.json', platform: 'Cursor' },
    { path: '.codex-plugin/plugin.json', platform: 'Codex (legacy)' },
    { path: 'gemini-extension.json', platform: 'Gemini CLI' },
  ];

  manifests.forEach(({ path, platform }) => {
    it(`${platform} ${path} 版本与 package.json 一致 (${expectedVersion})`, () => {
      const m = readJson(path);
      expect(m, `${path} must exist`).to.not.equal(null);
      expect(m.version, `${platform} version mismatch`).to.equal(expectedVersion);
    });
  });

  it('所有 4 个 manifest 版本完全一致', () => {
    const versions = manifests.map(({ path }) => readJson(path)?.version);
    const unique = [...new Set(versions)];
    expect(unique.length, `Expected 1 unique version, got ${JSON.stringify(versions)}`).to.equal(1);
    expect(unique[0]).to.equal(expectedVersion);
  });

  it('版本号符合 semver 格式', () => {
    expect(expectedVersion).to.match(/^\d+\.\d+\.\d+(?:-[\w.]+)?$/);
  });
});

/**
 * 验证 sync-version.js 脚本的清单列表与实际配置匹配
 * （防止脚本硬编码与实际 manifest 文件不同步）
 */
describe('sync-version.js 脚本完整性', () => {
  it('脚本文件存在', () => {
    const scriptPath = join(rootDir, 'scripts', 'sync-version.js');
    expect(existsSync(scriptPath), 'scripts/sync-version.js must exist').to.equal(true);
  });

  it('脚本中包含 4 个 manifest 目标', () => {
    const scriptPath = join(rootDir, 'scripts', 'sync-version.js');
    const content = readFileSync(scriptPath, 'utf-8');

    const expectedPaths = [
      '.claude-plugin/plugin.json',
      '.cursor-plugin/plugin.json',
      '.codex-plugin/plugin.json',
      'gemini-extension.json',
    ];

    expectedPaths.forEach((p) => {
      expect(content, `sync-version.js must reference ${p}`).to.include(p);
    });
  });

  it('package.json scripts 中注册了 sync-version 命令', () => {
    const pkg = readJson('package.json');
    expect(pkg.scripts).to.have.property('sync-version');
    expect(pkg.scripts['sync-version']).to.include('sync-version.js');
  });
});
