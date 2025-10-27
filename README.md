# Hydrogen Monorepo

[![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml) [![Deploy Australia](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-australia.yml/badge.svg?branch=main)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-australia.yml) [![Deploy Test](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-test.yml/badge.svg?branch=develop)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy-test.yml)

一个基于 **Shopify Hydrogen** 和 **React Router v7** 的现代化电商应用 Monorepo 项目。

## 📦 项目结构

```
hydrogen-monorepo/
├── .github/
│   ├── workflows/                  # GitHub Actions CI/CD
│   │   ├── ci.yml                 # 持续集成
│   │   ├── pr-check.yml           # PR 自动检查
│   │   ├── deploy-australia.yml   # 生产部署
│   │   └── deploy-test.yml        # 测试部署
│   ├── ISSUE_TEMPLATE/            # Issue 模板
│   └── pull_request_template.md   # PR 模板
├── apps/
│   ├── shopify-australia/         # Australia 商店
│   └── shopify-test/              # Test 商店
├── packages/
│   ├── lib/                       # 共享工具库
│   ├── components/                # 共享 React 组件库
│   ├── i18n/                      # 国际化支持
│   └── graphql/                   # GraphQL 查询和类型定义
├── package.json                   # 根配置
├── pnpm-workspace.yaml           # pnpm 工作区配置
└── turbo.json                    # Turborepo 配置
```

## 🏗️ 技术栈

### 核心框架

- **Shopify Hydrogen** `2025.7.0` - Shopify 官方的 React 电商框架
- **React Router v7** `7.9.2` - 现代化的路由解决方案
- **React** `18.3.1` - UI 框架
- **TypeScript** `5.9.2` - 类型安全

### 构建工具

- **Turborepo** `2.5.8` - Monorepo 构建系统
- **pnpm** `9.15.4` - 包管理器
- **Vite** `6.2.1` - 快速的开发服务器和构建工具
- **tsup** `8.5.0` - TypeScript 打包工具

### 样式

- **Tailwind CSS** `4.1.6` - 原子化 CSS 框架
- **SCSS** - CSS 预处理器
- **PostCSS** - CSS 后处理器（Autoprefixer + cssnano）

### GraphQL

- **GraphQL Codegen** - 自动生成 TypeScript 类型
- **Shopify Storefront API** - 前台 API
- **Shopify Admin API** - 后台 API

### 代码质量

- **ESLint** `9.18.0` - 代码检查
- **Prettier** - 代码格式化
- **TypeScript Strict Mode** - 严格类型检查
- **Husky** - Git hooks 管理
- **lint-staged** - 暂存文件检查
- **commitlint** - Commit 规范检查

### CI/CD

- **GitHub Actions** - 自动化 CI/CD 流程
- **自动部署** - 支持多环境部署
- **代码检查** - PR 自动质量检查
- **Dependabot** - 自动依赖更新

## 📚 包说明

### `apps/shopify-hydrogen`

主应用，包含所有的页面、路由和业务逻辑。

**依赖：**

- `@repo/lib` - 工具库
- `@repo/components` - 组件库
- `@repo/graphql` - GraphQL 查询

### `packages/lib` (`@repo/lib`)

共享的工具函数和自定义 Hooks。

**特性：**

- 无框架依赖的纯函数
- 自定义 React Hooks
- 类型安全的工具函数

### `packages/components` (`@repo/components`)

共享的 React 组件库。

**特性：**

- 可复用的 UI 组件
- 基于 Tailwind CSS
- 完整的 TypeScript 类型定义

**依赖：**

- `@repo/lib` - 工具库
- `@repo/graphql` - GraphQL 类型

### `packages/graphql` (`@repo/graphql`)

GraphQL 查询、Mutation 和自动生成的类型定义。

**导出模块：**

- `@repo/graphql/storefront` - Storefront API 查询
- `@repo/graphql/storefront/types` - Storefront 类型定义
- `@repo/graphql/admin` - Admin API 查询
- `@repo/graphql/admin/types` - Admin 类型定义

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** 9.15.4

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动所有项目
pnpm dev

# 仅启动主应用
pnpm dev:app

# 仅启动 lib 包
pnpm dev:lib

# 仅启动 components 包
pnpm dev:components
```

### 构建项目

```bash
# 构建所有项目
pnpm build

# 构建主应用
pnpm build:app

# 构建 lib 包
pnpm build:lib

# 构建 components 包
pnpm build:components
```

## 🔧 常用命令

### 在项目根目录

```bash
# 开发
pnpm dev                    # 启动所有项目
pnpm dev:app                # 仅启动主应用

# 构建
pnpm build                  # 构建所有项目
pnpm build:app              # 仅构建主应用

# 代码质量
pnpm lint                   # 检查所有项目
pnpm typecheck              # 类型检查所有项目

# Git 提交（推荐使用交互式工具）
pnpm commit                 # 使用 commitizen 交互式提交

# 部署
pnpm deploy                 # 部署到 Oxygen
```

### 在 Hydrogen 应用目录 (`apps/shopify-hydrogen/`)

```bash
# 开发
pnpm dev                    # 启动开发服务器

# 构建
pnpm build                  # 构建应用（会自动构建依赖包）
pnpm build:deps             # 仅构建依赖包

# 部署
pnpm deploy                 # 构建并部署到 Shopify Oxygen

# 预览
pnpm preview                # 本地预览生产构建

# 代码生成
pnpm codegen                # 生成 GraphQL 类型和路由类型

# 代码质量
pnpm lint                   # ESLint 检查
pnpm typecheck              # TypeScript 类型检查
```

## 📝 开发指南

### Git Commit 规范

**快速使用：**

```bash
# 1. 添加文件到暂存区
git add .

# 2. 使用交互式工具提交（推荐 - 中文界面）
pnpm commit
```

**交互式提交流程：**

使用 `pnpm commit` 后会看到中文交互提示：

1. **选择类型**：feat（新功能）、fix（修复）、docs（文档）等
2. **选择范围**（可选）：components、hooks、utils 等
3. **填写描述**：简短精炼的变更说明
4. **更多选项**：详细描述、breaking changes、关联 issue 等
5. **确认提交**：检查信息后确认

**手动提交：**

如果不使用交互式工具，需遵循以下格式：

```bash
git commit -m "feat: add user authentication"
git commit -m "fix(components): resolve login button issue"
git commit -m "docs: update README installation guide"
```

**Commit 格式：**

```
<type>(<scope>): <subject>

<body>

<footer>
```

- `type`: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- `scope`: (可选) 影响范围，如 components, hooks, utils 等
- `subject`: 简短描述，不超过 100 字符
- `body`: (可选) 详细描述
- `footer`: (可选) 关联 issue，如 closes #123

**自动检查：**

在 commit 时会自动执行：

- ✅ ESLint 代码检查和自动修复
- ✅ Prettier 代码格式化
- ✅ Commit 消息格式验证
- ✅ TypeScript 类型检查（可选）

**自定义配置：**

交互式提示的中文界面通过 `cz-git` 实现，配置文件位于 `commitlint.config.js`。您可以：

- 修改提示文字
- 自定义 scope 选项
- 调整规则严格程度
- 添加 emoji 支持

### 添加新的 GraphQL 查询

1. 在 `packages/graphql/src/storefront/` 或 `packages/graphql/src/admin/` 中添加 `.graphql` 文件
2. 运行 `pnpm --filter @repo/graphql graphql:generate` 生成类型
3. 重新构建 graphql 包：`pnpm --filter @repo/graphql build`

### 创建共享组件

1. 在 `packages/components/src/` 中创建组件
2. 在 `packages/components/src/index.ts` 中导出
3. 重新构建 components 包：`pnpm --filter @repo/components build`
4. 在主应用中导入：`import { YourComponent } from '@repo/components'`

### 添加工具函数

1. 在 `packages/lib/src/` 中创建函数
2. 在 `packages/lib/src/index.ts` 中导出
3. 重新构建 lib 包：`pnpm --filter @repo/lib build`
4. 在主应用中导入：`import { yourFunction } from '@repo/lib'`

## 🎯 Monorepo 优势

### 依赖管理

- 所有包共享相同的依赖版本
- 减少重复安装，节省磁盘空间
- pnpm workspace 确保依赖一致性

### 构建优化

- Turborepo 智能缓存，避免重复构建
- 并行构建，提升构建速度
- 自动处理包之间的依赖关系

### 代码复用

- 跨项目共享组件和工具
- 统一的代码规范和类型定义
- 便于重构和维护

## 🌐 部署

### 自动部署（推荐）

本项目已配置完整的 CI/CD 流程：

- **生产环境 (Australia)**: 合并到 `main` 分支自动部署
- **测试环境 (Test)**: 合并到 `develop` 分支自动部署

查看详细配置：[CI/CD 配置指南](.github/README.md)

### 手动部署

```bash
# Australia 商店
pnpm deploy:australia

# Test 商店
pnpm deploy:test
```

### 部署流程

1. 自动构建所有依赖包 (`@repo/lib`, `@repo/components`, `@repo/i18n`, `@repo/graphql`)
2. 构建对应的 Hydrogen 应用
3. 部署到 Shopify Oxygen 平台

### 🚀 首次设置 CI/CD

## 📖 重要说明

### React Router vs Remix

本项目使用 **React Router v7**，而不是 Remix。在查看文档或示例代码时，请注意：

**❌ 错误的导入（Remix 风格）：**

```typescript
import { useLoaderData } from '@remix-run/react';
```

**✅ 正确的导入（React Router 风格）：**

```typescript
import { useLoaderData } from 'react-router';
```

详见：[Remix to React Router 迁移指南](https://reactrouter.com/upgrading/remix)

### 包引用

在开发模式下，TypeScript 会直接引用源文件 (`src/index.ts`)，无需重新构建即可看到更改。

在生产构建时，使用编译后的文件 (`dist/index.js`)。

## 🔍 故障排查

### 类型错误

```bash
# 重新生成 React Router 类型
pnpm --filter shopify-hydrogen typecheck

# 重新生成 GraphQL 类型
pnpm --filter shopify-hydrogen codegen
```

### 构建失败

```bash
# 清理所有构建产物
find . -name 'dist' -type d -exec rm -rf {} +
find . -name 'node_modules' -type d -exec rm -rf {} +

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

### Monorepo 依赖问题

```bash
# 检查工作区依赖
pnpm list --depth 0

# 递归安装所有依赖
pnpm install -r
```
#   s h o p i f y - m o n o r e p o  
 