# Codex 安装 CRS Plugin

## 自动安装

执行以下命令完成安装：

```bash
git clone https://github.com/zxc1213/crs-plugin ~/.codex/plugins/crs
cd ~/.codex/plugins/crs
npm install --production
```

## 验证安装

启动 Codex 后输入：

```text
/req --help
```

如果看到 CRS 帮助信息，说明安装成功。

## 上下文加载

Codex 启动时会自动读取 `.codex/context.md`，该文件通过 `@import` 语法加载：

- `skills/req/SKILL.md` — CRS 主入口 skill
- `CLAUDE.md` — 完整使用文档

## 更新

```bash
cd ~/.codex/plugins/crs
git pull
npm install --production
```

## 卸载

```bash
rm -rf ~/.codex/plugins/crs
```

## 故障排查

| 问题 | 解决方案 |
|---|---|
| `command not found: req` | 检查 `~/.codex/plugins/crs/bin/` 是否在 PATH 中 |
| `Cannot find module 'fuse.js'` | 运行 `npm install --production` |
| skills 未加载 | 检查 `.codex/context.md` 中 `@import` 路径是否正确 |
