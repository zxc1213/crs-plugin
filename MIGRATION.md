# Migration Guide

## v0.12.x → v0.13.0

v0.13.0 实现**跨平台兼容性改造**：补齐 Cursor、Gemini CLI、OpenCode、Codex 的 manifest 文件，标准化 skills 目录结构（嵌套 → 平铺），建立版本同步机制。

### 谁会受影响？

| 用户类型 | 影响 | 行动 |
|---|---|---|
| Claude Code 用户 | **中性**（零回归） | 直接升级，无需操作 |
| 自定义 skill 引用 | ⚠️ **可能破坏** | 检查硬编码的 skills 路径，改为平铺 |
| Cursor/Gemini/OpenCode/Codex 用户 | **正面** | 可首次安装使用 CRS |
| 自定义 plugin 加载器 | ⚠️ **可能破坏** | 检查 plugin.json 字段格式 |

### 主要变更

#### 1. Skills 目录结构平铺

**v0.12.0（嵌套）**：

```
skills/
├── core/req-manager/
├── quality/req-quality/
├── analysis/req-priority/
└── ...
```

**v0.13.0（平铺）**：

```
skills/
├── req-manager/
├── req-quality/
├── req-priority/
└── ...
```

**迁移映射**：

| 旧路径 | 新路径 |
|---|---|
| `skills/core/req-manager/` | `skills/req-manager/` |
| `skills/core/req-brainstorm/` | `skills/req-brainstorm/` |
| `skills/core/req-init/` | `skills/req-init/` |
| `skills/core/req-doc-format/` | `skills/req-doc-format/` |
| `skills/quality/req-quality/` | `skills/req-quality/` |
| `skills/quality/req-test-plan/` | `skills/req-test-plan/` |
| `skills/quality/req-verify/` | `skills/req-verify/` |
| `skills/analysis/req-metrics/` | `skills/req-metrics/` |
| `skills/analysis/req-priority/` | `skills/req-priority/` |
| `skills/change/req-change/` | `skills/req-change/` |
| `skills/change/req-migrate/` | `skills/req-migrate/` |
| `skills/utils/req-unify/` | `skills/req-unify/` |

#### 2. plugin.json 字段格式标准化

**v0.12.0**（`.claude-plugin/plugin.json`）：

```json
{
  "skills": ["./skills/"],
  "commands": ["./commands/"]
}
```

**v0.13.0**（移除 skills/commands 字段，依赖约定发现）：

```json
{
  "name": "crs",
  "version": "0.13.0",
  "keywords": [...]
}
```

#### 3. 新增多平台 manifest 文件

| 文件 | 用途 |
|---|---|
| `.cursor-plugin/plugin.json` | Cursor 入口 |
| `gemini-extension.json` + `GEMINI.md` | Gemini CLI 入口 |
| `.codex/INSTALL.md` + `.codex/context.md` | Codex 入口（新路径） |
| `.opencode/INSTALL.md` + `.opencode/plugins/crs.js` | OpenCode 入口 |
| `hooks/hooks-cursor.json` | Cursor 简化版 hooks |

#### 4. 版本同步机制

新增 `npm run sync-version` 自动同步版本号到所有 manifest 文件，避免版本 drift。

### 升级步骤

```bash
# 1. 升级到 v0.13.0
npm install -g github:zxc1213/crs-plugin@latest

# 2. 验证安装
claude
# 在 Claude Code 中执行：
/req --active

# 3. （可选）验证其他平台
# 参见 docs/README.{cursor,gemini,opencode,codex}.md
```

### 回滚

如需回滚到 v0.12.0：

```bash
npm install -g github:zxc1213/crs-plugin@v0.12.0
```

`.requirements/` 数据完全兼容，无需迁移。

### 自定义代码检查清单

如果你有以下场景，需要手动调整：

- [ ] 自定义 skill 中硬编码引用了 `skills/core/*` 等旧路径
- [ ] 自定义 plugin 加载器解析 `.claude-plugin/plugin.json` 的 `skills` 字段
- [ ] CI 脚本中扫描特定 skills 子目录
- [ ] 文档中引用了 skills 嵌套路径

---

## v0.10.x → v0.11.0

v0.11.0 新增**项目级文档自动维护**功能（`.requirements/project/`），完全向后兼容，零破坏性变更。

### 谁会受影响？

| 用户类型 | 影响 | 行动 |
|---|---|---|
| 所有现有用户 | **正面** | 项目获得"活文档"视图，无需手动操作 |
| 多人协作团队 | **正面** | project 文档纳入 VCS 后团队共享 |
| 性能敏感项目 | 中性 | 单次同步 < 100ms，可关闭 |
| 自定义工作流用户 | 中性 | 通过 `CRS_PROJECT_SYNC=off` 可禁用 |

### 新增功能

#### 1. 自动初始化 `.requirements/project/` 目录

执行 `/req-init` 或首次创建需求时，自动生成：
- `project-structure.md` — 项目结构（代码扫描）
- `business-requirements.md` — 业务需求聚合
- `functional-requirements.md` — 功能矩阵
- `functional-design.md` — 设计要点汇总
- `changelog.md` — 变更历史
- `meta.yaml` — 项目元数据

#### 2. 自动同步触发

| 事件 | 动作 |
|---|---|
| 需求状态变为 `done` | 追加到 functional-requirements + functional-design |
| Bug 修复 `design_change: true` | 更新 functional-design.md |
| Bug 修复 `design_change: false` | 仅追加 changelog |

#### 3. Bug 设计变更标记

在 Bug 的 `spec/decisions.md` 顶部增加 frontmatter：

```yaml
---
design_change: true
impact_areas: [id-generator, processor]
---
```

未标记时使用关键词兜底（"重构"、"架构变更"等），命中即视为设计变更。

### 如何禁用？

设置环境变量：
```bash
export CRS_PROJECT_SYNC=off
```

### 如何手动操作？

```bash
crs-project-init              # 初始化或修复
crs-project-init --force      # 强制重建（保留 changelog）
crs-project-sync --full       # 全量重生成
crs-project-sync --req-id FEAT-20260613-001  # 同步指定需求
```

### 现有项目如何升级？

1. 升级到 v0.11.0：`npm install -g github:zxc1213/crs`
2. 在现有项目根目录执行：`crs-project-init`
3. 系统自动扫描现有需求，生成 4 份核心文档
4. 后续每次需求 done 时自动追加更新

---

## v0.9.x → v0.10.0

v0.10.0 引入新的 ID 生成模式（`CRS_ID_MODE` 环境变量），**默认行为变更**：不再写入 `.requirements/counters.json`，消除多人 Git 协作时的合并冲突。

### 谁会受影响？

| 用户类型 | 影响 | 行动 |
|---|---|---|
| 单人项目用户 | 中性 | 无需操作，新 ID 自动采用 fixed 模式 |
| 多人协作团队 | **正面** | 不再有 counters.json 合并冲突 |
| 依赖连续 NNN 的脚本 | **需调整** | NNN 在跨进程场景不再保证连续，请改用 `created` 时间排序 |
| 需要作者/机器隔离 | 可选 | 显式启用 `author_seq` 或 `hostname_seq` 模式 |

### 行为变更

| 项 | v0.9.x | v0.10.0 |
|---|---|---|
| 默认 NNN 来源 | 共享 counters.json 递增 | 进程内递增（不持久化） |
| `.requirements/counters.json` 写入 | 每次 generate 写入 | **不再写入** |
| 多人 Git 合并冲突 | 经常发生 | **不再发生** |
| 跨进程 NNN 唯一性 | 是（共享文件） | 否（由 hash 后缀保证全局唯一） |
| parse() 兼容性 | 三种格式 | 三种格式（不变） |

### 现有 ID 兼容性

所有 v0.9.x 生成的 ID 仍能被 `parse()` 正确识别：

- `FEAT-20260514-001-a3b2c1` (hash 格式) ✓
- `FEAT-20260514-001` (旧日期格式) ✓
- `FEAT-0001` (旧 4 位格式) ✓

`.requirements/counters.json` 文件如果存在，**不会被主动删除**，但也不会被新版本写入。可以手动删除以减少仓库噪音。

### 如何保留 v0.9.x 行为？

如果你需要保留"全局连续递增 NNN + 共享 counters.json"的行为（例如有脚本依赖此特性），可以选择以下模式之一：

#### 选项 A：按作者隔离（推荐）

```bash
# 在 shell 配置中（如 ~/.bashrc / ~/.zshrc / Windows 环境变量）
export CRS_ID_MODE=author_seq
export CRS_AUTHOR=你的名字
```

效果：每个作者维护独立的 `counters-{author}.json`，合并时不会冲突，且每人看到的 NNN 是连续的。

#### 选项 B：按机器隔离

```bash
export CRS_ID_MODE=hostname_seq
```

效果：每台机器维护独立的 `counters-{hostname}.json`。

#### 选项 C：完全无状态

```bash
export CRS_ID_MODE=hash_seq
```

效果：NNN 来自 hash 前 3 位（0-4095），完全无文件 IO，最简实现。

### 升级步骤

1. **升级包**：`npm install -g github:zxc1213/crs@latest`
2. **可选：清理旧 counter 文件**：`rm .requirements/counters.json`（非必须，新版本不会写入）
3. **可选：配置 ID 模式**：如需作者隔离，设置环境变量
4. **验证**：执行 `/req -f 测试需求`，检查生成的 ID 仍为 `FEAT-YYYYMMDD-NNN-HHHHHH` 格式

### 回滚

如需回退到 v0.9.x：

```bash
npm install -g github:zxc1213/crs@v0.9.1
```

回退后已生成的 v0.10.0 ID 仍能被 v0.9.x 的 `parse()` 正确识别（hash 格式双向兼容）。

### FAQ

**Q: 升级后我的项目历史会受影响吗？**
A: 不会。所有现有需求目录和 ID 都被保留，仅新创建的 ID 行为不同。

**Q: counters.json 文件还有用吗？**
A: v0.10.0 默认不再读写它。可以保留（无害）或删除（推荐）。

**Q: 我看到 NNN 不再连续，是 bug 吗？**
A: 这是设计变更。fixed 模式下 NNN 仅在单进程内递增，跨进程可能重复。全局唯一性由 hash 后缀保证。如需连续 NNN，请启用 `author_seq` 或 `hostname_seq` 模式。

**Q: 升级后测试失败怎么办？**
A: 如果你的测试断言"NNN 连续递增"或"counters.json 被写入"，请更新测试以适配 fixed 模式的新行为。参考 `tests/utils/id-generator.test.js` 的 4 种模式测试用例。
