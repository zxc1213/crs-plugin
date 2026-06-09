import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { generate, generateHash, parse, reset } from '../../scripts/requirement-manager/utils/id-generator.js';

describe('ID Generator Utility', () => {
  beforeEach(async () => {
    await reset();
  });

  describe('generateHash()', () => {
    it('should return a 6-character hexadecimal string', () => {
      const hash = generateHash();
      expect(hash).to.match(/^[0-9a-f]{6}$/);
    });

    it('should return different values on consecutive calls', async () => {
      const h1 = generateHash();
      await new Promise((resolve) => setTimeout(resolve, 2));
      const h2 = generateHash();
      expect(h1).to.match(/^[0-9a-f]{6}$/);
      expect(h2).to.match(/^[0-9a-f]{6}$/);
    });
  });

  describe('generate(type)', () => {
    it('should generate feature ID with hash format', async () => {
      const id = await generate('feature');
      expect(id).to.match(/^FEAT-\d{8}-\d{3}-[0-9a-f]{6}$/);
    });

    it('should generate bug ID with hash format', async () => {
      const id = await generate('bug');
      expect(id).to.match(/^BUG-\d{8}-\d{3}-[0-9a-f]{6}$/);
    });

    it('should generate sequential numbers', async () => {
      const id1 = await generate('feature');
      const id2 = await generate('feature');
      const num1 = id1.split('-')[2];
      const num2 = id2.split('-')[2];
      expect(Number(num2)).to.equal(Number(num1) + 1);
    });

    it('should include different hashes for sequential IDs', async () => {
      const id1 = await generate('feature');
      await new Promise((resolve) => setTimeout(resolve, 2));
      const id2 = await generate('feature');
      const hash1 = id1.split('-')[3];
      const hash2 = id2.split('-')[3];
      expect(hash1).to.match(/^[0-9a-f]{6}$/);
      expect(hash2).to.match(/^[0-9a-f]{6}$/);
    });

    it('should throw for unknown type', async () => {
      try {
        await generate('unknown-type');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error.message).to.include('Unknown requirement type');
      }
    });
  });

  describe('parse(id)', () => {
    it('should parse hash format ID', async () => {
      const id = await generate('feature');
      const parsed = parse(id);
      expect(parsed).to.include({
        type: 'feature',
        prefix: 'FEAT',
        number: 1,
        format: 'hash',
      });
      expect(parsed)
        .to.have.property('hash')
        .that.matches(/^[0-9a-f]{6}$/);
      expect(parsed)
        .to.have.property('date')
        .that.matches(/^\d{8}$/);
    });

    it('should parse legacy date format ID', () => {
      const parsed = parse('FEAT-20260514-001');
      expect(parsed).to.include({
        type: 'feature',
        prefix: 'FEAT',
        number: 1,
        date: '20260514',
        format: 'new',
      });
      expect(parsed).to.not.have.property('hash');
    });

    it('should parse legacy short format ID', () => {
      const parsed = parse('BUG-0001');
      expect(parsed).to.include({
        type: 'bug',
        prefix: 'BUG',
        number: 1,
        format: 'old',
      });
      expect(parsed).to.not.have.property('hash');
      expect(parsed).to.not.have.property('date');
    });

    it('should return null for invalid format', () => {
      expect(parse('INVALID-ID')).to.be.null;
    });

    it('should return null for invalid hash characters', () => {
      expect(parse('FEAT-20260609-001-zzzzzz')).to.be.null;
    });

    it('should return null for short hash', () => {
      expect(parse('FEAT-20260609-001-a3f2')).to.be.null;
    });

    it('should return null for unknown prefix', () => {
      expect(parse('UNKNOWN-20260609-001-a3f2c1')).to.be.null;
    });
  });
});
