/**
 * crs-init-upgrade.test.js
 *
 * Validates BUG-20260615-001-e7e5ed AC-2 / NEG-5: crs-init auto-migrates
 * .requirements/project/ when run inside a pre-v0.11.0 project.
 *
 * Runs bin/crs-init.js as a subprocess because the script executes its
 * top-level code on import.
 */

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CRS_INIT_JS = path.resolve(__dirname, '..', '..', 'bin', 'crs-init.js');

async function makeBaseDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'crs-init-upg-'));
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_e) {
    return false;
  }
}

function runCrsInit(cwd, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [CRS_INIT_JS], {
      cwd,
      env: { ...process.env, ...env },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

describe('crs-init upgrade-path project-sync (BUG-20260615-001)', () => {
  let baseDir;
  let fakeHome;
  let originalProjectSyncEnv;
  let originalHome;
  let originalUserProfile;

  beforeEach(async () => {
    baseDir = await makeBaseDir();
    fakeHome = await fs.mkdtemp(path.join(os.tmpdir(), 'crs-fake-home-'));
    // Pretend global setup has already happened so crs-init takes the
    // upgrade path instead of "first-time install".
    await fs.mkdir(path.join(fakeHome, '.claude', 'commands'), { recursive: true });
    await fs.writeFile(path.join(fakeHome, '.claude', 'commands', 'req.md'), '# stub\n', 'utf-8');

    originalProjectSyncEnv = process.env.CRS_PROJECT_SYNC;
    originalHome = process.env.HOME;
    originalUserProfile = process.env.USERPROFILE;
    delete process.env.CRS_PROJECT_SYNC;
  });

  afterEach(async () => {
    if (originalProjectSyncEnv === undefined) {
      delete process.env.CRS_PROJECT_SYNC;
    } else {
      process.env.CRS_PROJECT_SYNC = originalProjectSyncEnv;
    }
    process.env.HOME = originalHome;
    process.env.USERPROFILE = originalUserProfile;
    await fs.rm(baseDir, { recursive: true, force: true });
    await fs.rm(fakeHome, { recursive: true, force: true });
  });

  it('POS-2: detects legacy .requirements/ and auto-initializes project docs', async () => {
    // Simulate a pre-v0.11.0 project: .requirements/ exists but no project/meta.yaml.
    await fs.mkdir(path.join(baseDir, '.requirements', 'features'), { recursive: true });

    const result = await runCrsInit(baseDir, { HOME: fakeHome, USERPROFILE: fakeHome });

    expect(result.code, `stdout=${result.stdout}\nstderr=${result.stderr}`).to.equal(0);
    expect(result.stdout).to.contain('检测到旧版本项目痕迹');

    const projectMeta = path.join(baseDir, '.requirements', 'project', 'meta.yaml');
    expect(await pathExists(projectMeta)).to.equal(true);

    const projectDir = path.join(baseDir, '.requirements', 'project');
    const expectedDocs = ['project-structure.md', 'business-requirements.md', 'functional-requirements.md', 'functional-design.md', 'changelog.md'];
    for (const doc of expectedDocs) {
      const docPath = path.join(projectDir, doc);
      expect(await pathExists(docPath), `${doc} should exist`).to.equal(true);
    }
  });

  it('NEG-5: continues with exit code 0 and warning if initializeProjectDocs throws', async () => {
    await fs.mkdir(path.join(baseDir, '.requirements', 'features'), { recursive: true });
    // Block init by placing a regular file where project/ subdir would live,
    // forcing mkdir({recursive:true}) inside initializeProjectDocs to throw.
    await fs.writeFile(path.join(baseDir, '.requirements', 'project'), 'blocker', 'utf-8');

    const result = await runCrsInit(baseDir, { HOME: fakeHome, USERPROFILE: fakeHome });

    // crs-init must exit cleanly even when project init fails.
    expect(result.code, `stdout=${result.stdout}\nstderr=${result.stderr}`).to.equal(0);
    // Warnings are emitted via console.warn (stderr), so combine both streams.
    const combined = `${result.stdout}\n${result.stderr}`;
    expect(combined, `stdout=${result.stdout}\nstderr=${result.stderr}`).to.contain('project 目录初始化失败');
    expect(combined, `stdout=${result.stdout}\nstderr=${result.stderr}`).to.contain('crs-project-init');
  });
});
