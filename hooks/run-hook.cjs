#!/usr/bin/env node
/**
 * CRS Plugin Hook Runner (Cursor 兼容)
 *
 * Cursor hooks 协议简单（仅 sessionStart），此脚本作为通用入口。
 * 后续可扩展支持其他事件。
 *
 * Usage:
 *   node run-hook.cjs <event-name>
 */

const path = require('node:path');

const event = process.argv[2];

if (!event) {
  console.error('[crs-hook] Missing event name argument');
  process.exit(1);
}

const handlers = {
  sessionStart: () => {
    // 轻量级会话启动钩子
    // 输出 plugin 加载信息（debug 用）
    if (process.env.CRS_DEBUG === 'true') {
      console.error(`[crs-hook] sessionStart triggered at ${new Date().toISOString()}`);
    }
  },
};

const handler = handlers[event];
if (!handler) {
  console.error(`[crs-hook] Unknown event: ${event}`);
  process.exit(0);
}

try {
  handler();
} catch (err) {
  console.error(`[crs-hook] Error handling ${event}:`, err.message);
  process.exit(0);
}
