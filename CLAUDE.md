# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**文档版本**: v1.0 | **最后更新**: 2026-05-14 | **适用版本**: v0.6.0

## 项目概述

**CRS** 是一个智能需求管理系统，为 Claude Code 提供从需求捕获到测试完成的全流程管理能力。作为 npm 全局包安装，一次安装所有项目共享。

**核心特性**：

- 智能路由：根据需求类型自动选择最优处理流程
- 向量知识图谱：基于 Fuse.js 实现语义搜索，发现相似需求
- 质量门禁：4个关键阶段自动检查，确保交付质量
- 技能集成：深度集成 brainstorming、systematic-debugging 等 Claude Code skills

## 常用命令

### 开发命令

```bash
# 测试（142个测试用例）
npm test                      # 运行所有测试
npm run test:watch            # 监视模式
npm run test:coverage         # 查看覆盖率
npm run test:verbose          # 详细输出

# 代码质量
npm run lint                  # ESLint 检查
npm run lint:fix              # 自动修复
npm run format                # Prettier 格式化
npm run format:check          # 检查格式

# 安装与更新
npm install -g .              # 本地开发时全局安装
npm install -g github:zxc1213/crs  # 从 GitHub 安装
```

### 知识图谱 CLI

```bash
kg-search "用户登录" 10       # 搜索相似需求
kg-stats                      # 查看统计信息
kg-connections REQ-001        # 查看知识关联
kg-recommend                  # 智能推荐
kg-rebuild                    # 重建索引
```

## 核心架构

### 需求处理流程

```
用户输入 → req-manager (智能路由)
    ↓
[创建需求] → req-brainstorm → req-priority → req-quality
    ↓
需求存储 (.requirements/)
    ↓
知识图谱自动同步
```

### 关键模块

**需求处理器** (`scripts/requirement-manager/core/processor.js`)

- `Processor.create()` - 创建新需求，生成 ID（如 FEAT-20260514-001-a3b2c1）
- `Processor.update()` - 更新需求状态
- `Processor.parseType()` - 解析命令输入，自动推断类型和模式

**路由器** (`scripts/requirement-manager/core/router.js`)

- 管理 5 种需求类型的路由配置：feature、bug、question、adjustment、refactor
- 每种类型对应不同的 primarySkill 和 phases

**知识图谱** (`scripts/knowledge-graph/index.js`)

- `KnowledgeGraph.initialize()` - 扫描所有需求目录构建索引
- `KnowledgeGraph.findSimilarRequirements()` - 基于 Fuse.js 的语义搜索
- `KnowledgeGraph.getKnowledgeConnections()` - BFS 算法遍历需求关系网络

**Hooks 集成** (`scripts/hooks/`)

- `post-req-update.js` - PostToolUse 钩子，记录工具调用到 execution.log
- `stop-req-summary.js` - Stop 钩子，生成需求执行总结

## 文件结构

```
scripts/                       # 核心脚本工具
├── requirement-manager/       # 需求管理器核心
│   ├── core/                  # processor.js, router.js, scheduler.js
│   ├── optimization/          # optimizer.js, evaluator.js, upgrader.js
│   ├── project-sync/          # 项目级文档自动维护（v0.11.0+）
│   │   ├── index.js           # 编排器
│   │   ├── structure-scanner.js
│   │   ├── requirements-aggregator.js
│   │   └── design-summarizer.js
│   ├── export/                # HTML 报告导出（v0.12.0+）
│   │   ├── index.js           # 编排入口
│   │   ├── collector.js       # 数据聚合
│   │   ├── renderer.js        # HTML 渲染
│   │   ├── writer.js          # 文件输出
│   │   ├── markdown.js        # 轻量 Markdown 渲染器
│   │   ├── types.js           # 类型/常量定义
│   │   └── utils.js           # XSS 转义等工具
│   └── utils/                 # storage.js, logger.js, id-generator.js
├── knowledge-graph/           # 向量知识图谱
├── hooks/                     # 自动化钩子
└── metrics/                   # 度量收集

skills/                        # Claude Code 技能定义
├── core/                      # 核心需求管理
│   ├── req-manager/           # 智能需求管理
│   ├── req-brainstorm/        # 深度需求分析
│   └── req-init/              # 需求系统初始化
├── quality/                   # 质量保证
│   ├── req-quality/           # 质量门禁
│   ├── req-test-plan/         # 测试策略
│   └── req-verify/            # 需求验证
├── analysis/                  # 分析评估
│   ├── req-priority/          # 优先级评估
│   └── req-metrics/           # 度量分析
├── change/                    # 变更处理
│   ├── req-change/            # 变更管理
│   └── req-migrate/           # 需求迁移
└── utils/                     # 辅助工具
    └── req-unify/             # 文档统一

commands/                      # Claude Code 命令定义
├── req.md                     # 主命令
├── req-init.md                # 初始化命令
├── req-update.md              # 更新命令
├── req-priority.md            # 优先级评估
├── req-quality.md             # 质量检查
└── ...                        # 其他命令

bin/                           # CLI 工具
├── claude-req-init            # 初始化命令
├── claude-req-update          # 更新命令
├── crs-export.js              # HTML 报告导出（v0.12.0+）
└── kg-cli.js                  # 知识图谱 CLI

hooks/                         # Hooks 配置
└── hooks.json                 # hooks 配置文件

tests/                         # 测试套件（142个测试用例）
├── test-import.test.js        # 导入测试
├── utils/                     # 工具函数测试
├── core/                      # 核心功能测试
├── knowledge-graph/           # 知识图谱测试
├── optimization/              # 优化模块测试
└── integration/               # 集成测试
```

## 开发规范

### Git 提交规范

遵循 Conventional Commits：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `test:` 添加测试
- `refactor:` 重构
- `chore:` 构建/工具变更

**自动化**：husky 配置了 pre-commit（运行 lint 和测试）和 commit-msg（检查格式）钩子。

### 代码风格

- **ESLint**: 项目配置，`npm run lint:fix` 自动修复
- **Prettier**: 代码格式化，`npm run format`
- **ES Modules**: 使用 `import/export`，`type: "module"`

### 测试要求

- 新功能必须添加对应测试用例
- 运行 `npm test` 确保所有测试通过
- 知识图谱模块有 19 个专项测试

## 技术决策

### 为什么使用 Fuse.js 而不是向量数据库？

Fuse.js 提供轻量级的模糊搜索能力，对于需求管理场景足够：

- 无需外部依赖，安装简单
- 性能良好（中小规模需求集）
- 支持中英文混合搜索
- 可配置权重和阈值

### 为什么使用 npm 全局安装？

- **一次安装，全局使用**：所有项目自动共享
- **项目更干净**：项目只包含数据（`.requirements/`），不包含系统文件
- **快速更新**：重新安装即可更新
- **跨平台支持**：npm 标准流程

### 需求 ID 生成规则

格式：`{前缀}-{日期}-{序号}-{hash}`

- 前缀：FEAT（功能）、BUG（缺陷）、QUES（问题）、ADJU（调整）、REF（重构）
- 日期：YYYYMMDD
- 序号（NNN）：三位数字，**默认进程内递增**（不持久化），跨进程可能重复
- hash：时间戳十六进制后 6 位，**保证全局唯一性**

示例：`FEAT-20260514-001-a3b2c1`

> 旧格式 `PREFIX-YYYYMMDD-NNN` 和 `PREFIX-NNNN` 仍被 parse() 支持（向后兼容）

#### ID 模式（v0.10.0+）

通过 `CRS_ID_MODE` 环境变量切换 NNN 部分的计算方式：

| 模式 | 默认 | NNN 来源 | 是否写文件 | 适用场景 |
|---|---|---|---|---|
| `fixed` | ✅ | 进程内递增（不持久化） | ❌ | 多人协作零合并冲突 |
| `hash_seq` | | hash 前 3 位（0-4095） | ❌ | 完全无状态 |
| `author_seq` | | `counters-{author}.json` 递增 | ✅ | 按作者隔离连续 NNN |
| `hostname_seq` | | `counters-{hostname}.json` 递增 | ✅ | 按机器隔离连续 NNN |

- `author_seq` 模式需设置 `CRS_AUTHOR` 环境变量（未设置时 fallback 到 `git config user.name`，再失败则用 `'unknown'`）
- 默认 `fixed` 模式不写 `counters.json`，多人 Git 合并不再冲突
- 全局唯一性始终由 hash 后缀保证（毫秒精度时间戳）

## 重要提示

### 项目级文档自动维护（v0.11.0+）

CRS 自动维护 `.requirements/project/` 目录，提供项目级"活文档"视图：

| 文档 | 内容来源 | 更新触发 |
|---|---|---|
| `project-structure.md` | 实际代码扫描（package.json + 目录树） | 初始化 / `crs-project-init --force` |
| `business-requirements.md` | 已完成 feature 需求聚合 | feature 状态变 done 时追加 |
| `functional-requirements.md` | 已完成需求（features + bugs + refactors） | 需求 done 时追加（幂等去重） |
| `functional-design.md` | 各需求 `spec/design.md` 聚合 + Bug 设计变更 | feature/refactor done 或 Bug design_change=true |
| `changelog.md` | 全部同步事件 | 每次同步追加（永不删除） |

**自动触发机制**：`processor.update()` 在状态变为 `done` 时调用 `project-sync`。

**手动操作**：
```bash
crs-project-init                              # 初始化
crs-project-init --force                      # 强制重建（保留 changelog）
crs-project-sync --full                       # 全量重生成
crs-project-sync --req-id FEAT-20260613-001   # 同步指定需求
```

**关闭同步**：`export CRS_PROJECT_SYNC=off`

**Bug 设计变更标记**：在 Bug 的 `spec/decisions.md` 增加 frontmatter：
```yaml
---
design_change: true
impact_areas: [模块A, 模块B]
---
```
未标记时使用关键词兜底检测（"重构"、"架构变更"等）。

### HTML 报告导出（v0.12.0+）

`crs-export` CLI 将 `.requirements/` 聚合导出为单文件 HTML 报告，便于团队评审、项目归档、跨团队共享。

```bash
crs-export                                # 默认导出（含 Mermaid CDN）
crs-export -o ./reports/v1.html           # 自定义输出路径
crs-export -t "v0.11.0 发布快照"           # 自定义标题
crs-export --offline                      # 离线模式（不加载 CDN）
crs-export --no-mermaid                   # 禁用依赖图
crs-export -q                             # 静默模式
```

报告内容：状态分布饼图（SVG 内联）、Mermaid 依赖关系图、需求列表（客户端过滤）、Changelog 时间线、需求详情（折叠）、项目级文档。

实现模块：`scripts/export/`（`collector.js` / `renderer.js` / `writer.js` / `markdown.js` / `utils.js`）。

### Hooks 配置

项目提供 hooks 配置模板（`hooks/hooks.json`），但**不会自动合并到用户 settings.json**。

如需启用自动化功能（需求跟踪、会话总结），需手动将 hooks 配置合并到 `.claude/settings.json`。

### 知识图谱同步

需求创建/更新/删除时会自动同步到知识图谱，失败不影响主流程（静默处理）。

### 独立安装架构

v0.6.0 起，文件复制到独立位置（`~/.claude/crs/`），避免依赖 npm 缓存。
