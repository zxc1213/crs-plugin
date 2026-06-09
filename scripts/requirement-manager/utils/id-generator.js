/**
 * ID 生成器 - 为需求生成唯一ID
 * 格式: PREFIX-YYYYMMDD-XXX-HHHHHH (HHHHHH 为时间戳十六进制后 6 位)
 */

import fs from 'fs/promises';
import path from 'path';

// 计数器缓存
const counters = {};

// 计数器文件路径
const COUNTERS_FILE = '.requirements/counters.json';

/**
 * 加载计数器
 */
async function loadCounters() {
  try {
    const content = await fs.readFile(COUNTERS_FILE, 'utf-8');
    Object.assign(counters, JSON.parse(content));
  } catch (error) {
    // 文件不存在时初始化
    counters.feature = {};
    counters.bug = {};
    counters.question = {};
    counters.adjustment = {};
    counters.refactor = {};
    counters['tech-debt'] = {};
  }
}

/**
 * 保存计数器
 */
async function saveCounters() {
  const dir = path.dirname(COUNTERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(COUNTERS_FILE, JSON.stringify(counters, null, 2));
}

/**
 * 获取今日日期字符串 YYYYMMDD
 */
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 生成基于时间戳的 hash 后缀（十六进制后 6 位）
 * @returns {string} 6 位十六进制字符串
 */
export function generateHash() {
  return Date.now().toString(16).slice(-6).padStart(6, '0');
}

/**
 * 生成需求ID
 * @param {string} type - 需求类型 (feature/bug/tech-debt)
 * @returns {Promise<string>}
 */
export async function generate(type) {
  // 确保计数器已加载
  if (Object.keys(counters).length === 0) {
    await loadCounters();
  }

  if (!Object.prototype.hasOwnProperty.call(counters, type)) {
    throw new Error(`Unknown requirement type: ${type}`);
  }

  const today = getTodayString();

  // 初始化今日计数器
  if (!counters[type][today]) {
    counters[type][today] = 0;
  }

  // 递增计数器
  counters[type][today]++;
  const number = counters[type][today];

  // 保存计数器
  await saveCounters();

  // 生成前缀
  const prefixMap = {
    feature: 'FEAT',
    bug: 'BUG',
    question: 'QUES',
    adjustment: 'ADJU',
    refactor: 'REF',
    'tech-debt': 'DEBT',
  };
  const prefix = prefixMap[type];

  // 格式化为 3 位数字
  const formattedNumber = String(number).padStart(3, '0');

  // 生成 hash 后缀保证并发唯一性
  const hash = generateHash();

  return `${prefix}-${today}-${formattedNumber}-${hash}`;
}

/**
 * 解析需求ID
 * @param {string} id - 需求ID
 * @returns {object|null}
 */
export function parse(id) {
  // 支持三种格式
  // hash 格式: PREFIX-YYYYMMDD-XXX-HHHHHH
  // 旧日期格式: PREFIX-YYYYMMDD-XXX
  // 旧格式: PREFIX-NNNN

  const prefixToType = {
    FEAT: 'feature',
    BUG: 'bug',
    QUES: 'question',
    ADJU: 'adjustment',
    REF: 'refactor',
    DEBT: 'tech-debt',
  };

  // 优先匹配 hash 格式
  let match = id.match(/^([A-Z]+)-(\d{8})-(\d{3})-([0-9a-f]{6})$/);
  if (match) {
    const [, prefix, dateStr, numberStr, hash] = match;
    const type = prefixToType[prefix];
    if (!type) return null;
    return {
      type,
      number: parseInt(numberStr, 10),
      prefix,
      date: dateStr,
      hash,
      format: 'hash',
    };
  }

  // 旧日期格式: PREFIX-YYYYMMDD-XXX
  match = id.match(/^([A-Z]+)-(\d{8})-(\d{3})$/);
  if (match) {
    const [, prefix, dateStr, numberStr] = match;
    const type = prefixToType[prefix];
    if (!type) return null;
    return {
      type,
      number: parseInt(numberStr, 10),
      prefix,
      date: dateStr,
      format: 'new',
    };
  }

  // 旧格式: PREFIX-NNNN
  match = id.match(/^([A-Z]+)-(\d{4})$/);
  if (match) {
    const [, prefix, numberStr] = match;
    const type = prefixToType[prefix];
    if (!type) return null;
    return {
      type,
      number: parseInt(numberStr, 10),
      prefix,
      format: 'old',
    };
  }

  return null;
}

/**
 * 重置计数器 (主要用于测试)
 * @param {string} type - 需求类型
 * @param {string} date - 可选，重置特定日期的计数器
 */
export async function reset(type, date) {
  // 确保计数器已加载
  if (Object.keys(counters).length === 0) {
    await loadCounters();
  }

  if (type) {
    if (Object.prototype.hasOwnProperty.call(counters, type)) {
      if (date) {
        counters[type][date] = 0;
      } else {
        counters[type] = {};
      }
      await saveCounters();
    }
  } else {
    counters.feature = {};
    counters.bug = {};
    counters.question = {};
    counters.adjustment = {};
    counters.refactor = {};
    counters['tech-debt'] = {};
    await saveCounters();
  }
}

export default {
  generate,
  generateHash,
  parse,
  reset,
};
