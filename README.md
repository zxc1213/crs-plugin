# ClaudeReqSys - 智能需求管理系统

智能需求管理与自动化执行系统，为 Claude Code 提供从需求到测试的全流程管理能力。

## 🌟 重要提示

**ClaudeReqSys 目前有两个版本可供选择**：

| 版本                         | 分支                       | 安装方式          | 适用场景                     |
| ---------------------------- | -------------------------- | ----------------- | ---------------------------- |
| **Claude Code 插件** ⭐ 推荐 | `feature/plugin-migration` | `/plugin install` | 原生集成，自动配置，最佳体验 |
| **npm 全局包**               | `master`                   | `npm install -g`  | 传统方式，需要手动配置       |

---

## ⚡ 快速开始

### 方式一：Claude Code 插件（推荐）⭐

```bash
# 从 feature/plugin-migration 分支安装
/plugin install https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration

# 安装后直接使用
/req 添加新功能
```

**优势**：

- ✅ 一键安装，自动配置
- ✅ hooks 自动生效
- ✅ 环境变量自动设置
- ✅ 支持插件版本管理和更新

**详细文档**：[README_PLUGIN.md](README_PLUGIN.md) | [安装指南](INSTALL.md)

### 方式二：npm 全局安装

```bash
# 从 master 分支安装
npm install -g github:zxc1213/claude-req-sys#master

# 或克隆安装
git clone https://github.com/zxc1213/claude-req-sys.git -b master claude-req-sys
cd claude-req-sys
npm install -g .
```

**注意**：npm 版本需要手动配置 hooks，详见 [VERSIONS.md](VERSIONS.md) 对比。

## 🚀 特性

- 📋 **多类型支持**：新功能、Bug 修复、技术问题、需求调整、重构
- 🤖 **智能自动化**：集成 brainstorming、systematic-debugging 等 skills
- 🧭 **统一入口**⭐：智能路由到最优流程，无需手动选择
- 🎯 **科学优先级**⭐：多维度评估优先级，优化资源分配
- ✅ **质量门禁**⭐：4个关键阶段自动检查，确保交付质量
- 📄 **统一文档**⭐：5个文件简化为2个，维护成本降低70%
- 🔍 **向量知识图谱**⭐：语义搜索相似需求，智能推荐相关功能
- 📊 **可视化仪表板**：实时查看项目状态和进度
- 🔗 **关系图谱**：管理需求间的依赖和关联
- 🧠 **智能去重**：自动检测相似需求，避免重复工作
- 🔒 **安全过滤**：自动检测和脱敏敏感信息
- 🌳 **Git 集成**：自动创建分支、生成 commit message
- 📈 **持续升级**：自我评价和优化系统性能
- 👥 **团队协作**：支持多人协作和权限管理
- 💰 **成本优化**：智能控制 Token 使用
- ⚠️ **智能配置合并**：自动合并 settings.json，不覆盖现有配置

## 🔄 更新方式

**Claude Code 插件更新**：

```bash
/plugin update claude-req-sys
# 或重新安装
/plugin install --force https://github.com/zxc1213/claude-req-sys/tree/feature/plugin-migration
```

**npm 全局包更新**：

```bash
npm install -g github:zxc1213/claude-req-sys#master
```

**详细安装指南**：

- **插件版本**：[INSTALL.md](INSTALL.md) | [README_PLUGIN.md](README_PLUGIN.md)
- **npm 版本**：[VERSIONS.md](VERSIONS.md)

## 使用

### 基本命令

```bash
/req 添加用户登录功能           # 创建新功能（智能推断类型和模式）⭐ 更新
/req --bug 登录页面异常        # Bug 报告
/req --question 性能优化       # 技术问题
/req --dashboard               # 查看仪表板
/req --list                    # 列出所有需求
```

### 新增功能 ⭐

**向量知识图谱**：

```bash
kg-search "用户登录" 10      # 搜索相似需求（返回前10个）
kg-stats                     # 查看知识图谱统计信息
kg-connections REQ-001       # 查看需求的知识关联
kg-recommend                 # 智能推荐相关需求
kg-rebuild                   # 重建知识图谱索引
```

**优先级管理**：

```bash
/req:priority --list               # 查看所有需求的优先级排序
/req:priority REQ-001              # 评估单个需求的优先级
/req:priority --compare REQ-001 REQ-002  # 比较两个需求
```

**质量检查**：

```bash
/req:quality REQ-001              # 质量门禁检查（自动推断检查点）
/req:quality REQ-001 --gate 1     # 指定检查点（1-4）
/req:verify REQ-001               # 验证检查清单
```

**文档管理**：

```bash
/req:unify REQ-001          # 统一文档格式
/req:migrate REQ-001        # 文档迁移（带备份）
/req:test-plan REQ-001      # 生成测试计划
```

### 工作流程 ⭐ 更新

```bash
# 1. 创建需求（自动触发完整流程）
/req 添加用户头像上传功能
  → req-manager 智能路由
  → req-brainstorm 深度分析
  → req-priority 优先级评估
  → req-quality 质量检查
  → 生成 spec.md 统一文档

# 2. 查看需求
/req --list                    # 列出所有需求
/req --active                  # 当前活跃需求

# 3. 查看优先级
/req:priority --list               # 按优先级排序

# 4. 开始实现
# 自动进入 executing-plans

# 5. 需要修改？
# 在执行中提出变更，自动触发 req-change
```

## 📁 项目结构

### 插件版本结构 (feature/plugin-migration)

```
claude-req-sys/
├── .claude-plugin/             # 插件清单
│   └── plugin.json             # 插件配置文件
├── skills/                     # Skills（12个）
│   ├── core/                   # 核心需求管理
│   ├── quality/                # 质量保证
│   ├── analysis/               # 分析评估
│   ├── change/                 # 变更处理
│   └── utils/                  # 辅助工具
├── commands/                   # Commands（13个）
├── hooks/                      # Hooks 配置
│   └── hooks.json
├── scripts/                    # 核心脚本
│   ├── requirement-manager/    # 需求管理器
│   ├── knowledge-graph/        # 向量知识图谱
│   ├── hooks/                  # 自动化钩子
│   └── metrics/                # 度量收集
├── bin/                        # CLI 工具
├── tests/                      # 测试文件
├── README_PLUGIN.md            # 插件版本文档
├── INSTALL.md                  # 安装指南
├── VERSIONS.md                 # 版本对比
└── package.json
```

### npm 版本结构 (master)

```
claude-req-sys/
├── src/                        # 源文件目录
│   ├── claude/                 # Claude Code 集成
│   │   ├── commands/           # 命令定义
│   │   └── skills/             # 技能集合
│   ├── scripts/                # 脚本工具
│   └── config/                 # 配置文件
├── bin/                        # CLI 命令
├── scripts/                    # npm 安装脚本
├── tests/                      # 测试文件
├── docs/                       # 文档
└── package.json
```

### 项目本地目录（通用）

```
your-project/
├── .requirements/              # 需求数据（项目本地）
│   ├── features/               # 新功能
│   ├── bugs/                   # Bug 修复
│   ├── questions/              # 技术问题
│   ├── adjustments/            # 需求调整
│   └── refactorings/           # 重构任务
└── docs/                       # 项目文档（可选）
```

## 📚 文档

### 插件版本 (feature/plugin-migration)

- [README_PLUGIN.md](README_PLUGIN.md) - 插件完整文档
- [INSTALL.md](INSTALL.md) - 插件安装指南
- [VERSIONS.md](VERSIONS.md) - 版本对比（插件 vs npm）

### npm 版本 (master)

- [用户指南](docs/guides/user-guide.md) - 功能使用说明
- [设计文档](docs/specs/2026-05-07-design.md) - 系统设计

## 📋 版本

### 当前版本

| 版本              | 分支                       | 状态    | 说明                       |
| ----------------- | -------------------------- | ------- | -------------------------- |
| **v0.6.0 Plugin** | `feature/plugin-migration` | ⭐ 推荐 | Claude Code 插件，原生集成 |
| **v0.6.0 npm**    | `master`                   | 稳定版  | npm 全局包，传统方式       |

### 插件版本特性 (feature/plugin-migration)

- ✅ **一键安装**：`/plugin install` 自动配置
- ✅ **自动生效**：hooks 自动合并，无需手动操作
- ✅ **环境变量**：`CLAUDE_REQ_SYS` 自动设置
- ✅ **版本管理**：支持插件更新和版本控制
- ✅ **完整功能**：所有核心功能（需求管理、知识图谱、质量门禁等）

### npm 版本特性 (master)

- ✅ **全局安装**：一次安装，所有项目共享
- ✅ **项目分离**：工具在全局，数据在项目
- ✅ **手动配置**：需要手动合并 hooks 配置
- ✅ **完整功能**：所有核心功能（同插件版）

### 历史版本

**v0.6.0 - 向量知识图谱**

- ✅ 向量知识图谱：基于 Fuse.js 实现语义搜索
- ✅ 智能相似度检测：自动发现相似需求
- ✅ 知识关联遍历：BFS 算法遍历需求关系网络
- ✅ CLI 工具集：kg-search、kg-stats、kg-connections、kg-recommend、kg-rebuild
- ✅ 142个测试用例：整体测试覆盖率提升

**v0.5.0 - 全局安装架构**

- ✅ 全局安装：一次安装，所有项目共享
- ✅ 项目分离：工具在全局，数据在项目
- ✅ 快速更新：`git pull && bash scripts/link-skills.sh`

**v0.3.0 - 系统优化升级**

- ✅ req-manager：统一入口，智能路由
- ✅ req-priority：科学评估优先级
- ✅ req-quality：4个质量门禁
- ✅ req-unify：统一文档结构

详细版本历史请查看各分支的 CHANGELOG.md。

## 测试 ⭐ 新增

项目包含完整的测试套件，确保代码质量和功能稳定性。

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并查看覆盖率
npm run test:coverage

# 监视模式（开发时使用）
npm run test:watch

# 显示详细输出
npm run test:verbose
```

### 测试结构

```
tests/
├── test-import.test.js     # 导入测试（1个测试）
├── utils/                  # 工具函数测试
│   ├── id-generator.test.js    # ID生成器测试（4个测试）
│   ├── logger.test.js          # 日志工具测试（4个测试）
│   └── storage.test.js         # 存储工具测试（4个测试）
├── core/                   # 核心功能测试
│   └── processor.test.js       # 需求处理器测试（32个测试）
├── knowledge-graph/       # 知识图谱测试 ⭐
│   └── index.test.js           # 知识图谱测试（19个测试）
├── optimization/           # 优化模块测试
│   ├── optimizer.test.js       # 优化器测试（12个测试）
│   ├── evaluator.test.js       # 评估器测试（21个测试）
│   └── upgrader.test.js        # 升级器测试（8个测试）
└── integration/            # 集成测试
    └── workflow.test.js        # 工作流测试（18个测试）
```

### 测试覆盖

- ✅ **142个测试用例**全部通过（包含19个知识图谱测试）⭐
- ✅ **11个测试文件**覆盖所有核心模块
- ✅ **集成测试**确保端到端功能正常
- ✅ **知识图谱专项测试**确保语义搜索和推荐功能稳定 ⭐

### 测试最佳实践

1. **运行测试前提交代码**：确保测试环境干净
2. **测试失败时**：检查修改是否影响现有功能
3. **添加新功能**：同时添加对应测试用例
4. **CI/CD**：GitHub Actions 自动运行所有测试

## 开发指南

### 快速开始

```bash
git clone https://github.com/zxc1213/claude-req-sys.git
cd claude-req-sys
npm install
```

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

````

### 代码规范

项目使用 **ESLint** 和 **Prettier** 确保代码质量：

```bash
# 检查代码规范
npm run lint

# 自动修复问题
npm run lint:fix

# 格式化代码
npm run format

# 检查格式
npm run format:check
````

### Git Hooks

项目配置了 **husky** 自动化Git钩子：

- **pre-commit**: 自动运行lint和测试
- **commit-msg**: 检查commit message格式

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### Commit Message 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构（既不是新功能也不是修复）
- `perf:` 性能优化
- `test:` 添加测试
- `chore:` 构建过程或辅助工具的变动

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- GitHub: [zxc1213/claude-req-sys](https://github.com/zxc1213/claude-req-sys)
- Issues: [GitHub Issues](https://github.com/zxc1213/claude-req-sys/issues)

---

**享受使用 Claude Code 需求管理系统！** 🚀
