# OpenCode 安装指南

CRS Plugin v0.13.0+ 支持 OpenCode（开源 AI 编程工具）。

## 前置要求

- OpenCode v0.5+
- Node.js v18+
- Git

## 安装步骤

### 1. 克隆仓库到 OpenCode plugins 目录

```bash
git clone https://github.com/zxc1213/crs-plugin ~/.opencode/plugins/crs
```

### 2. 安装依赖

```bash
cd ~/.opencode/plugins/crs
npm install --production
```

### 3. 重启 OpenCode

退出当前 OpenCode 会话，重新启动。

### 4. 验证

在 OpenCode 中输入：

```text
/req --help
```

如果看到 CRS 帮助信息，说明安装成功。

## Plugin 入口

OpenCode 通过 `.opencode/plugins/crs.js`（ESM 模块）加载 CRS：

- 自动扫描 `skills/` 目录
- 自动扫描 `commands/` 目录
- 导出 plugin 元数据（name, version, description）

## 可用 Skills

CRS 在 OpenCode 中提供全部 13 个 skills（与 Claude Code 一致）。

## 可用 Commands

CRS 在 OpenCode 中提供全部 13 个 commands。

## 配置（可选）

如需禁用 CRS，编辑 `~/.opencode/config.json`：

```json
{
  "plugins": {
    "crs": {
      "enabled": false
    }
  }
}
```

## 更新

```bash
cd ~/.opencode/plugins/crs
git pull
npm install --production
```

重启 OpenCode 生效。

## 卸载

```bash
rm -rf ~/.opencode/plugins/crs
```

## 故障排查

| 问题 | 解决方案 |
|---|---|
| `Cannot find export default` | 检查 Node.js ≥ v18 |
| Plugin 未加载 | 验证 `~/.opencode/plugins/crs/.opencode/plugins/crs.js` 存在 |
| Skills 未发现 | 验证 `skills/*/SKILL.md` 路径结构（平铺） |
| `Cannot find module 'fuse.js'` | 运行 `npm install --production` |

## 限制

- OpenCode 不支持 hooks（无 conversation-logger 等自动化）
- Plugin 加载顺序由 OpenCode 决定

## 反馈

如遇问题，请提交 [GitHub Issue](https://github.com/zxc1213/crs-plugin/issues)。
