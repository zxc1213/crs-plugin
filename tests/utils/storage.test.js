import { describe, it } from 'mocha';
import { expect } from 'chai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import {
  init,
  exists,
  readMeta,
  writeMeta,
  cleanup,
} from '../../scripts/requirement-manager/utils/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_BASE_DIR = path.join(__dirname, '../temp-test-storage');

describe('Storage Utility', () => {
  beforeEach(async () => {
    await cleanup(TEST_BASE_DIR);
  });

  afterEach(async () => {
    await cleanup(TEST_BASE_DIR);
  });

  describe('init(baseDir)', () => {
    it('should create directory structure', async () => {
      await init(TEST_BASE_DIR);
      const dirExists = await exists(TEST_BASE_DIR);
      expect(dirExists).to.equal(true);
    });

    it('should create all schema type directories', async () => {
      await init(TEST_BASE_DIR);
      for (const dir of ['features', 'bugs', 'questions', 'adjustments', 'refactors', 'tech-debt']) {
        const existsAfter = await exists(path.join(TEST_BASE_DIR, '.requirements', dir));
        expect(existsAfter, `.${path.sep}.requirements/${dir}`).to.equal(true);
      }
    });
  });

  describe('writeMeta(baseDir, reqPath, meta) / readMeta(baseDir, reqPath)', () => {
    it('should round-trip metadata', async () => {
      await init(TEST_BASE_DIR);
      const reqPath = path.join(TEST_BASE_DIR, '.requirements', 'features', 'FEA-001');
      await fs.mkdir(reqPath, { recursive: true });
      await writeMeta(TEST_BASE_DIR, reqPath, { id: 'FEA-001', type: 'feature', status: 'planning' });
      const meta = await readMeta(TEST_BASE_DIR, reqPath);
      expect(meta).to.be.ok;
      expect(meta.id).to.equal('FEA-001');
      expect(meta.type).to.equal('feature');
      expect(meta.status).to.equal('planning');
    });

    it('readMeta returns null for missing meta.yaml', async () => {
      await init(TEST_BASE_DIR);
      const reqPath = path.join(TEST_BASE_DIR, '.requirements', 'features', 'FEA-404');
      await fs.mkdir(reqPath, { recursive: true });
      const meta = await readMeta(TEST_BASE_DIR, reqPath);
      expect(meta).to.equal(null);
    });
  });

  describe('cleanup(testDir)', () => {
    it('should remove test directory', async () => {
      await init(TEST_BASE_DIR);
      const existsBefore = await exists(TEST_BASE_DIR);
      expect(existsBefore).to.equal(true);
      await cleanup(TEST_BASE_DIR);
      const existsAfter = await exists(TEST_BASE_DIR);
      expect(existsAfter).to.equal(false);
    });
  });
});
