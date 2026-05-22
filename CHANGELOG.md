# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
