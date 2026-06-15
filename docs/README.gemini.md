# Gemini CLI 安装指南

CRS Plugin v0.13.0+ 支持 Google Gemini CLI。

## 前置要求

- Gemini CLI v0.1+
- Node.js v18+

## 安装

```bash
gemini extensions install https://github.com/zxc1213/crs-plugin
```

## 验证安装

```bash
gemini
```

在 Gemini CLI 交互模式中输入：

```text
列出所有 CRS skills
```

如果 Gemini 能识别并加载 CRS skills，说明安装成功。

## 上下文加载机制

Gemini CLI 通过以下文件加载 CRS：

1. **`gemini-extension.json`** — Extension 入口配置
2. **`GEMINI.md`** — 上下文文件，使用 `@import` 语法引用：
   - `@./skills/req/SKILL.md` — CRS 主入口 skill
   - `@./CLAUDE.md` — 完整使用文档

## 可用 Skills

CRS 在 Gemini CLI 中提供全部 13 个 skills（与 Claude Code 一致）。

## 可用 Commands

CRS 在 Gemini CLI 中提供全部 13 个 commands。

## 更新

```bash
gemini extensions update crs
```

## 卸载

```bash
gemini extensions uninstall crs
```

## 故障排查

| 问题 | 解决方案 |
|---|---|
| `Extension not found` | 检查 Gemini CLI 版本；检查网络 |
| `GEMINI.md not found` | 验证仓库根目录有该文件 |
| Skills 未加载 | 检查 `@import` 路径正确 |
| Commands 无法执行 | 确认 Node.js v18+ |

## 限制

- Gemini CLI 不支持 hooks（无 conversation-logger 等自动化）
- 部分高级功能依赖 Gemini CLI 的 skill 调用机制

## 反馈

如遇问题，请提交 [GitHub Issue](https://github.com/zxc1213/crs-plugin/issues)。
