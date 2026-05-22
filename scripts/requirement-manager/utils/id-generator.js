/**
 * ID 生成器 - 为需求生成唯一ID
 */

// 计数器
const counters = {
  feature: 0,
  bug: 0,
  question: 0,
  adjustment: 0,
  refactor: 0,
  'tech-debt': 0,
};

/**
 * 生成需求ID
 * @param {string} type - 需求类型 (feature/bug/tech-debt)
 * @returns {string}
 */
export function generate(type) {
  if (!Object.prototype.hasOwnProperty.call(counters, type)) {
    throw new Error(`Unknown requirement type: ${type}`);
  }

  counters[type]++;
  const number = counters[type];

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

  // 格式化为 4 位数字
  const formattedNumber = String(number).padStart(4, '0');

  return `${prefix}-${formattedNumber}`;
}

/**
 * 解析需求ID
 * @param {string} id - 需求ID
 * @returns {object|null}
 */
export function parse(id) {
  // 验证格式: PREFIX-NNNN
  const match = id.match(/^([A-Z]+)-(\d{4})$/);

  if (!match) {
    return null;
  }

  const [, prefix, numberStr] = match;
  const number = parseInt(numberStr, 10);

  // 映射前缀到类型
  const prefixToType = {
    FEAT: 'feature',
    BUG: 'bug',
    QUES: 'question',
    ADJU: 'adjustment',
    REF: 'refactor',
    DEBT: 'tech-debt',
  };

  const type = prefixToType[prefix];

  if (!type) {
    return null;
  }

  return {
    type,
    number,
    prefix,
  };
}

/**
 * 重置计数器 (主要用于测试)
 * @param {string} type - 需求类型
 */
export function reset(type) {
  if (type) {
    if (Object.prototype.hasOwnProperty.call(counters, type)) {
      counters[type] = 0;
    }
  } else {
    counters.feature = 0;
    counters.bug = 0;
    counters.question = 0;
    counters.adjustment = 0;
    counters.refactor = 0;
    counters['tech-debt'] = 0;
  }
}

export default {
  generate,
  parse,
  reset,
};
