/**
 * Writer - 文件输出
 *
 * 确保目录存在 + 写入文件 + 返回统计信息
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * 写入 HTML 文件
 * @param {string} html - HTML 内容
 * @param {string} outputPath - 输出路径
 * @returns {Promise<{path: string, size: number, durationMs: number}>}
 */
export async function write(html, outputPath) {
  const start = Date.now();
  const absPath = path.resolve(outputPath);

  try {
    await fs.mkdir(path.dirname(absPath), { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      const err = new Error(`无法创建目录 ${path.dirname(absPath)}: ${error.message}`);
      err.code = 'EWRITE_FAIL';
      err.cause = error;
      throw err;
    }
  }

  try {
    await fs.writeFile(absPath, html, 'utf-8');
  } catch (error) {
    const err = new Error(`无法写入文件 ${absPath}: ${error.message}`);
    err.code = error.code === 'ENOSPC' ? 'ENOSPC' : 'EWRITE_FAIL';
    err.cause = error;
    throw err;
  }

  const stat = await fs.stat(absPath);
  return {
    path: absPath,
    size: stat.size,
    durationMs: Date.now() - start,
  };
}

export default { write };
