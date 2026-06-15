# OpenCode 安装 CRS Plugin

## 前置要求

- Node.js v18+
- OpenCode v0.5+

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/zxc1213/crs-plugin ~/.opencode/plugins/crs
```

### 2. 安装依赖

```bash
cd ~/.opencode/plugins/crs
npm install --production
```

### 3. 重启 OpenCode

```bash
# 退出当前 OpenCode 会话，重新启动
```

### 4. 验证

在 OpenCode 中输入：

```text
/req --help
```

如果看到 CRS 帮助信息，说明安装成功。

## Plugin 入口

OpenCode 通过 `.opencode/plugins/crs.js` 加载 CRS：

- 自动扫描 `skills/` 目录
- 自动扫描 `commands/` 目录
- 导出 plugin 元数据（name, version, description）

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
| `Cannot find export default` | 检查 Node.js 版本 ≥ v18 |
| Plugin 未加载 | 检查 `~/.opencode/plugins/crs/.opencode/plugins/crs.js` 存在 |
| Skills 未发现 | 验证 `skills/*/SKILL.md` 路径结构（平铺） |
