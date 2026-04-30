---
title: 自定义概览
description: 了解 VS Code 中的智能体自定义选项，包括自定义说明、提示词文件、智能体技能、自定义智能体、MCP 服务器和 Hooks。
source: https://code.visualstudio.com/docs/copilot/customization/overview
---

Visual Studio Code 提供多种方式，让你向 AI 讲授你的代码库、编码标准和工作流程。本文介绍自定义选项并帮助你快速上手。

了解不同的自定义类型以及何时使用每种类型。

要访问自定义内容，在聊天视图中选择**配置聊天（齿轮图标）**，打开[智能体(Agent)自定义编辑器](#_agent-customizations-editor)。

![智能体(Agent)自定义编辑器截图，显示带有自定义分类的侧边栏和列出自定义智能体(Custom Agent)的主视图。](/assets/docs/copilot/customization/chat-customizations-editor.png)

## 自定义场景

以下部分描述常见的自定义场景以及每个场景使用哪些选项。

### 定义编码标准

使用[自定义说明(Custom Instructions)](/docs/copilot/customization/custom-instructions)与 AI 分享项目范围的规则和约定。始终启用的说明适用于每个请求，而基于文件的说明针对特定文件类型或文件夹。例如，在所有文件中强制执行 ESLint 规则，并仅在 `.tsx` 文件中应用 React 模式。

### 自动化任务和工作流

为你经常运行的重复性任务创建[提示词(Prompt)文件](/docs/copilot/customization/prompt-files)，例如构建组件框架或准备拉取请求(Pull Request)。

对于涉及脚本和外部工具的更复杂的多步骤工作流，将它们打包为[智能体(Agent)技能](/docs/copilot/customization/agent-skills)。

### 专业化 AI

创建承担特定角色（如安全审查者、数据库管理员或规划师）的[自定义智能体(Custom Agent)](/docs/copilot/customization/custom-agents)。每个智能体(Agent)定义自己的行为、可用工具和语言模型(Language Model)偏好。为不同任务选择不同的[语言模型(Language Model)](/docs/copilot/customization/language-models)，或携带自己的 API 密钥访问其他模型。

### 发现并安装插件

安装[智能体(Agent)插件](/docs/copilot/customization/agent-plugins)（预览版），从插件市场添加预打包的自定义包。单个插件可以提供斜杠命令(Slash Command)、技能、自定义智能体(Custom Agent)、Hooks 和 MCP 服务器。

### 连接外部工具和数据

添加 [MCP 服务器](/docs/copilot/customization/mcp-servers)，通过[模型上下文协议](https://modelcontextprotocol.io/)让 AI 访问数据库、API 和其他服务。使用 [Hooks](/docs/copilot/customization/hooks) 在关键生命周期节点运行 Shell 命令，例如在每次文件编辑后运行格式化程序或强制执行安全策略。

## 快速上手

逐步实现 AI 自定义。从基础开始，根据需要添加更多。有关实践演练，请参阅[为你的项目自定义 AI](/docs/copilot/guides/customize-copilot-guide) 指南。

1. **初始化你的项目**：在聊天中输入 `/init`，生成为你的代码库定制编码标准的 `.github/copilot-instructions.md` 文件。

2. **添加有针对性的规则**：为代码库的特定部分创建基于文件的 `*.instructions.md` 文件，例如语言约定或框架模式。

3. **自动化重复任务**：为常用工作流创建提示词(Prompt)文件，并添加 MCP 服务器连接外部服务。

4. **创建专业工作流**：为特定角色构建自定义智能体(Custom Agent)。将可重用的能力打包为智能体(Agent)技能，以便跨工具共享。

5. **使用 AI 生成自定义内容**：在聊天中输入 `/create-prompt`、`/create-instruction`、`/create-skill`、`/create-agent` 或 `/create-hook`，使用 AI 辅助生成自定义文件。

## 父仓库发现

在 monorepo 设置中，你可能在 VS Code 中打开的是仓库的子文件夹而不是仓库根目录。默认情况下，Visual Studio Code 只在已打开的工作区文件夹中发现自定义文件。启用 `chat.useCustomizationsInParentRepositories` 设置，还可以从父仓库发现自定义内容。

启用此设置后，VS Code 从每个工作区文件夹向上遍历文件夹层级，直到找到 `.git` 文件夹。如果找到，它会从工作区文件夹和仓库根目录之间（含）的所有文件夹收集自定义内容。这适用于所有自定义类型：始终启用的说明（`copilot-instructions.md`、`AGENTS.md`、`CLAUDE.md`）、基于文件的说明、提示词(Prompt)文件、自定义智能体(Custom Agent)、智能体(Agent)技能和 Hooks。

例如，考虑以下 monorepo 结构：

```
my-monorepo/              # 仓库根目录（有 .git 文件夹）
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   └── style.instructions.md
│   ├── prompts/
│   │   └── review.prompt.md
│   └── agents/
│       └── reviewer.agent.md
├── packages/
│   └── frontend/          # 打开为工作区文件夹
│       └── src/
```

如果你只在 VS Code 中打开 `packages/frontend/` 并启用了该设置，VS Code 会发现仓库根目录的自定义文件，例如 `copilot-instructions.md`、`style.instructions.md`、`review.prompt.md` 和 `reviewer.agent.md`。

父仓库发现的条件：

- 工作区文件夹不包含 `.git` 文件夹（它本身不是仓库根目录）。
- 父文件夹包含 `.git` 文件夹。
- 父仓库文件夹是[受信任的](/docs/editing/workspaces/workspace-trust)。打开工作区时，VS Code 会提示你信任父文件夹。

> **注意**
> `chat.useCustomizationsInParentRepositories` 设置默认禁用。

## 智能体(Agent)自定义编辑器

> **注意**
> 智能体(Agent)自定义编辑器目前处于预览阶段。

智能体(Agent)自定义编辑器提供了一个集中的 UI，可在一个地方创建和管理所有智能体(Agent)自定义内容。编辑器将不同的自定义类型组织到单独的标签页中，并提供内嵌代码编辑器，用于编辑具有语法高亮和验证功能的自定义文件。

你可以通过编辑对应的 Markdown 从头创建新的自定义内容，或使用 AI 根据你的具体项目生成初始内容。

要添加 MCP 服务器和智能体(Agent)插件，可以直接从编辑器浏览对应的市场，安装新项目并管理现有项目。

![智能体(Agent)自定义编辑器截图，显示带有自定义分类的侧边栏和列出自定义智能体(Custom Agent)的主视图。](/assets/docs/copilot/customization/chat-customizations-editor.png)

要打开智能体(Agent)自定义编辑器，在聊天视图中选择**配置聊天（齿轮图标）**，或通过命令面板（⇧⌘P / Windows、Linux：Ctrl+Shift+P）运行 **Chat: Open Customizations** 命令。

你可以为不同的[智能体(Agent)类型](/docs/copilot/agents/overview#_types-of-agents)配置自定义内容：本地智能体(Local Agent)、Copilot CLI 和 Claude 智能体(Agent)。从编辑器顶部的下拉菜单选择智能体(Agent)类型，查看和管理该智能体(Agent)类型的自定义内容。

## 排除自定义问题

如果你的自定义内容未被应用或导致意外行为，选择聊天视图中的省略号（**...**）菜单，选择**显示智能体(Agent)调试日志**来[排除智能体(Agent)问题](/docs/copilot/troubleshooting)。

- [自定义概念](/docs/copilot/concepts/customization)
- [为你的项目自定义 AI 指南](/docs/copilot/guides/customize-copilot-guide)
