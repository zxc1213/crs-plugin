# ClaudeReqSys 版本说明

> **项目同时维护两个版本**

ClaudeReqSys 现在提供两种安装方式，你可以根据需求选择：

## 📦 版本对比

### npm 全局包版本（传统方式）

**分支**: `master`  
**适合**: 个人项目、不想用 Claude Code 插件系统的用户

**安装**:

```bash
npm install -g github:zxc1213/claude-req-sys
```

**特点**:

- ✅ 熟悉的 npm 安装方式
- ✅ 全局安装，所有项目可用
- ⚠️ 需要运行 postinstall 脚本
- ⚠️ hooks 需要手动配置

**更新**:

```bash
npm install -g github:zxc1213/claude-req-sys
```

**卸载**:

```bash
npm uninstall -g claude-req-sys
```

---

### Claude Code 插件版本（推荐）⭐

**分支**: `feature/plugin-migration`  
**适合**: Claude Code 用户、团队协作、自动配置

**安装**:

```bash
/plugin install https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration
```

**特点**:

- ✅ 一键安装，无需手动配置
- ✅ hooks 自动生效
- ✅ Skills 调用: `/claude-req-sys:req-manager`
- ✅ 环境变量自动设置
- ✅ 更新方便: `/plugin update claude-req-sys`

**Skills**:

- `/claude-req-sys:req-manager` - 智能需求管理
- `/claude-req-sys:req-brainstorm` - 深度需求分析
- `/claude-req-sys:req-priority` - 优先级评估
- `/claude-req-sys:req-quality` - 质量门禁
- ...更多 skills

**更新**:

```bash
/plugin update claude-req-sys
```

**卸载**:

```bash
/plugin uninstall claude-req-sys
```

---

## 🎯 如何选择？

### 选择 npm 版本，如果你：

- ❌ 不使用 Claude Code
- ❌ 不需要插件功能
- ✅ 习惯使用 npm 全局包
- ✅ 想要独立于 Claude Code 的安装

### 选择插件版本，如果你：⭐

- ✅ 使用 Claude Code
- ✅ 需要团队协作
- ✅ 想要自动配置（hooks、环境变量）
- ✅ 希望简化安装和更新流程
- ✅ 需要更好的版本管理

---

## 🔄 从 npm 版本迁移到插件版本

如果你当前使用 npm 版本，想迁移到插件版本：

1. **保留 npm 版本**（可选）:

   ```bash
   # npm 版本仍然可用
   npm install -g github:zxc1213/claude-req-sys
   ```

2. **安装插件版本**:

   ```bash
   /plugin install https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration
   ```

3. **数据兼容性**:
   - ✅ `.requirements/` 目录完全兼容
   - ✅ 两种版本共享相同的数据
   - ✅ 可以同时安装两个版本（不推荐，但兼容）

4. **卸载 npm 版本**（可选）:
   ```bash
   npm uninstall -g claude-req-sys
   ```

---

## 🛠️ 维护说明

### 分支维护策略

**master 分支**:

- 维护 npm 全局包版本
- 更新 package.json 的 bin 字段
- 保持 postinstall 脚本
- 更新 src/ 目录结构

**feature/plugin-migration 分支**:

- 维护插件版本
- 更新 .claude-plugin/plugin.json
- 维护 skills/, commands/, hooks/ 目录
- 优化插件结构

### 同时维护建议

1. **核心逻辑优先**: 在 master 分支开发核心功能
2. **同步更新**: 定期将 master 的核心逻辑合并到 feature/plugin-migration
3. **独立测试**: 两个版本都需要测试
4. **文档维护**: 保持两个版本的文档同步

---

## 📚 相关文档

- **npm 版本文档**: [README.md](https://github.com/zxc1213/claude-req-sys/blob/master/README.md)
- **插件版本文档**: [README_PLUGIN.md](https://github.com/zxc1213/claude-req-sys/blob/feature/plugin-migration/README_PLUGIN.md)
- **插件安装指南**: [INSTALL.md](https://github.com/zxc1213/claude-req-sys/blob/feature/plugin-migration/INSTALL.md)
- **改造方案**: [plugin-migration-plan.md](https://github.com/zxc1213/claude-req-sys/blob/feature/plugin-migration/docs/plugin-migration-plan.md)

---

**当前推荐**: 插件版本 ⭐（更简单的安装和配置）
