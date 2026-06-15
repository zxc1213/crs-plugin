# Cursor 安装指南

CRS Plugin v0.13.0+ 支持 Cursor IDE。

## 前置要求

- Cursor v0.42+
- Node.js v18+

## 安装方式

### 方式 1：通过 Cursor Marketplace

在 Cursor Agent 模式中输入：

```text
/add-plugin crs
```

或在 Cursor 设置中搜索 "crs" 添加 plugin。

### 方式 2：通过 GitHub URL

```text
/add-plugin https://github.com/zxc1213/crs-plugin
```

## 验证安装

1. 重启 Cursor
2. 在 Agent 模式中输入：

```text
使用 CRS 创建一个 feature 需求：添加用户登录
```

如果 Cursor 能调用 `req-manager` skill 并执行 5 阶段工作流，说明安装成功。

## 可用 Skills

CRS 在 Cursor 中提供以下 skills：

- `req-manager` — 智能需求管理统一入口
- `req-brainstorm` — 深度需求分析
- `req-quality` — 质量门禁检查
- `req-priority` — 优先级科学评估
- `req-test-plan` — 测试策略生成
- 以及其他 8 个 skills

## 可用 Commands

- `/req` — 主命令
- `/crs:req` — 等价别名
- `/req-init` — 初始化
- `/req-update` — 更新需求
- 以及其他 9 个 commands

## Hooks 说明

Cursor 中仅启用 SessionStart hook（轻量级，仅日志记录）。

Claude Code 中可用的 conversation-logger、post-req-update 等 hooks **不在 Cursor 中触发**（平台协议差异）。

## 更新

```text
/update-plugin crs
```

或重新执行 `/add-plugin` 命令。

## 故障排查

| 问题 | 解决方案 |
|---|---|
| `Plugin not found` | 检查 Cursor 版本 ≥ 0.42 |
| Skills 未加载 | 重启 Cursor；检查 `.cursor-plugin/plugin.json` 存在 |
| Commands 无法执行 | 检查 Node.js v18+ 已安装 |
| Hooks 报错 | 检查 `${CLAUDE_PLUGIN_ROOT}` 环境变量（Cursor 应自动设置） |

## 限制

- Cursor hooks 协议简单，仅 SessionStart 事件
- 复杂 hooks（如 conversation-logger）不可用
- 其他功能与 Claude Code 一致

## 反馈

如遇问题，请提交 [GitHub Issue](https://github.com/zxc1213/crs-plugin/issues)。
