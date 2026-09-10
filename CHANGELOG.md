# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-09-10

**主题：同步自 crs-zcode v1.2→v1.5——文档体系 / 引擎重构 / 正确性加固 / 规则体系与注入面收敛一次性对齐**（需求 FEAT-20260910-001-fe7306）

> 本次为跨仓同步版本：将 crs-zcode（ZCode 移植线）四代演进的引擎能力移植回本仓，并与平台层（ClaudeCode hooks / 多平台清单）适配共存。版本号跳变 0.13.0 → 1.5.0 与 zcode 线对齐。

### 引擎层（同步自 zcode v1.2~v1.5）

- **文档体系**：`project/timeline.yaml` 统一事件账本（append-only + 原子写）；`crs:block` 区块替换（需求变更后已聚合文档原位更新，旧格式自动迁移）；`docs-map.yaml` 宿主文档纳管（`--scan-docs` 扫描登记 + 漂移检测 + `--doc-reviewed`）；`--history [N]` / `--status <ID>` 查询；HTML 报告新增历史时间线（彩色事件徽章）/ 成长档案（经验库 + 踩坑沉淀）/ 文档地图三板块
- **引擎重构**：processor 拆分 template-renderer / requirement-creator / status-machine 三模块；scheduler 瘦身（只管执行模式与阶段顺序）；`core/schema.js` 唯一口径源（状态词表 / 日期字段 / 类型目录 / 事件类型，读取侧兼容旧口径）；项目级 `config.yaml`（权重 / 门禁 / 骨架 / docs-map 深度可覆盖，损坏回退默认）
- **正确性修复**（同步过程中本仓当场复现过前两项）：`--help`/未知查询旗标不再被当作需求描述误建垃圾需求；凭证正则收紧（「关键词 + 显式 =/: 分隔 + ≥6 位密钥样值」，"token 消耗" 类自然叙述不再误报）；知识图谱路径语义修复（收项目根）；`--force` 全量重建保留 changelog/timeline/docs-map；交付日期按 completed 取值；DEBT 类型聚合修复；CSV 导出 RFC 4180 转义
- **规则体系**：`core/rules.js` + `.requirements/_system/rules.yaml`——guard（PostToolUse 守卫，含 Bash `command_contains`）与 inject（SessionStart 提醒）两类规则；同 id 字段级覆盖内置、新 id 追加、单条非法剔除、YAML 损坏降级默认；`inject_budget_chars` 注入预算（默认 600 字符，按 priority 整条丢弃）；`rules` / `rules --validate` CLI 子命令；自定义指南 `docs/rules.md`

### 平台层（ClaudeCode 适配）

- **hooks 重写为规则驱动**：`scripts/hooks/crs-session-start.js` / `crs-post-tool-use.js` / `crs-stop.js` 三个脚本消费规则数据，源码零内嵌文案；与 conversation-logger 的 hook 条目在 hooks.json 中共存
- **阶段守卫复活**：原 `post-req-update.js` 依赖从未创建的 `.requirements/ACTIVE` 符号链接（死功能），且 Windows 无符号链接权限导致 6 个测试 EPERM 失败；现改为扫描 meta.yaml（`crs-lib.js`），Windows 原生可用，EPERM 失败清零
- **多平台清单不回归**：hooks-cursor.json / gemini-extension.json / codex 清单维持不动

### 注入面收敛

- commands + skills 总量 **182.1KB → 117.9KB（-35.3%）**：req/req-change/req-priority/req-quality/metrics 五命令与八个 req-* 技能改用 zcode 收敛版内容（命令=路由+硬性约束，示例输出外移 `docs/examples/`，格式定义移交骨架模板）；保留全部用户入口（13 命令 + 13 技能，多平台兼容优先，见需求决策 Q2）；claude 独有入口中 req-migrate/req-verify/req-manager 仍超 5KB，留待后续按需收敛
- 新增 `bin/crs-context-stats.js` 注入面度量（commands/skills 逐文件字节、hook 注入文案字符数与预算占用，`--json` / `--compare-json`）

### 移除（死代码，同步 zcode 判定 + 本仓零引用复验）

- `skill-adapters/`（6 文件）与 `core/skill-interface.js`（约 1100 行）
- `optimization/`（4 文件）与 `features/similarity.js`（查重职责已由知识图谱承担）
- `utils/skills-health.js` + `bin/crs-skill-health.js`（旧生态技能清单）
- `demo.js`、`integrations/`（零引用）

### 变更

- 依赖：+`js-yaml`（YAML 解析）+`chalk`（CLI 着色）；package.json 移除 crs-skill-health bin 入口、新增 crs-context-stats
- 测试：366 通过/6 失败 → **381 全绿**（+规则引擎 16 / 配置 8 / schema 18 / 安全回归 11 / hook 端到端 12；symlink 守卫用例按新机制重写）
- ESLint 对齐 zcode 口径（`_` 前缀 catch 参数豁免），引擎代码 lint 告警归零（conversation-logger 历史告警保留）

## [0.13.0] - 2026-06-15

### Added

#### 跨平台 Plugin 兼容性

- **5 平台 manifest 支持**：CRS Plugin 现可被以下 AI 编程工具识别和加载：
  - **Claude Code** — 默认平台（`.claude-plugin/plugin.json`）
  - **Cursor** — 新增 `.cursor-plugin/plugin.json`
  - **Gemini CLI** — 新增 `gemini-extension.json` + `GEMINI.md`
  - **OpenCode** — 新增 `.opencode/plugins/crs.js`（ESM 入口）
  - **Codex** — 新增 `.codex/INSTALL.md` + `.codex/context.md`
- **多平台文档**：`docs/README.{cursor,gemini,opencode,codex}.md` 完整安装指南
- **Cursor 简化 hooks**：`hooks/hooks-cursor.json` + `hooks/run-hook.cjs`
- **OpenCode 动态入口**：`.opencode/plugins/crs.js` 自动扫描 skills/commands
- **版本同步脚本**：扩展 `scripts/sync-version.js` 同步 4 个 manifest 版本号
- **需求文档**：FEAT-20260615-001-3b7e2a 完整 5 阶段文档（spec/plan/test-cases）

### Changed

#### Skills 目录结构标准化

- **嵌套 → 平铺**：`skills/<category>/<skill>/SKILL.md` → `skills/<skill>/SKILL.md`
- **13 个 skills 全部平铺**：符合 Claude Code/Cursor/Gemini CLI/OpenCode 标准
- **`.claude-plugin/plugin.json` 格式修正**：移除 `skills`/`commands` 字段（依赖约定发现），新增 `keywords` 字段
- **`package.json` files 字段**：新增 5 个 manifest 目录/文件，确保 npm publish 包含
- **`README.md`**：新增"跨平台支持"章节，5 平台安装矩阵
- **`CLAUDE.md` / `PROJECT_STRUCTURE.md`**：更新 skills 目录结构说明
- **`MIGRATION.md`**：新增 v0.12.x → v0.13.0 详细迁移指南

### Compatibility

- ✅ **零回归**：320 个测试用例全部通过（v0.12.0 基线）
- ✅ **数据兼容**：`.requirements/` 数据无需迁移
- ⚠️ **路径变更**：自定义代码引用旧 skills 路径需更新（详见 MIGRATION.md）

### Docs

- `docs/README.cursor.md` — Cursor 安装与使用
- `docs/README.gemini.md` — Gemini CLI 安装与使用
- `docs/README.opencode.md` — OpenCode 安装与使用
- `docs/README.codex.md` — Codex 安装与使用

---

## [0.12.0] - 2026-06-13

### Added

#### HTML 报告导出（crs-export）

- **新增 `crs-export` CLI**：将 `.requirements/` 聚合为单文件静态 HTML 报告
  - 状态分布饼图（SVG 内联，零依赖）
  - Mermaid 依赖关系图（CDN / `--offline` 两种模式）
  - 需求列表（客户端过滤：类型/状态/优先级/搜索）
  - Changelog 时间线、需求详情折叠面板、项目级文档
- **新模块** `scripts/export/`：7 个文件（collector/renderer/writer/markdown/utils/types/index）
- **轻量 Markdown 渲染器**：手写实现，无新依赖，节省 ~30KB
- **XSS 防护**：所有动态内容强制 `escapeHtml`，覆盖 OWASP payload
- **测试**：~79 个用例（utils/markdown/collector/renderer/writer/integration），全部通过
- **CLI 选项**：`--output` / `--title` / `--offline` / `--no-mermaid` / `--filter` / `--quiet`
- **端到端验证**：在 CRS 自身导出 8 个需求 → 228 KB / 2ms

### Changed

- `package.json`：注册 `crs-export` bin
- `README.md` / `CLAUDE.md`：新增 crs-export 使用文档

## [0.11.0] - 2026-06-13

### Added

#### 项目级文档自动维护（project-sync）

- **自动维护 `.requirements/project/`**：5 份文档自动同步
  - `project-structure.md`（代码扫描）
  - `business-requirements.md`（feature 需求聚合）
  - `functional-requirements.md`（已完成需求聚合）
  - `functional-design.md`（spec/design.md 聚合 + Bug 设计变更）
  - `changelog.md`（全部同步事件，只追加）
- **新增 CLI**：`crs-project-init` / `crs-project-sync`
- **触发机制**：需求状态变 done / Bug 修复涉及设计变更时自动追加（幂等去重）
- **Bug 设计变更检测**：frontmatter `design_change: true` + 关键词兜底

### Changed

- `processor.update()` 集成 project-sync 调用
- 关闭同步：`export CRS_PROJECT_SYNC=off`

## [0.10.0] - 2026-06-12

### Added

#### 多模式 ID 生成（CRS_ID_MODE）

- 通过 `CRS_ID_MODE` 环境变量支持 4 种 NNN 计算方式
  - `fixed`（默认）：进程内递增不持久化，多人 Git 零合并冲突
  - `hash_seq`：hash 前 3 位（0-4095）
  - `author_seq`：按作者隔离（`counters-{author}.json`）
  - `hostname_seq`：按机器隔离（`counters-{hostname}.json`）

## [0.7.0] - 2026-05-23

### Added

#### Superpowers 技能集成系统

- 完整的技能接口抽象层 (`skill-interface.js`)
- 5个技能适配器 (brainstorming, debugging, research, code-explorer, planning)
- 技能版本管理 (`skill-versions.json`)
- 技能健康检查 CLI (`claude-req-skill-health`)
- 降级策略支持 (template/manual/simulation/error)
- 集成测试套件 (36个测试用例)

#### 改进

- 调度器集成技能接口和适配器
- 路由器支持降级模式配置
- 技能状态缓存机制 (60秒 TTL)

### Technical Details

- 技能创建速度: < 100ms
- 计划生成速度: < 50ms
- 测试通过率: 100% (36/36)

## [Unreleased]

### Added

#### Superpowers 技能集成完成 (2026-05-22)

- **skill-interface.js**: 新增技能接口抽象层
  - `SkillInterface` 类 - 统一技能调用接口
  - `callSkill(skillName, params, options)` - 调用技能并处理降级
  - `checkSkillHealth(skillName)` - 检查单个技能健康状态
  - `getAllSkillsHealth()` - 获取所有技能健康状态
  - `handleFallback()` - 处理降级策略
  - 支持四种降级模式: template, manual, simulation, error
  - 技能状态缓存机制（60秒 TTL）

- **skill-adapters/**: 新增技能适配器系统
  - `base.js` - `BaseSkillAdapter` 基类
  - `brainstorming.js` - `BrainstormingAdapter` 头脑风暴适配器
  - `debugging.js` - `DebuggingAdapter` 系统化调试适配器
  - `research.js` - `ResearchAdapter` 信息收集适配器
  - `code-explorer.js` - `CodeExplorerAdapter` 代码探索适配器
  - `planning.js` - `PlanningAdapter` 实施规划适配器
  - `index.js` - `AdapterFactory` 工厂和索引
  - 适配器功能: 参数验证、预处理、模板生成、结果后处理

- **skill-versions.json**: 新增技能版本管理配置
  - 记录5个核心技能的版本要求
  - Claude Code 和 Superpowers 版本依赖
  - 技能兼容性状态追踪

- **tests/integration/skill-adapters.test.js**: 新增集成测试
  - 36个测试用例全部通过
  - 覆盖适配器、接口、路由、调度器集成
  - 测试性能指标: 适配器创建 <100ms, 计划生成 <50ms

### Changed

#### Superpowers 技能集成 (2026-05-22)

- **scheduler.js**: 集成 SkillInterface 和适配器系统
  - 添加 `initializeSkillInterface()` - 初始化技能接口和适配器
  - 添加 `executeSkill(skillName, params)` - 通过适配器执行技能
  - 添加 `getHealthSummary()` - 获取技能健康摘要
  - 添加 `checkSkillsHealth(skillChain)` - 检查技能链健康状态
  - 添加 `setFallbackMode(mode)` - 设置降级模式
  - 添加 `setFallbackEnabled(enabled)` - 启用/禁用降级
  - 添加 `clearSkillCache()` - 清除状态缓存
  - 修改为支持 baseDir 参数的延迟初始化单例模式

- **router.js**: 添加降级模式配置支持
  - 添加 `FALLBACK_MODES` 枚举
  - 为每个路由添加 `fallback` 配置
  - 添加 `getFallbackConfig(type)` - 获取降级配置
  - 添加 `getSkillFallbackMode(type, skillName)` - 获取技能降级模式
  - 添加 `isFallbackEnabled(type)` - 检查降级是否启用
  - 添加 `setFallbackMode(type, mode)` - 设置降级模式
  - 添加 `setSkillFallbackMode(type, skillName, mode)` - 设置技能降级模式

### Added

#### 技能健康检查系统 (2026-05-22)

- **skills-health.js**: 新增技能健康检查模块
  - `SkillsHealthChecker` 类 - 检查 Superpowers 技能的可用性和版本
  - `checkAllSkills()` - 检查所有依赖技能
  - `checkSkill(skill)` - 检查单个技能
  - `getSkillVersion(name)` - 获取技能版本号
  - `displayReport(results)` - 生成格式化的健康报告
  - `generateJsonReport(results)` - 生成 JSON 格式报告
  - 支持的技能: brainstorming, systematic-debugging, research, code-explorer, writing-plans

- **claude-req-skill-health**: 新增 CLI 命令
  - `--quiet, -q` - 仅显示摘要信息
  - `--json, -j` - 以 JSON 格式输出
  - `--help, -h` - 显示帮助信息
  - 自动检测项目基础目录
  - 按技能类别分组显示结果

- **package.json**: 添加新的 bin 命令入口
  - `claude-req-skill-health`: 技能健康检查命令

#### 需求文档跟踪 (2026-05-22)

- **document-tracker.js**: 新增文档跟踪模块
  - `scanDocuments(reqPath)` - 扫描需求目录中的文档
  - `trackDocuments(baseDir, reqPath)` - 自动更新元数据
  - `addDocument(baseDir, reqPath, docName, content)` - 添加文档并更新
  - `getDocumentSummary(reqPath)` - 获取文档变化摘要
  - 自动检测新文档并更新 meta.yaml
  - 新文档自动将状态从 open 更新为 in_progress

- **claude-req-track**: 新增 CLI 命令
  - 手动触发文档跟踪和元数据更新
  - 支持指定需求 ID 或当前目录

### Changed

#### ID 生成器重构 (2026-05-22)

- **id-generator.js**: 完全重构 ID 生成机制
  - 从序号格式改为日期格式: `PREFIX-YYYYMMDD-XXX`
  - 新增持久化存储: `.requirements/counters.json`
  - 每日独立计数器，避免跨天冲突
  - 支持 6 种需求类型: feature, bug, question, adjustment, refactor, tech-debt
  - 异步生成函数: `generate(type)` 返回 Promise

#### 存储路径修正 (2026-05-22)

- **storage.js**: 修正目录路径
  - 所有路径从 `requirements` 改为 `.requirements`
  - `createRequirementDir()` - 创建正确的隐藏目录
  - `readMeta()` / `writeMeta()` - 读写元数据到正确位置

- **processor.js**: 修正处理器路径配置
  - `requirementsDir` 使用 `.requirements` 而非 `requirements`
  - 添加 `await` 关键字调用异步 ID 生成器
  - 新增 `trackDocuments()` 方法 - 自动跟踪文档变化
  - 新增 `.claude-context.md` 创建 - 引导 Superpowers 技能文档保存

### Fixed

#### Bug 修复 (2026-05-22)

- **ID 重复生成问题**: 修复需求创建时重复生成 -0001 ID 的问题
  - 原因: 内存计数器无持久化
  - 解决: 使用 JSON 文件持久化每日计数器

- **文档路径错误**: 修复文档未保存到 .requirements 目录的问题
  - 原因: storage.js 使用错误的目录名
  - 解决: 统一使用 `.requirements` 隐藏目录

- **Superpowers 集成缺失**: 修复技能文档未按 req 规则保存的问题
  - 原因: 缺少技能文档保存指引
  - 解决: 创建 `.claude-context.md` 引导文档保存位置

- **元数据未实时更新**: 修复添加文档后 meta.yaml 未更新的问题
  - 原因: 缺少文档跟踪机制
  - 解决: 实现自动文档扫描和元数据更新

### Technical Notes

#### 架构改进

- 新增技能健康检查层，为技能抽象层做准备
- 文档跟踪系统支持 Superpowers 技能集成
- ID 生成器支持跨会话持久化

#### 依赖更新

- 新增依赖: `cli-table3` - 用于表格化输出

#### 文件变更

**新增文件**:

- `scripts/requirement-manager/utils/skills-health.js`
- `scripts/requirement-manager/utils/document-tracker.js`
- `bin/claude-req-skill-health.js`
- `bin/claude-req-track.js`
- `.requirements/counters.json`

**修改文件**:

- `scripts/requirement-manager/utils/id-generator.js` (完全重构)
- `scripts/requirement-manager/utils/storage.js` (路径修正)
- `scripts/requirement-manager/core/processor.js` (集成新功能)
- `package.json` (添加 bin 命令)

**需求文档**:

- `.requirements/features/FEAT-20260522-002/analysis.md`
- `.requirements/features/FEAT-20260522-002/plan.md`
- `.requirements/features/FEAT-20260522-003/design.md`
- `.requirements/features/FEAT-20260522-003/plan.md`
- `.requirements/features/FEAT-20260522-004/design.md`

---

## [0.6.0] - 2026-05-14

### Added

- 初始版本发布
- 需求管理系统核心功能
- 知识图谱集成
- Hooks 自动化
- CLI 命令工具集

---

## Links

- **GitHub Repository**: https://github.com/zxc1213/claude-req-sys
- **Issue Tracker**: https://github.com/zxc1213/claude-req-sys/issues
- **Documentation**: [README.md](README.md)

---

_本 CHANGELOG 遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 规范_
