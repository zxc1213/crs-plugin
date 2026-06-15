# Codex 安装指南

CRS Plugin v0.13.0+ 支持 OpenAI Codex。

## 前置要求

- OpenAI Codex（最新版）
- Node.js v18+
- Git

## 安装步骤

### 方式 1：让 Codex 自动安装（推荐）

在 Codex 会话中输入：

```text
Fetch and follow instructions from https://raw.githubusercontent.com/zxc1213/crs-plugin/main/.codex/INSTALL.md
```

Codex 会读取 INSTALL.md 并自动执行安装步骤。

### 方式 2：手动安装

```bash
# 1. 克隆仓库到 Codex plugins 目录
git clone https://github.com/zxc1213/crs-plugin ~/.codex/plugins/crs

# 2. 安装依赖
cd ~/.codex/plugins/crs
npm install --production

# 3. 重启 Codex
```

## 验证安装

启动 Codex 后输入：

```text
/req --help
```

如果看到 CRS 帮助信息，说明安装成功。

## 上下文加载机制

Codex 通过以下文件加载 CRS：

1. **`.codex/INSTALL.md`** — 安装引导文档
2. **`.codex/context.md`** — 上下文文件，使用 `@import` 语法引用：
   - `@./skills/req/SKILL.md` — CRS 主入口 skill
   - `@./CLAUDE.md` — 完整使用文档

## 可用 Skills

CRS 在 Codex 中提供全部 13 个 skills（与 Claude Code 一致）。

## 可用 Commands

CRS 在 Codex 中提供全部 13 个 commands。

## 更新

```bash
cd ~/.codex/plugins/crs
git pull
npm install --production
```

重启 Codex 生效。

## 卸载

```bash
rm -rf ~/.codex/plugins/crs
```

## 故障排查

| 问题 | 解决方案 |
|---|---|
| `.codex/INSTALL.md not found` | 注意路径是 `.codex/`（非 `.codex-plugin/`） |
| Skills 未加载 | 检查 `.codex/context.md` 中 `@import` 路径 |
| Commands 无法执行 | 验证 Node.js v18+ 已安装 |
| `Cannot find module 'fuse.js'` | 运行 `npm install --production` |

## 向后兼容

v0.13.0 保留 `.codex-plugin/plugin.json`（旧路径），不删除，兼容旧版 Codex 集成。

新安装推荐使用 `.codex/` 路径。

## 限制

- Codex 不支持 hooks（无 conversation-logger 等自动化）
- 复杂 skills 调用依赖 Codex 的 skill 处理机制

## 反馈

如遇问题，请提交 [GitHub Issue](https://github.com/zxc1213/crs-plugin/issues)。
